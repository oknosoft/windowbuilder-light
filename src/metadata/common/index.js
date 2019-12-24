// общие модули

// строки интернационализации
import i18ru from './i18n.ru';
import wnd_oaddress from './wnd_oaddress';
import select_template from './select_template';

import randomId from './ids';
import scale_svg from './scale_svg';

export default function ($p) {
  i18ru($p);
  wnd_oaddress($p);
  select_template($p);
  Object.assign($p.utils, {scale_svg, randomId});
}

