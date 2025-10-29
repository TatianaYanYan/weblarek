import '@/scss/styles.scss';
import { Catalog } from '@/components/models/Catalog';
import { Cart } from '@/components/models/Cart';
import { Buyer } from '@/components/models/Buyer';
import { Api } from '@/components/base/Api';
import { LarekAPI } from '@/components/Api/LarekAPI';
import { API_URL } from '@/utils/constants';
import { EventEmitter } from '@/components/base/Events';
import { ensureElement, cloneTemplate } from '@/utils/utils';
import { Gallery } from '@/components/views/Gallery';
import { Header } from '@/components/views/Header';
import { Modal } from '@/components/views/Modal';
import { CatalogCard } from '@/components/views/CatalogCard';
import { PreviewCard } from '@/components/views/PreviewCard';
import { Basket } from '@/components/views/Basket';
import { BasketCard } from '@/components/views/BasketCard';
import { OrderFormStep1 } from '@/components/views/OrderFormStep1';
import { OrderFormStep2 } from '@/components/views/OrderFormStep2';
import { SuccessModal } from '@/components/views/SuccessModal';

// === Инициализация инфраструктуры ===
const events = new EventEmitter();
const api = new Api(API_URL);
const larekApi = new LarekAPI(api);

// === Модели данных с событиями ===
const catalog = new Catalog(events);
const cart = new Cart(events);
const buyer = new Buyer(events);

// === Представления ===
const galleryRoot = ensureElement<HTMLElement>('.gallery');
const gallery = new Gallery(galleryRoot);

const headerRoot = ensureElement<HTMLElement>('.header');
const header = new Header(headerRoot, events);

const modalRoot = ensureElement<HTMLElement>('#modal-container');
const modal = new Modal(modalRoot);

// Шаблоны
const tplCardCatalog = ensureElement<HTMLTemplateElement>('#card-catalog');
const tplCardPreview = ensureElement<HTMLTemplateElement>('#card-preview');
const tplBasket = ensureElement<HTMLTemplateElement>('#basket');
const tplOrder = ensureElement<HTMLTemplateElement>('#order');
const tplContacts = ensureElement<HTMLTemplateElement>('#contacts');
const tplSuccess = ensureElement<HTMLTemplateElement>('#success');

// === Вспомогательные функции рендера ===

// Постоянные ссылки на формы, чтобы не пересоздавать представления при каждом ивенте
let orderForm1: OrderFormStep1 | null = null;
let orderForm2: OrderFormStep2 | null = null;
function renderCatalog() {
  const items = catalog.getItems().map((product) => {
    const el = cloneTemplate<HTMLElement>(tplCardCatalog);
    const card = new CatalogCard(el, events);
    // данные только для отображения
    card.product = product;
    return card.render();
  });
  gallery.catalog = items;
}

function openProductPreview() {
  const product = catalog.getSelected();
  if (!product) return;
  const el = cloneTemplate<HTMLElement>(tplCardPreview);
  const preview = new PreviewCard(el, events);
  preview.product = product;
  preview.inCart = cart.has(product.id);
  modal.content = preview.render();
  modal.open();
}

let isBasketOpen = false;
function openBasket() {
  const el = cloneTemplate<HTMLElement>(tplBasket);
  const basketView = new Basket(el, events);
  // создаём элементы из темплейта basket-item
  const itemTpl = ensureElement<HTMLTemplateElement>('#card-basket');
  const itemElements = cart.getItems().map((p, idx) => {
    const li = cloneTemplate<HTMLElement>(itemTpl);
    const item = new BasketCard(li, (id: string) => events.emit('basket:remove', { id }));
    item.product = p;
    item.index = idx + 1;
    return item.render();
  });
  basketView.items = itemElements;
  basketView.total = cart.getTotal();
  modal.content = basketView.render();
  modal.open();
  isBasketOpen = true;
}

