// шрифты и стили
import './styles/global.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import Metadata from './components/Metadata';
import * as swRegistration from './sw/registration';

const App = React.lazy(() => import('./components/App'));

const elm = document.getElementById('root');
const initialText = elm.innerHTML;
const root = ReactDOM.createRoot(elm);
root.render(<Metadata App={App} initialText={initialText} />);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
window.channel4Broadcast = new BroadcastChannel('channel4');
channel4Broadcast.addEventListener('message', (event) => {
  switch (event.data?.type) {
    case 'zone':
      const {pouch} = $p.adapters;
      const zone = sessionStorage.getItem('zone') || pouch.props.zone;
      const branch = sessionStorage.getItem('branch') || pouch.props.branch;
      channel4Broadcast.postMessage({type: 'zone', zone, branch});
      break;
    case 'manifest':
      $p.md.order.manifest = event.data.value;
      break;
  }

});

swRegistration.register({
  onUpdate() {
    alert('Код программы обновлён, необходимо перезагрузить страницу');
    location.reload();
  },
});

//swRegistration.unregister();

