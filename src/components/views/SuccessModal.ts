// src/components/views/SuccessModal.ts
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class SuccessModal extends Component<ISuccessModalData> {
  private _closeButton: HTMLButtonElement;
  protected events: IEvents; // ← сохраняем events для генерации событий

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events; // ← сохраняем ссылку
    this._closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

    // Слушатель клика — генерируем событие
    this._closeButton.addEventListener('click', () => {
      this.events.emit('success:close', {}); // ← передаём пустой объект
    });
  }

  set total(value: number) {
    const description = ensureElement<HTMLElement>('.order-success__description', this.container);
    description.textContent = `Списано ${value} синапсов`;
  }
}

interface ISuccessModalData {
  total: number;
}