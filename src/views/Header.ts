// src/components/views/Header.ts
import { Component } from '@/components/base/Component';
import { IEvents } from '@/components/base/Events';
import { ensureElement } from '@/utils/utils';

export class Header extends Component<IHeaderData> {
  private _basketButton: HTMLButtonElement;
  private _counterElement: HTMLElement;
  protected events: IEvents; // ← сохраняем events для генерации событий

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events; // ← сохраняем ссылку
    this._basketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container);
    this._counterElement = ensureElement<HTMLElement>('.header__basket-counter', this.container);

    // Слушатель клика — генерируем событие
    this._basketButton.addEventListener('click', () => {
      this.events.emit('header:basket-open');
    });
  }

  set counter(value: number) {
    this._counterElement.textContent = String(value);
  }
}

interface IHeaderData {
  counter: number;
}