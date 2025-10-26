// src/components/views/OrderFormStep2.ts
import { Form } from '@/components/views/Form';
import { ensureElement } from '@/utils/utils';
import { IEvents } from '@/components/base/Events'; // ← ДОБАВЛЕНО

export class OrderFormStep2 extends Form<IOrderFormStep2Data> {
  private _emailInput: HTMLInputElement;
  private _phoneInput: HTMLInputElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events); // ← передаём events родителю
    this._emailInput = ensureElement<HTMLInputElement>('[name="email"]', this.container);
    this._phoneInput = ensureElement<HTMLInputElement>('[name="phone"]', this.container);

    // Установка слушателей
    this._emailInput.addEventListener('input', () => {
      this.events.emit('form:change');
    });

    this._phoneInput.addEventListener('input', () => {
      this.events.emit('form:change');
    });
  }

  set email(value: string) {
    this._emailInput.value = value;
  }

  set phone(value: string) {
    this._phoneInput.value = value;
  }

  get data(): { email: string; phone: string } {
    return {
      email: this._emailInput.value.trim(),
      phone: this._phoneInput.value.trim(),
    };
  }

  validate(): boolean {
    const errors: Partial<Record<keyof IOrderFormStep2Data, string>> = {};

    if (!this._emailInput.value.trim()) {
      errors.email = 'Укажите email';
    }

    if (!this._phoneInput.value.trim()) {
      errors.phone = 'Укажите телефон';
    }

    this.setErrors(errors);
    this[Object.keys(errors).length ? 'disableSubmit' : 'enableSubmit']();

    return Object.keys(errors).length === 0;
  }
}

interface IOrderFormStep2Data {
  email: string;
  phone: string;
}