import { IBuyer, TPayment } from '@/types';
import { IEvents } from '@/components/base/Events';

export class Buyer {
  payment: TPayment = '';
  address: string = '';
  email: string = '';
  phone: string = '';
  private events?: IEvents;

  constructor(events?: IEvents) {
    this.events = events;
  }

  set(field: keyof IBuyer, value: string | TPayment): void {
    (this as any)[field] = value;
    this.events?.emit('buyer:change', { field, value });
  }

  getData(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      email: this.email,
      phone: this.phone,
    };
  }

  clear(): void {
    this.payment = '';
    this.address = '';
    this.email = '';
    this.phone = '';
    this.events?.emit('buyer:change', {});
  }

  validate(): Partial<Record<keyof IBuyer, string>> {
    const errors: Partial<Record<keyof IBuyer, string>> = {};

    if (this.payment === '') {
      errors.payment = 'Не выбран способ оплаты';
    }

    if (this.address.trim() === '') {
      errors.address = 'Укажите адрес доставки';
    }

    if (this.email.trim() === '') {
      errors.email = 'Укажите email';
    }

    if (this.phone.trim() === '') {
      errors.phone = 'Укажите телефон';
    }

    return errors;
  }
}