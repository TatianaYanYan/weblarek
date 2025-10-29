import { Component } from '@/components/base/Component';
import { IEvents } from '@/components/base/Events';
import { ensureElement } from '@/utils/utils';

// Экспортируем класс!
export abstract class Form<T> extends Component<T> {
  protected _form: HTMLFormElement;
  protected _submitBtn: HTMLButtonElement;
  protected _errorContainer: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container); // ← передаём container в Component

    this._form = this.container.tagName === 'FORM'
      ? this.container as HTMLFormElement
      : ensureElement<HTMLFormElement>('form', this.container);

    this._submitBtn = ensureElement<HTMLButtonElement>('.button', this.container);
    this._errorContainer = ensureElement<HTMLElement>('.form__errors', this.container);

    this._form.addEventListener('submit', (evt: Event) => {
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

  // Добавляем render(), унаследованный от Component
  // Component уже должен иметь render(), но если нет — добавим явно:
  render(): HTMLElement {
    return this.container;
  }

  abstract validate(): boolean;
}