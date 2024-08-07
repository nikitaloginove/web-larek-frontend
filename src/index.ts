import { AppModelData } from './components/base/AppData';
import { Basket } from './components/base/Basket';
import { BasketItem } from './components/base/BasketItem';
import { Card } from './components/base/Card';
import { Contacts } from './components/base/Contact';
import { Order } from './components//base/Order';
import { Page } from './components//base/Page';
import { Success } from './components//base/Success';
import { Modal } from './components/base/Modal';
import { Api, ApiListResponse } from './components/base/api';
import { EventEmitter } from './components/base/events';
import './scss/styles.scss';
import { IServerResponse, ICard, IOrder, IOrderForm } from './types';
import { API_URL } from './utils/constants';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';



const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const modalTemplate = ensureElement<HTMLElement>('#modal-container');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const api = new Api(API_URL);
const events = new EventEmitter();
const appData = new AppModelData({}, events);

const page = new Page(document.body, events);
const modal = new Modal(modalTemplate, events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactTemplate), events);
const success = new Success('order-success', cloneTemplate(successTemplate), {
	onClick: () => {
		events.emit('modal:close');
		modal.close();
	},
});

// Получение лотов с сервера

api
	.get('/product')
	.then((res: IServerResponse) => {
		appData.setCatalog(res.items as ICard[]);
	})
	.catch((err) => {
		console.error(err);
	});

// Элементы каталога изменились

events.on('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card(cloneTemplate(cardTemplate), 'card', {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			id: item.id,
			title: item.title,
			image: item.image,
			category: item.category,
			price: item.price,
		});
	});
});

// Открыть лот

events.on('card:select', (item: ICard) => {
	appData.setPreview(item);
});

events.on('preview:changed', (item: ICard) => {
	const card = new Card(cloneTemplate(cardPreviewTemplate), 'card', {
		onClick: () => {
			events.emit('card:toBasket', item);
		},
	});
	modal.render({
		content: card.render({
			title: item.title,
			image: item.image,
			category: item.category,
			price: item.price,
			description: item.description,
			disabled: item.price === null,
		}),
	});
});


// Добавить товар в корзину

// Обработчик события для обновления корзины и интерфейса

function onChange() {
    basket.items = appData.basket.map((item, index) => {
        const basketItem = new BasketItem(cloneTemplate(cardBasketTemplate), {
            onClick: () => events.emit('basket:delete', item),
        });

        return basketItem.render({
            title: item.title,
            price: item.price | 0,
            number: index + 1,
        });
    });

    page.counter = appData.getBasketAmount();
    basket.total = appData.getTotalBasketPrice();
    basket.selected = appData.getBasketAmount();

    if (!appData.basket.length) {
        basket.items = [];
    }
}

// Подписываемся на события добавления товара

events.on('card:toBasket', (item: ICard) => {
    appData.addToBasket(item);
    onChange(); // Вызов обновления интерфейса
    modal.close();
});


// Блокируем прокрутку страницы если открыта модалка

events.on('modal:open', () => {
	page.locked = true;
});

// ... и разблокируем

events.on('modal:close', () => {
	page.locked = false;
});

// Открыть корзину

events.on('bids:open', () => {
	modal.render({
		content: createElement<HTMLElement>('div', {}, basket.render()),
	});
});

// Удалить товар из корзины

events.on('basket:delete', (item: ICard) => {
    appData.deleteFromBasket(item.id);
    onChange(); // Вызов обновления интерфейса
});

// Открыть окно заказа

events.on('order:open', () => {
	modal.render({
		content: order.render({
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

// Открыть окно контактов

events.on('contacts:open', () => {
	modal.render({
		content: contacts.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

// Изменилось состояние валидации формы

events.on('orderFormErrors:change', (errors: Partial<IOrder>) => {
	const { address, payment } = errors;
	order.valid = !address && !payment;
	order.errors = Object.values({ address, payment })
		.filter((i) => !!i)
		.join('; ');
});

// Изменилось состояние валидации формы

events.on('contactsFormErrors:change', (errors: Partial<IOrder>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('; ');
});

// Изменилось одно из полей

events.on(
	'orderInput:change',
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

events.on('order:send', () => {
    appData.order.total = +appData.getTotalBasketPrice().split(' ')[0];
    appData.order.items = appData.basket.map((item) => item.id);

    api
        .post('/order', appData.order)
        .then((res: ApiListResponse<string>) => {
            if (res.total > 0) { // Проверка успешности операции
                appData.cleanBasket(); // Очистка модели корзины
                basket.clean(); // Очистка представления корзины
                appData.order = {
                    items: [],
                    total: null,
                    address: '',
                    email: '',
                    phone: '',
                    payment: '',
                };
                page.counter = 0;
                events.emit('order:finish', res);
            } else {
                // Обработка случая, когда total равно 0 или отсутствует
                console.error('Ошибка: заказ не был обработан.');
            }
        })
        .catch((err) => {
            console.error(err);
        });
});


// Окно успешной покупки

events.on('order:finish', (res: ApiListResponse<string>) => {
	modal.render({
		content: success.render({
			description: res.total,
		}),
	});
});