// src/components/views/SuccessView.ts
import { ISuccessData, ISuccessActions } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

export class SuccessView extends Component<ISuccessData> {
	protected _closeButton: HTMLButtonElement;
	protected _description: HTMLElement;

	constructor(
		container: HTMLElement,
		actions?: ISuccessActions
	) {
		super(container);

		// Находим элементы по селекторам из вашей вёрстки
		this._closeButton = ensureElement<HTMLButtonElement>('.order-success__close', container);
		this._description = ensureElement<HTMLElement>('.order-success__description', container);

		// Обработчик закрытия
		if (actions?.onClick) {
			this._closeButton.addEventListener('click', actions.onClick);
		}
	}

	// Устанавливает итоговую сумму в описание
	set total(value: number) {
		this._description.textContent = `Списано ${value} руб.`;
	}
}