// src/components/views/Basket.ts
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { IProduct } from '../../types';
import { ensureElement } from '../../utils/utils';

export class Basket extends Component<IBasketData> {
  private _list: HTMLElement;
  private _total: HTMLElement;
  private _button: HTMLButtonElement;
  private _emptyMessage: HTMLElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this._list = ensureElement<HTMLElement>('.basket__list', this.container);
    this._total = ensureElement<HTMLElement>('.basket__price', this.container);
    this._button = ensureElement<HTMLButtonElement>('.basket__button', this.container);
    this._emptyMessage = ensureElement<HTMLElement>('.basket__empty', this.container);

    this._button.addEventListener('click', () => {
      this.events.emit('basket:submit', {}); // ← тоже объект
    });
  }

  set items(value: IProduct[]) {
    if (value.length === 0) {
      this._list.innerHTML = '';
      this._emptyMessage.style.display = 'block';
      this._button.disabled = true;
    } else {
      this._emptyMessage.style.display = 'none';
      this._button.disabled = false;
      this._list.innerHTML = value.map((item, index) => `
        <li class="basket__item card card_compact">
          <span class="basket__item-index">${index + 1}</span>
          <span class="card__title">${item.title}</span>
          <span class="card__price">${item.price !== null ? item.price + ' руб.' : 'Недоступно'}</span>
          <button class="basket__item-delete card__button" data-id="${item.id}" aria-label="удалить"></button>
        </li>
      `).join('');

      this._list.querySelectorAll('.basket__item-delete').forEach(btn => {
        btn.addEventListener('click', (evt) => {
          const id = (evt.target as HTMLElement).dataset.id;
          if (id) {
            this.events.emit('basket:remove', { id }); // ✅ объект
          }
        });
      });
    }
  }

  set total(value: number) {
    this._total.textContent = `${value} руб.`;
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