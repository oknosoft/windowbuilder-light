# Окнософт: Заказ дилера
Заказ дилера - это веб-приложение, разработанное компанией [Окнософт](http://www.oknosoft.ru/) на базе фреймворка [Metadata.js](https://github.com/oknosoft/metadata.js/tree/master/packages)  
Исходный код и документация доступны в [GitHub <i class="fa fa-github-alt"></i>](https://github.com/oknosoft/windowbuilder)

### Назначение и возможности
- Построение и редактирование эскизов изделий в графическом 2D редакторе
- Экстремальная поддержка нестандартных изделий (многоугольники, сложные перегибы профиля)
- Расчет спецификации и координат технологических операций
- Расчет цены и плановой себестоимости изделий по произвольным формулам с учетом индивидуальных дилерских скидок и наценок
- Формирование печатных форм для заказчика и производства
- Поддержка автономной работы при отсутствии доступа в Интернет и прозрачного обмена с сервером при возобновлении соединения

### Использованы следующие библиотеки и инструменты:

#### Серверная часть
- [CouchDB](https://couchdb.apache.org), NoSQL база данных с поддержкой master-master репликации
- [Nginx](https://nginx.org/ru), высокопроизводительный HTTP-сервер
- [NodeJS](https://nodejs.org/ru), JavaScript runtime built on Chrome`s V8 JavaScript engine

#### Управление данными в памяти браузера
- [Metadata.js](https://github.com/oknosoft/metadata.js/tree/develop/packages), движок ссылочной типизации для браузера и Node.js
- [PouchDB](https://pouchdb.com/), клиентская NoSQL база данных с поддержкой автономной работы и репликации с CouchDB
- [AlaSQL](https://github.com/agershun/alasql), SQL-интерфейс к массивам javascript в памяти браузера и Node.js
- [Aes](http://www.movable-type.co.uk/scripts/aes.html), библиотека шифрования/дешифрования строк
- [Redux](https://github.com/reactjs/redux), диспетчер состояния веб-приложения

#### UI библиотеки и компоненты интерфейса
- [Paper.js](http://paperjs.org), фреймворк векторной графики для HTML5 Canvas
- [Material-ui](https://material-ui-next.com), компоненты React UI в стиле Google`s material design
- [React virtualized](https://github.com/bvaughn/react-virtualized), компоненты React для динамических списков
- [React data grid](https://github.com/adazzle/react-data-grid), React компонент табличной части
- [Moment.js](http://momentjs.com), библиотека форматирования интервалов и дат
- [Rubles.js](http://meritt.github.io/rubles), библиотека форматирования чисел - сумма прописью
- [Xlsx](https://github.com/SheetJS/js-xlsx), библиотека для чтения и записи XLSX / XLSM / XLSB / XLS / ODS
- [Docxtemplater](https://github.com/open-xml-templating/docxtemplater), библиотека формирования файлов DOCX
- [Fontawesome](https://fortawesome.github.io/Font-Awesome), набор шрифтовых иконок

### Лицензия
Коммерческая лицензия [Окнософт](https://github.com/oknosoft/windowbuilder/blob/master/LICENSE.ru.md)

### Благодарность
Нашим спонсорам, ЗСК «Гласспром» [Экоокна](https://www.ecookna.ru/partnerstvo/stante-dilerom) и ООО «Доминанта» [ТМК](http://tmk-company.ru/contacts) 

### Вопросы
Если обнаружили ошибку, пожалуйста, зарегистрируйте [вопрос в GitHub](https://github.com/oknosoft/windowbuilder/issues?utf8=%E2%9C%93&q=is%3Aissue) или <a href="mailto:info@oknosoft.ru?subject=windowbuilder">свяжитесь с разработчиком</a> напрямую
