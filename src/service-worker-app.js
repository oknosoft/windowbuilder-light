/**
 * уточнения к сервисворкеру
 */

import {precacheAndRoute} from 'workbox-precaching';

// в отладочном режиме, обновляем cache раз в день
const dkey = new Date().toISOString().substring(0, 10);

export default function () {

  self.skipWaiting();

  const revision = '20250101';

  precacheAndRoute([
    {url: '/manifest.json', revision: revision },
    {url: '/imgs/fav-okn144.png', revision: null },
    {url: '/imgs/favicon.ico', revision: null },
    {url: '/imgs/splash.gif', revision: dkey },
  ]);
}
