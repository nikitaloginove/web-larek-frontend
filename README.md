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

# Данные и типы данных


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

- слой представления, отвечает за отображение данных на странице,
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных.

### Базовый код

**Класс API**

Предоставляет базовый функционал для выполнения HTTP-запросов. В конструкторе устанавливается базовый URL и настраиваются опции для запросов. Методы `get` и `post` выполняют GET и POST запросы соответственно, обрабатывая ответы через метод `handleResponse`. Класс обеспечивает удобный способ взаимодействия с API и получения данных из сервера.	

- `baseUrl`: Строка, содержащая базовый URL для API-запросов.

- `options`: Объект `RequestInit`, который содержит настройки по умолчанию для всех запросов, включая заголовки.

- `constructor`: Конструктор класса, который инициализирует `baseUrl` и `options`.

- `handleResponse`: Защищенный метод, который обрабатывает ответ от сервера. Если ответ успешный (`response.ok`), возвращает результат в формате JSON. В случае ошибки возвращает отклоненное обещание с текстом ошибки.

- `get`: Метод для выполнения GET-запроса. Он добавляет URI к `baseUrl` и использует настройки из `options`.

- `post`: Метод для выполнения POST-запроса. Он также добавляет URI к `baseUrl`, использует настройки из `options` и отправляет данные в формате JSON.

**Класс EventEmitter**

Обеспечивает управление событиями и подписчиками на эти события. В классе определены методы для установки обработчика на событие (`on`), удаления обработчика с события (`off`), инициирования события с передачей данных (`emit`). Также есть методы для установки обработчика для всех событий (`onAll`), удаления всех обработчиков (`offAll`) и создания триггера, который генерирует событие при вызове (`trigger`). Класс `EventEmitter` позволяет удобно управлять событиями в приложении, подписываться на них, генерировать и удалять обработчики.

- `constructor`: Инициализирует новый объект `EventEmitter` с пустой картой `_events`.

- `on`: Добавляет обработчик (`callback`) для определенного события (`eventName`). Если событие еще не было добавлено, создает новый набор подписчиков (`Set<Subscriber>`).

- `off`: Удаляет обработчик события. Если после удаления обработчика набор подписчиков становится пустым, удаляет событие из карты.

- `emit`: Инициирует событие, вызывая все обработчики, связанные с этим событием, и передавая им данные (`data`).

- `onAll`: Добавляет обработчик, который будет вызываться при каждом событии.

- `offAll`: Удаляет все обработчики событий, очищая карту `_events`.

- `trigger`: Создает функцию, которая при вызове инициирует событие с определенными данными.

**Абстрактный класс Model**

Этот класс представляет базовую модель, которая может использоваться для создания конкретных моделей с различным содержимым и функционалом. Он также позволяет модели сообщать об изменениях и генерировать события для уведомления об этих изменениях в приложении.

1. **Конструктор**:
- Конструктор принимает два параметра:
- `data`: объект с начальными данными, частично соответствующий типу `T`. Использование `Partial<T>` позволяет передавать объект с не всеми обязательными полями типа `T`.
- `events`: объект, реализующий интерфейс `IEvents`, который используется для обработки и распространения событий.
- В конструкторе используется `Object.assign`, чтобы присвоить все переданные данные текущему экземпляру класса. Это позволяет инициализировать свойства модели переданными значениями.

2. **Методы**:
- `emitChanges(event: string, payload?: object)`:
- Этот метод отвечает за оповещение об изменениях в модели.
- Он принимает два параметра:
- `event`: строка, представляющая имя события.
- `payload`: объект с данными, связанными с событием. Если `payload` не указан, создается пустой объект `{}`.
- Метод вызывает метод `emit` объекта `events`, передавая в него имя события и данные.

**Абстрактный класс Component**

Данный класс предоставляет удобные методы для работы с DOM элементами внутри компонентов и упрощает разработку пользовательского интерфейса, позволяя создавать и управлять компонентами на веб-странице. Класс `Component` может быть использован как базовый класс для других компонентов в приложении, обеспечивая им общий функционал для работы с DOM.

