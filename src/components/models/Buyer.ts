import { IBuyer, TPayment } from '../../types';

export class Buyer {
  payment: TPayment = '';
  address: string = '';
  email: string = '';
  phone: string = '';

  set(field: keyof IBuyer, value: string | TPayment): void {
    (this as any)[field] = value;
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