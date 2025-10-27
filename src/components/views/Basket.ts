// src/components/views/Basket.ts
import { Component } from '@/components/base/Component';
import { IEvents } from '@/components/base/Events';
import { IProduct } from '@/types';
import { ensureElement } from '@/utils/utils';

export class Basket extends Component<IBasketData> {
  private _list: HTMLElement;
  private _total: HTMLElement;
  private _button: HTMLButtonElement;
  protected events: IEvents;
  private _items: HTMLElement[] = [];

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this._list = ensureElement<HTMLElement>('.basket__list', this.container);
    this._total = ensureElement<HTMLElement>('.basket__price', this.container);
    this._button = ensureElement<HTMLButtonElement>('.basket__button', this.container);

    this._button.addEventListener('click', () => {
      this.events.emit('basket:submit', {}); // ← тоже объект
    });
  }

  set items(value: HTMLElement[]) {
    this._items = value;
    if (value.length === 0) {
      this._list.innerHTML = '<p class="basket__empty">Корзина пуста</p>';
      this._button.disabled = true;
    } else {
      this._button.disabled = false;
      this._list.replaceChildren(...value);
    }
  }

  set total(value: number) {
    this._total.textContent = `${value} синапсов`;
  }

  set isEmpty(value: boolean) {
    if (value) {
      this.items = [];
    }
  }
}

interface IBasketData {
  items: IProduct[];
  total: number;
  isEmpty: boolean;
}