1. **Конструктор**
- Конструктор принимает элемент `container` типа `HTMLElement` и сохраняет его в защищенном свойстве. Это будет корневой элемент для компонента.
- Важно, что код в конструкторе исполняется до всех объявлений в дочернем классе, что комментарий подчеркивает.

2. **Методы для работы с DOM**
- `toggleClass(element: HTMLElement, className: string, force?: boolean)`: Переключает класс у элемента. Если передан параметр `force`, класс будет либо добавлен, либо удален в зависимости от его значения (`true` или `false`).
- `setText(element: HTMLElement, value: unknown)`: Устанавливает текстовое содержимое элемента. Значение приводится к строке перед установкой.
- `setDisabled(element: HTMLElement, state: boolean)`: Устанавливает или снимает атрибут `disabled` у элемента в зависимости от значения `state`.
- `setHidden(element: HTMLElement)`: Скрывает элемент, устанавливая CSS-свойство `display` в `none`.
- `setVisible(element: HTMLElement)`: Делает элемент видимым, удаляя свойство `display`.
- `setImage(element: HTMLImageElement, src: string, alt?: string)`: Устанавливает источник изображения (`src`) и альтернативный текст (`alt`) для элемента `img`. Предполагается, что `CDN_URL` - это базовый URL для ресурса.
- `render(data?: Partial<T>): HTMLElement`: Метод, который применяется для рендеринга компонента. Он обновляет свойства компонента, переданные через объект `data`, и возвращает корневой элемент компонента. `Partial<T>` позволяет передать не все свойства типа `T`, а только те, которые необходимо обновить.

3. **Типизация и абстракция**
- Класс обобщённый на основании типа `T`, что позволяет создавать компоненты с различными типами данных, которые могут быть переданы и использованы в методе `render`.
- Сам класс объявлен абстрактным (ключевое слово `abstract`), что означает, что его нельзя инстанцировать напрямую. Ему следует быть унаследованным другими классами, которые будут реализовывать специфическую логику рендеринга и взаимодействия компонента.

### Слой данных

**Класс AppModelData**

Класс представляет модель данных приложения и содержит различные методы для управления этими данными, а также взаимодействия с событиями через объект `events`.

В данном классе определены следующие свойства и методы:

1. Свойства:
- `catalog`: массив товаров (`ICard[]`), который хранит список всех доступных товаров.
- `preview`: строковое значение, представляющее идентификатор предпросмотра товара.
- `basket`: массив объектов товаров `ICard`, представляющих товары в корзине.
- `order`: объект `IOrder` с информацией о заказе.
- `formErrors`: объект `FormErrors` с ошибками валидации формы заказа.

2. Методы:
- `setCatalog(items: ICard[])`: устанавливает каталог товаров и оповещает об изменении.
- `setPreview(item: ICard)`: устанавливает товар для предварительного просмотра и оповещает об изменении.
- `addToBasket(value)`: добавляет товар в корзину.
- `getBasketAmount()`: возвращает количество товаров в корзине.
- `getTotalBasketPrice()`: вычисляет общую стоимость товаров в корзине.
- `deleteFromBasket(id)`: удаляет товар из корзины.
- `validateContacts()`: валидирует контактную информацию пользователя и генерирует событие об изменении ошибок формы контактов.
- `validateOrder()`: валидирует информацию о заказе и генерирует событие об изменении ошибок формы заказа.
- `setOrderField(field, value)`: устанавливает значение поля в заказе, валидирует заказ и контактную информацию, и генерирует события о готовности заказа и контактов.

### Слой представления

**Класс Basket**

Класс `Basket` представляет собой компонент пользовательского интерфейса для управления корзиной покупок в веб-приложении. Вот ключевые моменты, которые он описывает:

