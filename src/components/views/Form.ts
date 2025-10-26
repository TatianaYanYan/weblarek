// src/components/views/Form.ts
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export abstract class Form<T> extends Component<T> {
  protected _form: HTMLFormElement;
  protected _submitBtn: HTMLButtonElement;
  protected _errorContainer: HTMLElement;
  protected events: IEvents; // ← сохраняем events для дочерних классов

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events; // ← сохраняем ссылку
    this._form = ensureElement<HTMLFormElement>('form', this.container);
    this._submitBtn = ensureElement<HTMLButtonElement>('.button', this.container);
    this._errorContainer = ensureElement<HTMLElement>('.form__errors', this.container);

    // Блокируем стандартную отправку формы
    this._form.addEventListener('submit', (evt) => {
      evt.preventDefault();
    });
  }

  setErrors(errors: Record<string, string>) {
    const errorMessages = Object.values(errors).join('; ');
    this._errorContainer.textContent = errorMessages;
  }

  clearErrors() {
    this._errorContainer.textContent = '';
  }

  enableSubmit() {
    this._submitBtn.disabled = false;
  }

  disableSubmit() {
    this._submitBtn.disabled = true;
  }

  // Абстрактный метод валидации — должен быть реализован в дочерних классах
  abstract validate(): boolean;
}