function openOrderStep1() {
  if (!orderForm1) {
    const el = cloneTemplate<HTMLElement>(tplOrder);
    orderForm1 = new OrderFormStep1(el, events);
    // Обработка submit -> переход к шагу 2 (навешиваем один раз)
    el.addEventListener('submit', () => {
      const { payment, address } = orderForm1!.data;
      buyer.set('payment', payment);
      buyer.set('address', address);
      openOrderStep2();
    });
  }
  // заполнить текущими данными (если есть)
  orderForm1.payment = buyer.getData().payment;
  orderForm1.address = buyer.getData().address;
  orderForm1.validate();
  modal.content = orderForm1.render();
  modal.open();
  isBasketOpen = false;
}

function openOrderStep2() {
  if (!orderForm2) {
    const el = cloneTemplate<HTMLElement>(tplContacts);
    orderForm2 = new OrderFormStep2(el, events);
    el.addEventListener('submit', async () => {
      const { email, phone } = orderForm2!.data;
      buyer.set('email', email);
      buyer.set('phone', phone);
      // Отправка заказа
      const order = {
        payment: buyer.getData().payment,
        email: buyer.getData().email,
        phone: buyer.getData().phone,
        address: buyer.getData().address,
        total: cart.getTotal(),
        items: cart.getItems().map((p) => p.id)
      };
      try {
        const res = await larekApi.createOrder(order);
        // Показать success через представление
        const successEl = cloneTemplate<HTMLElement>(tplSuccess);
        const successView = new SuccessModal(successEl, events);
        modal.content = successView.render({ total: res.total });
        modal.open();
        cart.clear();
        buyer.clear();
      } catch (e) {
        console.error('Order error', e);
      }
    });
  }
  orderForm2.email = buyer.getData().email;
  orderForm2.phone = buyer.getData().phone;
  orderForm2.validate();
  modal.content = orderForm2.render();
  modal.open();
  isBasketOpen = false;
}

// === Подписки на события моделей ===
events.on('catalog:change', () => renderCatalog());

events.on<{ id: string }>('catalog:select', ({ id }) => {
  const prod = catalog.getItemById(id);
  if (prod) catalog.setSelected(prod);
});
events.on('catalog:selected', () => openProductPreview());

events.on('cart:change', () => {
  header.counter = cart.getCount();
  if (isBasketOpen) openBasket();
});

// Реакции на поля форм: данные -> модель -> валидация -> ошибки в форме
events.on<{ payment: 'card' | 'cash' }>('order:payment', ({ payment }) => {
  buyer.set('payment', payment);
  buyer.validate();
  // Обновляем состояние кнопок через представление формы шага 1
  if (orderForm1) {
    orderForm1.payment = payment;
  }
});
events.on<{ address: string }>('order:address', ({ address }) => {
  buyer.set('address', address);
});
events.on<{ email: string }>('contacts:email', ({ email }) => {
  buyer.set('email', email);
});
events.on<{ phone: string }>('contacts:phone', ({ phone }) => {
  buyer.set('phone', phone);
});

// Закрытие success-модалки по событию от представления
events.on('success:close', () => {
  modal.close();
});

// === Подписки на события UI ===
events.on('header:basket-open', () => openBasket());
events.on('basket:submit', () => openOrderStep1());
events.on<{ id: string }>('basket:remove', ({ id }) => {
  const item = cart.getItems().find((p) => p.id === id);
  if (item) cart.remove(item);
});
events.on<{ id: string }>('preview:toggle', ({ id }) => {
  const item = catalog.getItemById(id);
  if (!item) return;
  if (item.price === null) return;
  if (cart.has(id)) cart.remove(item); else cart.add(item);
  // по требованию: после действия модалка закрывается
  modal.close();
});

// === Старт: загрузка каталога ===
larekApi.getProducts()
  .then(products => catalog.setItems(products))
  .catch(error => console.error('❌ Ошибка при загрузке товаров с сервера:', error));