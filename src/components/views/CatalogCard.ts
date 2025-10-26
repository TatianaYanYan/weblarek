// src/components/views/CatalogCard.ts
import { ProductCardBase } from './ProductCardBase';
import { IProduct } from '../../types';
import { ensureElement } from '../../utils/utils';

export class CatalogCard extends ProductCardBase<ICatalogCardData> {
  private _button: HTMLButtonElement;

  // Принимаем обработчик onClick вместо events
  constructor(container: HTMLElement, onClick: () => void) {
    super(container); // ← не передаём events, так как он не нужен
    this._button = ensureElement<HTMLButtonElement>('.card__button', this.container);

    // Слушатель клика — вызываем переданный обработчик
    this.container.addEventListener('click', () => {
      onClick();
    });
  }

  set inCart(value: boolean) {
    this._button.textContent = value ? 'Удалить из корзины' : 'Купить';
  }

  // Переопределяем сеттер product, чтобы вызвать render с нужными данными
  set product(value: IProduct) {
    super.product = value;
    this.render({
      title: value.title,
      category: value.category,
      price: value.price,
      image: value.image,
      inCart: false // будет обновлено позже через отдельный вызов set inCart
    });
  }
}

interface ICatalogCardData {
  title: string;
  category: string;
  price: number | null;
  image: string;
  inCart: boolean;
}