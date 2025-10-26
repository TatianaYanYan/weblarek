// src/components/views/BasketCard.ts
import { ProductCardBase } from './ProductCardBase';
import { IProduct } from '../../types';
import { ensureElement } from '../../utils/utils';

export class BasketCard extends ProductCardBase<IBasketCardData> {
  private _index: HTMLElement;
  private _removeButton: HTMLButtonElement;

  // Принимаем только обработчик onRemove
  constructor(container: HTMLElement, onRemove: () => void) {
    super(container); // ← только один аргумент: container
    this._index = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this._removeButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    // Слушатель удаления
    this._removeButton.addEventListener('click', () => {
      onRemove();
    });
  }

  set index(value: number) {
    this._index.textContent = String(value);
  }

  // Переопределяем сеттер product для вызова render (если нужно)
  set product(value: IProduct) {
    super.product = value;
    // В корзине обычно обновляется только индекс и название,
    // но для единообразия можно вызвать render
    this.render({
      title: value.title,
      category: value.category,
      price: value.price,
      image: value.image,
      index: 0 // будет обновлено отдельно через set index
    });
  }
}

interface IBasketCardData {
  title: string;
  category: string;
  price: number | null;
  image: string;
  index: number;
}