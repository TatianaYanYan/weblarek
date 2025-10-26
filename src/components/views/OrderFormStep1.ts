// src/components/views/OrderFormStep1.ts
import { Form } from './Form';
import { TPayment } from '../../types';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events'; // ← ДОБАВЛЕНО

export class OrderFormStep1 extends Form<IOrderFormStep1Data> {
  private _cardButton: HTMLButtonElement;
  private _cashButton: HTMLButtonElement;
  private _addressInput: HTMLInputElement;
  private _payment: TPayment = '';

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events); // ← передаём events родителю
    this._cardButton = ensureElement<HTMLButtonElement>('[name="card"]', this.container);
    this._cashButton = ensureElement<HTMLButtonElement>('[name="cash"]', this.container);
    this._addressInput = ensureElement<HTMLInputElement>('[name="address"]', this.container);

    // Установка слушателей
    this._cardButton.addEventListener('click', () => {
      this.payment = 'card';
      this.events.emit('form:change');
    });

    this._cashButton.addEventListener('click', () => {
      this.payment = 'cash';
      this.events.emit('form:change');
    });

    this._addressInput.addEventListener('input', () => {
      this.events.emit('form:change');
    });
  }

  set payment(value: TPayment) {
    this._payment = value;
    this._cardButton.classList.toggle('button_alt-active', value === 'card');
    this._cashButton.classList.toggle('button_alt-active', value === 'cash');
  }

  set address(value: string) {
    this._addressInput.value = value;
  }

  get data(): { payment: TPayment; address: string } {
    return {
      payment: this._payment,
      address: this._addressInput.value.trim(),
    };
  }

  validate(): boolean {
    const errors: Partial<Record<keyof IOrderFormStep1Data, string>> = {};

    if (!this._payment) {
      errors.payment = 'Не выбран способ оплаты';
    }

    if (!this._addressInput.value.trim()) {
      errors.address = 'Укажите адрес доставки';
    }

    this.setErrors(errors);
    this[Object.keys(errors).length ? 'disableSubmit' : 'enableSubmit']();

    return Object.keys(errors).length === 0;
  }
}

interface IOrderFormStep1Data {
  payment: TPayment;
  address: string;
}