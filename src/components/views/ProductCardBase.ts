// src/components/views/ProductCardBase.ts
import { Component } from '@/components/base/Component';
import { IProduct } from '@/types';
import { ensureElement } from '@/utils/utils';
import { CDN_URL, categoryMap } from '@/utils/constants';

// Тип для допустимых категорий
type Category = keyof typeof categoryMap;

export abstract class ProductCardBase<T> extends Component<T> {
  protected _title: HTMLElement;
  protected _category: HTMLElement;
  protected _price: HTMLElement;
  protected _image: HTMLImageElement;
  protected _product?: IProduct; // ← опциональное поле

  constructor(container: HTMLElement) { // ← убрали events — не используется
    super(container);
    this._title = ensureElement<HTMLElement>('.card__title', this.container);
    this._category = ensureElement<HTMLElement>('.card__category', this.container);
    this._price = ensureElement<HTMLElement>('.card__price', this.container);
    this._image = ensureElement<HTMLImageElement>('.card__image', this.container);
  }

  set title(value: string) {
    this._title.textContent = value;
  }

  set category(value: string) {
    this._category.textContent = value;
    // Приводим значение к допустимому ключу
    const key = value as Category;
    const className = categoryMap[key] || 'card__category_other';
    this._category.className = `card__category ${className}`;
  }

  set price(value: number | null) {
    if (value === null) {
      this._price.textContent = 'Бесценно';
    } else {
      this._price.textContent = `${value} синапсов`;
    }
  }

  set image(value: string) {
    const rawPath = value.startsWith('/') ? value : `/${value}`;
    // Заменяем .svg на .png для цветных изображений как в макете
    const path = rawPath.replace(/\.svg$/i, '.png');
    this.setImage(this._image, CDN_URL + path);
    // Если this._product уже задан, обновим alt на название
    if (this._product?.title) {
      this._image.alt = this._product.title;
    }
  }

  // Метод для установки товара — без вызова render
  set product(value: IProduct) {
    this._product = value;
    // Дочерние классы сами вызовут render с нужными данными
    // Обновим базовые поля, чтобы не забыть alt у картинки
    this.title = value.title;
    this.category = value.category;
    this.price = value.price;
    this.image = value.image;
  }
}