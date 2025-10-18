import './scss/styles.scss';
import { Catalog } from './components/models/Catalog';
import { Cart } from './components/models/Cart';
import { Buyer } from './components/models/Buyer';
import { apiProducts } from './utils/data';

// === Тест Catalog ===
const catalog = new Catalog();
catalog.setItems(apiProducts.items);
console.log('Массив товаров из каталога:', catalog.getItems());

const firstProduct = catalog.getItemById(apiProducts.items[0].id);
if (firstProduct) {
  catalog.setSelected(firstProduct);
  console.log('Выбранный товар:', catalog.getSelected());
}

// === Тест Cart ===
const cart = new Cart();
cart.add(apiProducts.items[0]);
cart.add(apiProducts.items[1]);
console.log('Товары в корзине:', cart.getItems());
console.log('Общая стоимость:', cart.getTotal());
console.log('Количество товаров:', cart.getCount());
console.log('Есть ли первый товар в корзине?', cart.has(apiProducts.items[0].id));

cart.remove(apiProducts.items[0]);
console.log('После удаления первого товара:', cart.getItems());

// === Тест Buyer ===
const buyer = new Buyer();
buyer.set('address', 'Москва, Тверская 1');
buyer.set('payment', 'card');
console.log('Данные покупателя:', buyer.getData());
console.log('Валидация (неполная):', buyer.validate());

buyer.set('email', 'test@example.com');
buyer.set('phone', '+79991234567');
console.log('Полные данные покупателя:', buyer.getData());
console.log('Валидация (полная):', buyer.validate());

buyer.clear();
console.log('После очистки:', buyer.getData());
console.log('Валидация после очистки:', buyer.validate());


// === Загрузка с сервера ===
import { Api } from './components/base/Api';
import { LarekAPI } from './components/Api/LarekAPI';
import { API_URL } from './utils/constants';

const api = new Api(API_URL);
const larekApi = new LarekAPI(api);

larekApi.getProducts()
  .then(products => {
    catalog.setItems(products);
    console.log('✅ Товары успешно загружены с сервера:', catalog.getItems());
  })
  .catch(error => {
    console.error('❌ Ошибка при загрузке товаров с сервера:', error);
  });