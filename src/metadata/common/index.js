// общие модули

// строки интернационализации
import i18ru from './i18n.ru';
import wnd_oaddress from './wnd_oaddress';

import {event_src} from 'metadata-superlogin/proxy/events';
import qs from 'qs';

import randomId from './ids';
import scale_svg from './scale_svg';

export default function ($p) {
  i18ru($p);
  wnd_oaddress($p);
  event_src($p);
  Object.assign($p.utils, {
    scale_svg,
    randomId,
    prm() {
      return qs.parse(location.search.replace('?', ''));
    },
  });
};

