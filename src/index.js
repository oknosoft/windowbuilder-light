import React from "react";
import ReactDOM from 'react-dom/client';
import Loading from './aggregate/App/Loading';

const App = React.lazy(() => import('./aggregate/App'));
const Metadata = React.lazy(() => import('./aggregate/Metadata'));

const elm = document.getElementById('root');
const initialText = elm.innerHTML;
const root = ReactDOM.createRoot(elm);
root.render(<React.Suspense fallback={<Loading/>}>
    <Metadata App={App} initialText={initialText} />
  </React.Suspense>);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}
