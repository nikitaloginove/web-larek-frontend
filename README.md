# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build

```

# Данные и типы данных, используемые в приложении


***Интерфейс карточки***

```

export interface ICard {
	id: string;
	description?: string;
	image: string;
	title: string;
	category: categoryType;
	price: number | null;
	disabled?: boolean;
}

```

***Интерфейс заказа***

```

export interface IOrder {
	payment?: string;
	email?: string;
	phone?: string;
	address?: string;
	total: number;
	items: string[];
}

```

***Интерфейс страницы***

```

export interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

```

***Интерфейс состояния приложения***

```

export interface IAppState {
	catalog: ICard[];
}

```

***Интерфейс действий с карточкой***

```

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

```

***Интерфейс ответа от сервера***

```

export interface IServerResponse {
	items: ICard[];
}

```

***Интерфейс корзины товаров***

```

export interface IBasketView {
	items: HTMLElement[];
	price: number;
}

```

***Интерфейс элемента в корзине***

```

export interface IBasketItem {
	number: number;
	title: string;
	price: number;
}

```

***Интерфейс ошибок***

```

export type FormErrors = Partial<Record<keyof IOrder, string>>;

```

***Интерфейс формы заказа***

```

export interface IOrderForm {
	payment: string;
	address: string;
	email: string;
	phone: string;
}

```

***Интерфейс данных пользователя***

```

export interface IContacts {
	phone: string;
	email: string;
}

```
## Архитектура

Код приложения разделен на слои согласно парадигме MVP:

* слой представления, отвечает за отображение данных на странице,
* слой данных, отвечает за хранение и изменение данных
* презентер, отвечает за связь представления и данных.
