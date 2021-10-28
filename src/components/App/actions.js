/**
 * Подписка на события метадаты и установка свойств
 *
 * Created by Evgeniy Malyarov on 14.02.2021.
 */

import {lazy} from './lazy';
import {load_ram} from 'metadata-superlogin/proxy';


export const init_state = {
  meta_loaded: false,
  common_loaded: false,
  doc_ram_loaded: false,
  complete_loaded: false,
  fetch: false,
  idle: false,
  page: {},
  offline: false,
  title: 'Заказ дилера',
  error: null,
  user: {
    logged_in: false,
    stop_log_in: false,
    try_log_in: false,
    log_error: '',
  },
  snack: null,
  alert: null,
  confirm: null,
  wnd_portal: null,
};

function log_in() {
  return fetch('/auth/couchdb')
    .then((res) => res.json())
    .then((res) => {
      const {classes: {PouchDB}, adapters: {pouch}, cat: {users}}= $p;
      const {props, remote, fetch} = pouch;
      props._auth = {username: res.id};
      props._suffix = res.suffix || '';
      props._user = res.ref;

      remote.doc = new PouchDB(pouch.dbpath('doc'), {skip_setup: true, owner: pouch, fetch});

      return users.create(res, false, true);
    });
}

export function actions(elm) {

  // скрипт инициализации структуры метаданных и модификаторы
  return Promise.resolve()
    .then(() => import('../../metadata'))
    .then((module) => module.init(elm))
    .then(() => {
      // font-awesome, roboto и стили metadata подгрузим асинхронно
      import('metadata-react/styles/roboto/font.css');
      import('font-awesome/css/font-awesome.min.css')
        .then(() => import('../../styles/global.css'))
        .then(() => import('../../styles/windowbuilder.css'))
    })
    .then(() => {
      const {classes: {PouchDB}, adapters: {pouch}, md, ui} = $p;
      elm.setState({common_loaded: true});
      const {handleNavigate, handleIfaceState} = elm;
      ui.dialogs.init({handleIfaceState, handleNavigate, lazy});

      const {remote, fetch} = pouch;
      remote.ram = new PouchDB(pouch.dbpath('ram'), {skip_setup: true, owner: pouch, fetch});

      pouch.on({
        pouch_complete_loaded() {
          elm.setState({complete_loaded: true});
        },
        pouch_data_page(page) {
          elm.setState({page});
        },
        on_log_in(username) {
          elm.setState({user: {
              name: username,
              logged_in: true,
              try_log_in: false,
              log_error: '',
            }});
          return load_ram($p);
        },
      });

      md.once('predefined_elmnts_inited', () => pouch.emit('pouch_complete_loaded'));

    });
}
