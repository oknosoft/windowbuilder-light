/**
 * уточнения к сервисворкеру
 */

import {precacheAndRoute} from 'workbox-precaching';
import {mdm} from './mdm';
import {getAuth} from './auth';
import {getDoc} from './doc';

const auth = getAuth(mdm);
const doc = getDoc(mdm);
const dkey = '20250505';

export default function () {

  precacheAndRoute([
    {url: '/dynamic-settings.js', revision: dkey },
    {url: '/manifest.webmanifest', revision: null},
    {url: '/favicon.ico', revision: null},
    {url: '/imgs/fav-okn144.png', revision: null},
  ]);
}


self.addEventListener('fetch', (event) => {
  const {url} = event.request;
  if(mdm.match(url)) {
    mdm.respond(event);
  }
  else if(auth.match(url)) {
    auth.respond(event);
  }
  else if(doc.match(event.request)) {
    doc.respond(event);
  }
});
