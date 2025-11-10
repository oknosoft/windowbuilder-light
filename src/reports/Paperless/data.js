//import items from '../../aggregate/App/menu';

const {
  CatCharacteristics,
  cat: {scheme_settings, planning_keys, characteristics, work_centers, work_center_kinds, individuals},
  doc: {scaning, calc_order},
  enm: {planning_phases},
  adapters: {pouch},
  ui: {dialogs},
  rep, utils, wsql, md} = $p;

export const title = 'Безбумажка';

export const schemas = scheme_settings
  .find_schemas('doc.scaning.paperless', true)
  .filter(v => !v.user)
  .sort(utils.sort('order'));

const schemeKey = 'paperless.scheme';
const userScheme = wsql.get_user_param(schemeKey);
export const initScheme = (userScheme && schemas.find(v => v.ref === userScheme)) ? userScheme : schemas[0]?.ref;
export const setScheme = (handleIfaceState, ref) => {
  wsql.set_user_param(schemeKey, ref);
  handleIfaceState(({paperless, ...other}) => ({...other, paperless: Object.assign({}, paperless, {scheme: scheme_settings.get(ref)})}));
};


const wpaths = [];
// for(const {id} of items) {
//   if(!id) {
//     break;
//   }
//   wpaths.push(id);
// }

/**
 * Анализирует штрихкод перед излучением события
 * Выполняет служебные команды
 * @param barcode
 */
function barcodeControl(barcode, handleIfaceState, setBackdrop, skipStamp) {
  const auth = barcode.split('@');
  const {current_user} = $p;
  // для снэка
  const timeout = 4000;
  if(auth.length === 2 && ['ldap', 'couchdb'].includes(auth[1])) {
    if(current_user) {
      dialogs.snack({message: `Для повторной авторизации завершите сеанс текущего пользователя`, timeout});
    }
    const [login, password] = auth[0].split(':');
    if(!login || !password) {
      dialogs.snack({message: `Не найдено имя или пароль в штрихкоде`, timeout});
    }
    else {
      pouch.props._auth_provider = auth[1];
      dialogs.snack({message: `Авторизация '${login}'`, timeout: timeout / 2});
      pouch.log_in(login, password)
        .then(() => {
          pouch.authorized ?
            dialogs.snack({message: `Успешный вход '${login}'`, timeout: timeout / 2})
            :
            dialogs.snack({message: `Ошибка входа '${login}'`, timeout});
        })
        .catch((err) => dialogs.snack({message: `Ошибка входа '${err.message || err}'`, timeout}));
    }
    return;
  }

  barcode = barcode.trim().toLowerCase();
  if(barcode === 'logout') {
    if(!current_user) {
      dialogs.snack({message: `Неоткуда выходить - пользователь не авторизован`, timeout});
    }
    else {
      pouch.log_out()
        .then(() => location.reload());
    }
    return;
  }
  if(wpaths.includes(barcode)) {
    return dialogs.handleNavigate(`/paperless/${barcode}`);
  }
  if(barcode.length > 20 && barcode.length !== 36) {
    return dialogs.snack({message: `Подозрительно длинный штрихкод '${barcode}'`, timeout});
  }
  if(barcode.length < 3) {
    return dialogs.snack({message: `Подозрительно короткий штрихкод '${barcode}'`, timeout});
  }
  if(barcode.startsWith('fl-')) {
    const fl = individuals.find_rows({id: {like: barcode.substring(3)}})[0];
    if(!fl || fl.empty()) {
      return dialogs.snack({message: `Не найдено физлицо по коду '${barcode}'`, timeout});
    }
    return wsql.set_user_param('individual_person', fl.ref);
  }
  if(barcode.startsWith('wc-')) {
    const wc = work_centers.find_rows({id: {like: barcode.substring(3)}})[0];
    if(!wc || wc.empty()) {
      return dialogs.snack({message: `Не найден рабочий центр по коду '${barcode}'`, timeout});
    }
    return wsql.set_user_param('work_center', wc.ref);
  }

  setBackdrop(true);
  pouch.fetch(`/adm/api/keys/${barcode}`)
    .then(res => res.json())
    .then(info => {
      return calc_order.get(info.calc_order, 'promise')
        .then(doc => doc.load_linked_refs())
        .then(calc_order => Object.assign(info, {calc_order, characteristic: characteristics.get(info.characteristic)}));
    })
    .then((info) => {
      return pouch.fetch(`/adm/api/dates/keys?keys=${barcode}`)
        .then(res => res.json())
        .then(rows => Object.assign(info, {rows}));
    })
    .then(async (info) => {
      const {abonent, branch, calc_order, characteristic, elm, region, specimen, presentation, ref, type, rows} = info;
      for(const row of rows) {
        for(const fld of ['part', 'register']) {
          const mgr = md.mgr_by_class_name(row[`${fld}_type`]);
          const doc = mgr.get(row[fld]);
          if(doc.is_new()) {
            await doc.load();
            if(doc.load_keys) {
              await doc.load_keys();
            }
            await doc.load_linked_refs();
          }
          row[fld] = doc;
        }
        row.phase = planning_phases.get(row.phase);
        row.planing_key = planning_keys.get(row.ref);
        row.calc_order = calc_order;
        row.obj = characteristic;
        row.date = new Date(row.date);
        row.period = new Date(row.period);
        row.power = parseFloat(row.power);
        row.stage = work_center_kinds.get(row.stage);
        row.work_center = work_centers.get(row.work_center);

      }
      handleIfaceState(({paperless, ...other}) => {
        const prevStamp = paperless?.stamp || 0;
        return {...other,
          paperless: {...paperless, calc_order, characteristic, elm, region, specimen, presentation, barcode, type, rows, prevStamp, stamp: skipStamp ? prevStamp : Date.now()}}
      });
      setBackdrop(false);
    })
    .catch(err => {
      console.error(err);
      setBackdrop(false);
    })
  // const {pathname} = location;
  // if(wpaths.some((path) => pathname.includes(path))) {
  //  md.emit_async('barcode', barcode);
  // }
  // else {
  //   dialogs.snack({message: `Не выбрано рабочее место (заполнения, импосты, раскладка...)`, timeout});
  // }
}

