// шрифты и стили
import './styles/global.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import Metadata from './components/App/Metadata';
import * as swRegistration from './serviceWorkerRegistration';

const elm = document.getElementById('root');
const initialText = elm.innerHTML;
const root = ReactDOM.createRoot(elm);
root.render(<Metadata App={App} initialText={initialText} />);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
/*
swRegistration.register({
  onUpdate() {
    alert('Код программы обновлён, необходимо перезагрузить страницу');
    location.reload();
  },
});
*/
swRegistration.unregister();

