// src/components/views/ProductCardBase.ts
import { Component } from '@/components/base/Component';
import { IProduct } from '@/types';
import { ensureElement } from '@/utils/utils';
import { CDN_URL, categoryMap } from '@/utils/constants';

// Тип для допустимых категорий
type Category = keyof typeof categoryMap;

export abstract class ProductCardBase<T> extends Component<T> {
  protected _title: HTMLElement;
  protected _category: HTMLElement | null;
  protected _price: HTMLElement | null;
  protected _image: HTMLImageElement | null;
  protected _product?: IProduct;

  constructor(container: HTMLElement) { // ← убрали events — не используется
    super(container);
    this._title = ensureElement<HTMLElement>('.card__title', this.container);
    this._category = this.container.querySelector('.card__category');
    this._price = this.container.querySelector('.card__price');
    this._image = this.container.querySelector('.card__image');
  }

  set title(value: string) {
    this._title.textContent = value;
  }

  set category(value: string) {
    if (this._category) {
      this._category.textContent = value;
      const key = value as Category;
      const className = categoryMap[key] || 'card__category_other';
      this._category.className = `card__category ${className}`;
    }
  }

  set price(value: number | null) {
    if (this._price) {
      if (value === null) {
        this._price.textContent = 'Бесценно';
      } else {
        this._price.textContent = `${value} синапсов`;
      }
    }
  }

  set image(value: string) {
    if (this._image) {
      const rawPath = value.startsWith('/') ? value : `/${value}`;
      const path = rawPath.replace(/\.svg$/i, '.png');
      this.setImage(this._image, CDN_URL + path);
      if (this._product?.title) {
        this._image.alt = this._product.title;
      }
    }
  }

  // Метод для установки товара — без вызова render
  set product(value: IProduct) {
    this._product = value;
    // Базовая синхронизация, учитывая опциональные элементы
    this.title = value.title;
    this.category = value.category;
    this.price = value.price;
    this.image = value.image;
  }
}