// src/components/views/OrderFormStep1.ts
import { Form } from '@/components/views/Form';
import { TPayment } from '@/types';
import { ensureElement } from '@/utils/utils';
import { IEvents } from '@/components/base/Events'; // ← ДОБАВЛЕНО

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
      this.events.emit('order:payment', { payment: 'card' });
    });

    this._cashButton.addEventListener('click', () => {
      this.events.emit('order:payment', { payment: 'cash' });
    });

    this._addressInput.addEventListener('input', () => {
      this.events.emit('order:address', { address: this._addressInput.value });
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
    // Валидация выполняется на стороне модели/презентера
    return true;
  }
}

interface IOrderFormStep1Data {
  payment: TPayment;
  address: string;
}