/**
 * уточнения к сервисворкеру
 */

import {precacheAndRoute} from 'workbox-precaching';


export default function () {

  self.skipWaiting();

  // в отладочном режиме, обновляем cache раз в день
  const dkey = new Date().toISOString().substring(0, 10);
  const revision = '20240610';
  const persistent = '20240000';

  precacheAndRoute([
    {url: '/manifest.json', revision },
    {url: '/imgs/fav-okn144.png', revision: null },
    {url: '/imgs/favicon.ico', revision: null },
    {url: '/imgs/splash.gif', revision },
    {url: '/dynamic-settings.js', revision },
  ]);
}