- **Конструктор**:
  - Принимает `container` (контейнер, в котором будет размещен компонент) и `events` (экземпляр `EventEmitter` для управления событиями).
  - Инициализирует элементы DOM, такие как список товаров (`_list`), отображение общей цены (`_price`) и кнопку (`_button`).
  - Добавляет обработчик события клика на кнопку, который вызывает событие `order:open`.

- **Свойства и методы**:
  - `items`: Сеттер, который управляет элементами в списке корзины. Если массив `items` пуст, отображается сообщение "Корзина пуста 🛒".
  - `total`: Сеттер, который устанавливает текст общей цены в соответствующем элементе DOM.
  - `selected`: Сеттер, который активирует или деактивирует кнопку в зависимости от количества выбранных товаров.
  - `renumerateItems()`: Метод для перенумерации товаров в корзине.
  - `clean()`: Метод для очистки корзины, сброса количества выбранных товаров и общей цены.

Класс `Basket` использует методы и свойства базового класса `Component` для взаимодействия с DOM и управления состоянием корзины. Это позволяет централизованно управлять элементами корзины и их состоянием, что упрощает разработку и поддержку кода.


**Класс BasketItem**

Класс является компонентом пользовательского интерфейса для отдельного элемента в корзине покупок. Вот основные аспекты, которые он описывает:

- **Конструктор**:
  - Принимает `container` (контейнер для элемента корзины) и `actions` (объект с действиями, которые могут быть выполнены при взаимодействии с элементом).
  - Инициализирует DOM-элементы, такие как заголовок товара (`_title`), цена (`_price`), номер элемента в корзине (`_number`) и кнопка (`_button`).
  - Добавляет обработчик события клика на кнопку, который удаляет контейнер из DOM и вызывает функцию `onClick` из объекта `actions`, если она предоставлена.

- **Сеттеры**:
  - `title`: Устанавливает текст заголовка товара.
  - `number`: Устанавливает номер элемента в корзине.
  - `price`: Устанавливает текст цены товара, добавляя слово "синапсов" после числового значения.

Класс `BasketItem` использует методы базового класса `Component` для управления текстовым содержимым DOM-элементов. Это позволяет инкапсулировать логику управления отдельным элементом корзины, обеспечивая его независимость и возможность повторного использования в разных частях приложения. Класс также предоставляет интерфейс для взаимодействия с пользователем через кнопку, что делает его функциональным и интерактивным компонентом интерфейса.


**Класс Form**

Класс является обобщённым компонентом формы в веб-приложении. Класс `Form` расширяет абстрактный класс `Component` и используется для создания интерактивных форм с динамическим типом данных `T`. Вот основные аспекты, которые он описывает:

- **Конструктор**:
  - Принимает `container` (HTML-элемент формы) и `events` (экземпляр интерфейса `IEvents` для управления событиями).
  - Инициализирует кнопку отправки формы (`_submit`) и элемент для отображения ошибок (`_errors`).
  - Добавляет обработчики событий для отслеживания изменений в полях ввода и обработки события отправки формы.

- **Методы и сеттеры**:
  - `onInputChange`: Защищённый метод, вызываемый при изменении значения поля ввода, который генерирует событие с информацией об изменении.
  - `valid`: Сеттер, который управляет доступностью кнопки отправки на основе валидности формы.
  - `errors`: Сеттер, который устанавливает текст ошибок в соответствующем элементе DOM.
  - `render`: Метод для рендеринга состояния формы, принимает объект состояния `state`, который содержит валидность формы, ошибки и другие входные данные.

Класс `Form` предоставляет функциональность для управления состоянием формы, включая валидацию, отображение ошибок и обработку ввода пользователя. Он также обеспечивает интеграцию с системой событий, что позволяет легко связывать логику формы с другими компонентами приложения. Обобщённый тип `T` позволяет использовать класс `Form` для создания форм с различными структурами данных.


**Класс Modal**

Класс является компонентом модального окна в веб-приложении. Вот ключевые моменты, которые он описывает:

