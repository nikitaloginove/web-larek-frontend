import { IBasketItem, ICardActions } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from './Component';

export class BasketItem extends Component<IBasketItem> {
	protected _number: HTMLElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._number = ensureElement<HTMLElement>('.basket__item-index', container);
		this._button = ensureElement<HTMLButtonElement>('.card__button', container);

		if (this._button) {
			this._button?.addEventListener('click', (event: MouseEvent) => {
				this.container.remove();
				actions?.onClick?.(event);
			});
		}
	}

	set title(value: string) {
        this.setText(this._title, value); // Использование метода родительского класса
    }

    set number(value: number) {
        this.setText(this._number, value.toString()); // Использование метода родительского класса
    }

    set price(value: number) {
        this.setText(this._price, `${value} синапсов`); // Использование метода родительского класса
    }
}