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
  const el = cloneTemplate<HTMLElement>(tplOrder);
  const form1 = new OrderFormStep1(el, events);
  // заполнить текущими данными (если есть)
  form1.payment = buyer.getData().payment;
  form1.address = buyer.getData().address;
  form1.validate();
  // Обработка submit -> переход к шагу 2
  el.addEventListener('submit', () => {
    const { payment, address } = form1.data;
    buyer.set('payment', payment);
    buyer.set('address', address);
    openOrderStep2();
  });
  modal.content = form1.render();
  modal.open();
  isBasketOpen = false;
}

function openOrderStep2() {
  const el = cloneTemplate<HTMLElement>(tplContacts);
  const form2 = new OrderFormStep2(el, events);
  form2.email = buyer.getData().email;
  form2.phone = buyer.getData().phone;
  form2.validate();
  el.addEventListener('submit', async () => {
    const { email, phone } = form2.data;
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
      // Показать success
      const s = cloneTemplate<HTMLElement>(tplSuccess);
      const totalEl = s.querySelector('.order-success__description');
      if (totalEl) totalEl.textContent = `Списано ${res.total} синапсов`;
      modal.content = s;
      modal.open();
      cart.clear();
      buyer.clear();
    } catch (e) {
      console.error('Order error', e);
    }
  });
  modal.content = form2.render();
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
  const errors = buyer.validate();
  // подсветим кнопки в форме 1
  const container = ensureElement<HTMLElement>('#modal-container .order');
  const cardBtn = container.querySelector<HTMLButtonElement>('[name="card"]');
  const cashBtn = container.querySelector<HTMLButtonElement>('[name="cash"]');
  if (cardBtn && cashBtn) {
    cardBtn.classList.toggle('button_alt-active', payment === 'card');
    cashBtn.classList.toggle('button_alt-active', payment === 'cash');
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