- **Конструктор**:
  - Принимает `container` (контейнер для модального окна) и `events` (экземпляр интерфейса `IEvents` для управления событиями).
  - Инициализирует кнопку закрытия модального окна (`_closeButton`) и контентную область (`_content`).
  - Добавляет обработчики событий для закрытия модального окна при клике на кнопку закрытия или на фон модального окна. Событие клика на контентной области останавливается, чтобы предотвратить его всплытие и случайное закрытие модального окна.

- **Сеттеры и методы**:
  - `content`: Сеттер, который позволяет заменить содержимое контентной области новым элементом.
  - `open`: Метод для открытия модального окна, добавляет класс активности к контейнеру и генерирует событие `modal:open`.
  - `close`: Метод для закрытия модального окна, удаляет класс активности и очищает контентную область, генерирует событие `modal:close`.
  - `render`: Метод для рендеринга данных модального окна и его открытия.

Класс `Modal` предоставляет инкапсулированную логику для управления модальными окнами, включая их открытие, закрытие и обновление содержимого. Использование системы событий позволяет легко интегрировать модальное окно с другими компонентами приложения и реагировать на его изменения.


**Класс Success** 

Класс представляет собой компонент уведомления об успешном действии в веб-приложении. Вот ключевые моменты, которые он описывает:

- **Конструктор**:
  - Принимает `blockName` (базовое имя класса для элементов компонента), `container` (контейнер для компонента) и `actions` (необязательный объект с действиями).
  - Инициализирует кнопку закрытия уведомления (`_button`) и элемент для отображения описания (`_description`).
  - Если предоставлены действия и есть кнопка закрытия, добавляет обработчик события клика на эту кнопку.

- **Сеттер**:
  - `description`: Сеттер, который устанавливает текст описания в элемент `_description`, добавляя информацию о списанных синапсах.

Класс `Success` может использоваться для отображения уведомлений об успешных операциях, например, после выполнения транзакции или завершения задачи. Текст "Списано X синапсов" может относиться к какому-то внутреннему механизму начисления или списания баллов, очков или других единиц в приложении. Компонент инкапсулирует логику отображения и закрытия уведомления, а также предоставляет возможность настройки через передаваемые действия.


**Класс Card**

Класс `Card` расширяет абстрактный класс `Component` и представляет собой компонент карточки товара для веб-приложения. Вот основные моменты, которые он описывает:

- **Конструктор**:
  - Принимает `container` (контейнер для карточки товара), `blockName` (базовое имя класса для элементов компонента) и `actions` (необязательный объект с действиями).
  - Инициализирует элементы карточки: изображение товара (`_image`), заголовок (`_title`), категорию (`_category`), цену (`_price`) и кнопку (`_button`).
  - Если предоставлены действия и есть кнопка, добавляет обработчик события клика на эту кнопку или на контейнер.

- **Сеттеры**:
  - `title`: Устанавливает текст заголовка карточки.
  - `category`: Устанавливает текст категории и добавляет соответствующий класс для стилизации.
  - `price`: Устанавливает текст цены, если она указана, иначе устанавливает текст "Бесценно".
  - `image`: Устанавливает изображение товара и альтернативный текст.
  - `disabled`: Устанавливает состояние кнопки (активна/неактивна).

Этот класс позволяет создавать и управлять карточками товаров, обеспечивая интерактивность и динамическое обновление содержимого. Компонент может быть использован для отображения информации о товарах в интернет-магазине или каталоге.


**Класс Order**

Класс `Order` расширяет абстрактный класс `Form` и представляет собой компонент формы заказа в веб-приложении. Вот основные моменты, которые он описывает:

- **Конструктор**:
  - Принимает `container` (контейнер для формы) и `events` (объект событий).
  - Инициализирует кнопки для выбора способа оплаты (`_cash` и `_card`) и кнопку подтверждения заказа (`_button`).
  - Добавляет обработчик события клика на кнопку подтверждения, который сбрасывает выбор способа оплаты и очищает поле адреса.

- **Обработчики событий**:
  - Для кнопок `_cash` и `_card` добавляются обработчики событий клика, которые активируют соответствующую кнопку и передают выбор способа оплаты в метод `onInputChange`.

