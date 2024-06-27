import { IBasketView } from '../../types';
import { createElement, ensureElement } from '../../utils/utils';
import { Component } from './Component';
import { EventEmitter } from './events';

export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _isActiveButton: boolean;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._price = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');
		this._button.addEventListener('click', () => {
			events.emit('order:open');
		});

		this.items = [];
		this.setDisabled(this._button, true);
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста  🛒',
				})
			);
		}
	}

	set total(total: string) {
		this.setText(this._price, total);
	}

	set selected(value: number) {
		if (value > 0) {
			this.setDisabled(this._button, false);
		} else {
			this.setDisabled(this._button, true);
		}
	}

	renumerateItems() {
		Array.from(this._list.children).forEach((item, index) => {
			item.querySelector(`.basket__item-index`).textContent = (
				index + 1
			).toString();
		});
	}

	clean() {
        this.items = [];
        this.selected = 0;
        this.total = '0 синапсов';
    }
}