export const barcodeState = {
  timeStamp: 0,
  s: '',     // текущее значение штрихкода
  input: null,

  keydown(evt, setBarcode, handleIfaceState, setBackdrop) {

    if(evt.target.tagName === 'INPUT' && !this.input || evt.code == 'NumLock'){
      return;
    }

    if(evt.code == 'Enter' || evt.code == 'NumpadEnter') {
      this.s && barcodeControl(this.s, handleIfaceState, setBackdrop);
      this.s = '';
      this.input && this.input.blur();
    }
    else if(evt.code == 'Escape' || evt.code == 'Backspace' || evt.code == 'Delete') {
      this.s = '';
    }
    else if(evt.code == 'KeyV' && evt.ctrlKey ||
      evt.code == 'Insert' && evt.shiftKey ||
      evt.code == 'F11' ||
      evt.code == 'F12'
    ) {
      return;
    }
    else if(evt.keyCode > 30) {
      // сравним время с предыдущим. если маленькое, добавляем в буфер. если большое - пишем последний элемент
      if(evt.timeStamp - this.timeStamp > 100 && !this.input) {
        this.s = '';
      }
      this.timeStamp = evt.timeStamp;
      this.s += evt.key;
    }

    this.input && setBarcode(this.s);

    evt.preventDefault();
    evt.stopPropagation();
    return false;
  },

  blur(setBarcode) {
    if(this.input) {
      this.s = '';
      setBarcode(this.s);
      this.input = null;
    }
  },

  control: barcodeControl,
};
