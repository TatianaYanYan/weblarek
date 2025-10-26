// src/components/views/Modal.ts
import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export class Modal extends Component<IModalData> {
  private _closeButton: HTMLButtonElement;
  private _content: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
    this._content = ensureElement<HTMLElement>('.modal__content', this.container);

    // Закрытие по крестику
    this._closeButton.addEventListener('click', () => {
      this.close();
    });

    // Закрытие по клику вне контента
    this.container.addEventListener('click', (evt) => {
      if (evt.target === this.container) {
        this.close();
      }
    });
  }

  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
  }

  open() {
    this.container.classList.add('modal_active');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.container.classList.remove('modal_active');
    document.body.style.overflow = '';
  }
}

interface IModalData {
  content: HTMLElement;
}