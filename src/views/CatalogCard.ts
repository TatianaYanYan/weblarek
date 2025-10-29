// src/components/views/CatalogCard.ts
import { ProductCardBase } from '@/components/views/ProductCardBase';
import { IProduct } from '@/types';
import { IEvents } from '@/components/base/Events';

export class CatalogCard extends ProductCardBase<ICatalogCardData> {
  private _id: string = '';
  constructor(container: HTMLElement, private readonly events: IEvents) {
    super(container);
    this.container.addEventListener('click', () => {
      if (this._id) this.events.emit('catalog:select', { id: this._id });
    });
  }

  // В карточке каталога нет кнопки покупки — состояние inCart не отображается
  set inCart(_: boolean) { /* noop */ }

  // Переопределяем сеттер product, чтобы вызвать render с нужными данными
  set product(value: IProduct) {
    this._id = value.id;
    this.render({
      title: value.title,
      category: value.category,
      price: value.price,
      image: value.image,
      inCart: false
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