Этот класс позволяет пользователю выбрать способ оплаты заказа и подтвердить его. При клике на кнопку подтверждения вызывается событие, которое может открыть контактную форму или выполнить другое действие. Класс также обеспечивает визуальную обратную связь, подсвечивая выбранную кнопку оплаты.


**Класс Contacts**

Класс `Contacts` расширяет абстрактный класс `Form` и представляет собой компонент формы контактов в веб-приложении. Вот ключевые аспекты, которые он описывает:

- **Конструктор**:
  - Принимает `container` (контейнер для формы) и `events` (объект событий).
  - Инициализирует кнопку (`_button`) и добавляет обработчик события клика, который:
    - Вызывает событие 'order:send', возможно, для отправки данных формы.
    - Очищает поля ввода для электронной почты и телефона после клика.

Этот класс позволяет пользователю взаимодействовать с формой контактов, отправлять данные и получать визуальную обратную связь посредством интерфейса. Обработчик события клика обеспечивает логику очистки полей и отправки формы, что делает процесс более интуитивно понятным для пользователя. Класс также способствует централизации управления событиями в приложении, что упрощает его поддержку и развитие.


**Класс Page**

Класс `Page` расширяет абстрактный класс `Component` и управляет основными элементами интерфейса пользователя на странице. Вот ключевые моменты, которые он описывает:

- **Конструктор**:
  - Принимает `container` (контейнер для компонента) и `events` (объект событий).
  - Инициализирует основные элементы интерфейса: счетчик корзины (`_counter`), каталог (`_catalog`), обертку страницы (`_wrapper`) и саму корзину (`_basket`).
  - Добавляет обработчик события клика на корзину, который вызывает событие 'bids:open'.

- **Сеттеры**:
  - `catalog`: Заменяет дочерние элементы каталога новыми элементами.
  - `locked`: Управляет блокировкой интерфейса, добавляя или удаляя класс `page__wrapper_locked`.
  - `counter`: Устанавливает значение счетчика в текстовом элементе корзины.

Этот класс обеспечивает динамическое управление содержимым страницы и её состоянием, позволяя реагировать на действия пользователя и изменения в приложении. Он также способствует централизации управления событиями и облегчает разработку интерфейса пользователя.

### Взаимодействие

Файл `index.ts` выполняет роль презентера взаимодействия между представлением и данными. В этом файле создаются экземпляры классов, необходимых для функционирования программы, и настраивается обработка событий за счет использования брокера событий и соответствующих обработчиков. Вся логика взаимодействия между элементами веб-страницы организуется через генерацию и обработку событий.

- **Импорты**: Выполняется импорт необходимых компонентов и утилит для работы приложения.

- **Инициализация компонентов**: Создаются экземпляры основных компонентов приложения, таких как `Page`, `Modal`, `Basket` и другие, с использованием шаблонов и событий.

- **Взаимодействие с сервером**: Используется класс `Api` для получения данных о продуктах и отправки заказов.

- **Обработка событий**: С помощью `EventEmitter` реализована подписка на события и их обработка, что позволяет реагировать на действия пользователя, такие как выбор товара, добавление в корзину и оформление заказа.

- **Управление состоянием**: Класс `AppModelData` используется для управления состоянием приложения, включая каталог товаров, предварительный просмотр, корзину и данные заказа.

- **Рендеринг интерфейса**: Компоненты используют метод `render` для создания и обновления DOM на основе текущего состояния приложения.

- **Модальные окна**: Для отображения различных интерфейсов, таких как корзина, форма заказа и контакты, используется компонент `Modal`.

- **Валидация форм**: События `orderFormErrors:change` и `contactsFormErrors:change` используются для отслеживания ошибок валидации и обновления состояния форм.

- **Отправка заказа**: После валидации и подтверждения формы заказа данные отправляются на сервер, и при успешном ответе корзина очищается, и отображается сообщение об успешной покупке.
