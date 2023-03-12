// шрифты и стили
import './styles/global.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import Metadata from './components/Metadata';
import * as swRegistration from './serviceWorkerRegistration';

const App = React.lazy(() => import('./components/App'));

const elm = document.getElementById('root');
const initialText = elm.innerHTML;
const root = ReactDOM.createRoot(elm);
root.render(<Metadata App={App} initialText={initialText} />);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA

swRegistration.unregister({
  // onUpdate() {
  //   alert('Код программы обновлён, необходимо перезагрузить страницу');
  //   location.reload();
  // },
});

//swRegistration.unregister();

