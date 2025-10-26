// src/components/views/PreviewCard.ts
import { ProductCardBase } from './ProductCardBase';
import { IProduct } from '../../types';
import { ensureElement } from '../../utils/utils';

export class PreviewCard extends ProductCardBase<IPreviewCardData> {
  private _description: HTMLElement;
  private _button: HTMLButtonElement;

  // Принимаем только обработчик onClick
  constructor(container: HTMLElement, onClick: () => void) {
    super(container); // ← только один аргумент: container
    this._description = ensureElement<HTMLElement>('.card__text', this.container);
    this._button = ensureElement<HTMLButtonElement>('.card__button', this.container);

    // Слушатель клика по кнопке
    this._button.addEventListener('click', () => {
      onClick();
    });
  }

  set description(value: string) {
    this._description.textContent = value;
  }

  set inCart(value: boolean) {
    this._button.textContent = value ? 'Удалить из корзины' : 'Купить';
  }

  // Переопределяем сеттер product для вызова render
  set product(value: IProduct) {
    super.product = value;
    this.render({
      title: value.title,
      category: value.category,
      price: value.price,
      image: value.image,
      description: value.description,
      inCart: false // будет обновлено отдельно
    });
  }
}

interface IPreviewCardData {
  title: string;
  category: string;
  price: number | null;
  image: string;
  description: string;
  inCart: boolean;
}