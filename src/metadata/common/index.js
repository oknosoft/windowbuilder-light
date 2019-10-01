// общие модули

// строки интернационализации
import i18ru from './i18n.ru';
import editor from './editor';
import randomId from './ids';
import scale_svg from './scale_svg';

export default function ($p) {
  i18ru($p);
  editor($p);

  // iface_kind
  if(!$p.wsql.get_user_param('iface_kind')) {
    $p.wsql.set_user_param('iface_kind', 'normal');
  }

  Object.assign($p.utils, {scale_svg, randomId});
}

