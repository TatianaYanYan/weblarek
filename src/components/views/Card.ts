// src/components/views/Card.ts
import { IProduct } from '../../types';
import { categoryMap, CDN_URL } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';

// Новые типы — добавим в src/types/index.ts (см. ниже)
export interface ICardData {
	title: string;
	image: string;
	category: string;
	price: number | null;
	description?: string;
	inCart: boolean;
}

export interface ICardActions {
	onClick: () => void;
	onSelect: () => void;
}

export class Card extends Component<ICardData> {
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _category: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _description?: HTMLElement;

	constructor(
		container: HTMLElement,
		protected events: EventEmitter,
		actions?: ICardActions
	) {
		super(container);

		// Находим все элементы по селекторам из вашей вёрстки
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._image = ensureElement<HTMLImageElement>('.card__image', container);
		this._category = ensureElement<HTMLElement>('.card__category', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._button = ensureElement<HTMLButtonElement>('.card__button', container);

		// Описание есть только в card-preview
		this._description = container.querySelector<HTMLElement>('.card__text') ?? undefined;

		// Обработчики событий — только в конструкторе
		if (actions?.onSelect) {
			// Клик по карточке (но не по кнопке) → открыть модалку
			container.addEventListener('click', (evt) => {
				if ((evt.target as HTMLElement).closest('.card__button')) return;
				actions.onSelect();
			});
		}

		if (actions?.onClick) {
			this._button.addEventListener('click', actions.onClick);
		}
	}

	// === Сеттеры — только для обновления DOM ===

	set title(value: string) {
		this._title.textContent = value;
	}

	set image(value: string) {
		this.setImage(this._image, CDN_URL + value, this._title.textContent || '');
	}

	set category(value: string) {
		this._category.textContent = value;
		// Очищаем все возможные модификаторы
		this._category.className = 'card__category';
		// Добавляем нужный из categoryMap
		const modifier = categoryMap[value as keyof typeof categoryMap];
		if (modifier) {
			this._category.classList.add(modifier);
		}
	}

	set price(value: number | null) {
		if (value === null) {
			this._price.textContent = '—';
			this._button.disabled = true;
			this._button.textContent = 'Недоступно';
		} else {
			this._price.textContent = `${value} руб.`;
			this._button.disabled = false;
			// Текст кнопки зависит от inCart (приходит извне)
		}
	}

	set description(value: string) {
		if (this._description) {
			this._description.textContent = value;
		}
	}

	set inCart(value: boolean) {
		this._button.textContent = value ? 'Удалить из корзины' : 'Купить';
	}
}