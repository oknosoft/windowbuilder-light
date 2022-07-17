// общие модули
import qs from 'qs';
// строки интернационализации
import i18ru from './i18n.ru';
import select_template from 'wb-core/dist/select_template';
import wnd_oaddress from './wnd_oaddress';
import {event_src} from 'metadata-superlogin/proxy/events';

function prm() {
  return qs.parse(location.search.replace('?',''));
}

import randomId from './ids';
import scale_svg from './scale_svg';

export default function ($p) {
  i18ru($p);
  wnd_oaddress($p);
  select_template($p);
  event_src($p);
  Object.assign($p.utils, {scale_svg, randomId, prm});
}

