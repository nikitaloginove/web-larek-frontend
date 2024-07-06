import { IContacts } from '../../types';
import { Form } from './Form';
import { IEvents } from './events';

export class Contacts extends Form<IContacts> {
	private _button: HTMLButtonElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._button = container.querySelector('.button');
		this._button.addEventListener('click', () => {
			events.emit('order:send');
			// Удалены строки, очищающие поля формы
		});
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value = value;
	}

}
