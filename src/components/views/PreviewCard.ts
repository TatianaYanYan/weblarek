// src/components/views/PreviewCard.ts
import { ProductCardBase } from '@/components/views/ProductCardBase';
import { IProduct } from '@/types';
import { ensureElement } from '@/utils/utils';
import { IEvents } from '@/components/base/Events';

export class PreviewCard extends ProductCardBase<IPreviewCardData> {
  private _description: HTMLElement;
  private _button: HTMLButtonElement;
  private _id: string = '';
  private _unavailable: boolean = false;

  // Принимаем только обработчик onClick
  constructor(container: HTMLElement, private readonly events: IEvents) {
    super(container);
    this._description = ensureElement<HTMLElement>('.card__text', this.container);
    this._button = ensureElement<HTMLButtonElement>('.card__button', this.container);

    // Слушатель клика по кнопке
    this._button.addEventListener('click', () => {
      if (!this._id) return;
      this.events.emit('preview:toggle', { id: this._id });
    });
  }

  set description(value: string) {
    this._description.textContent = value;
  }

  set inCart(value: boolean) {
    if (this._unavailable) {
      this._button.disabled = true;
      this._button.textContent = 'Недоступно';
    } else {
      this._button.disabled = false;
      this._button.textContent = value ? 'Удалить из корзины' : 'Купить';
    }
  }

  // Переопределяем сеттер product для вызова render
  set product(value: IProduct) {
    this._id = value.id;
    this._unavailable = value.price === null;
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