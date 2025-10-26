// src/components/views/CatalogCard.ts
import { ProductCardBase } from '@/components/views/ProductCardBase';
import { IProduct } from '@/types';
import { ensureElement } from '@/utils/utils';

export class CatalogCard extends ProductCardBase<ICatalogCardData> {
  // Принимаем обработчик onClick вместо events
  constructor(container: HTMLElement, onClick: () => void) {
    super(container); // ← не передаём events, так как он не нужен

    // Слушатель клика — вызываем переданный обработчик
    this.container.addEventListener('click', () => {
      onClick();
    });
  }

  // В карточке каталога нет кнопки покупки — состояние inCart не отображается
  set inCart(_: boolean) { /* noop */ }

  // Переопределяем сеттер product, чтобы вызвать render с нужными данными
  set product(value: IProduct) {
    super.product = value;
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