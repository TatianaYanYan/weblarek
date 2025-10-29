// src/components/views/Page.ts
import { IEvents } from '../base/Events';
import { IPageState } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

export class Page extends Component<IPageState> {
	protected _cartCounter: HTMLElement;
	protected _gallery: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _basketButton: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		// Находим элементы по селекторам из вашей вёрстки
		this._cartCounter = ensureElement<HTMLElement>('.header__basket-counter', container);
		this._gallery = ensureElement<HTMLElement>('.gallery', container);
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper', container);
		this._basketButton = ensureElement<HTMLElement>('.header__basket', container);

		// Обработчик открытия корзины
		this._basketButton.addEventListener('click', () => {
			this.events.emit('page:basket-open');
		});
	}

	// Обновляет счётчик товаров в корзине
	set cartCounter(value: number) {
		this._cartCounter.textContent = String(value);
	}

	// Обновляет каталог товаров
	set catalog(items: HTMLElement[]) {
		this._gallery.replaceChildren(...items);
	}

	// Блокировка прокрутки страницы (для модальных окон)
	set locked(value: boolean) {
		if (value) {
			this._wrapper.classList.add('page__wrapper_locked');
		} else {
			this._wrapper.classList.remove('page__wrapper_locked');
		}
	}
}