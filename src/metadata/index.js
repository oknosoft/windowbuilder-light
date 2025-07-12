
// конструктор metadata.js
import MetaEngine from 'metadata-core';
import plugin_pouchdb from 'metadata-pouchdb';
import plugin_mime from 'metadata-core/lib/mime.min';
import plugin_scheme_settings from './cat/scheme_settings/plugin';
import plugin_log_manager from './ireg/log_manager';

// функция установки параметров сеанса
import settings from '../../config/app.settings';
import spreadsheet from '../packages/ui/spreadsheet';

// подключаем плагины к MetaEngine
MetaEngine
  .plugin(plugin_pouchdb)           // подключаем pouchdb-адаптер к прототипу metadata.js
  .plugin(plugin_mime)              // подключаем mime-types
  .plugin(plugin_scheme_settings)
  .plugin(plugin_log_manager)
  .plugin(spreadsheet);

// создаём экземпляр MetaEngine и экспортируем его глобально
const $p = global.$p = new MetaEngine();

// параметры сеанса инициализируем сразу
$p.wsql.init(settings.prm(settings));
settings.cnn($p);



// скрипт инициализации в привязке к store приложения
export function init(handleIfaceState) {

  return Promise.all([
    import('wb-core/dist/init_meta'),
    import('wb-core/dist/init_sql'),
    import('wb-core/dist/init'),
    import('wb-core/dist/superlogin-proxy'),
    import('./modifiers'),
  ])
    .then((modules) => {
      // со скрипом инициализации метаданных, так же - не затягиваем
      for(let i = 0; i<3; i++) {
        modules[i].default($p)
      }
      const {default: proxy_login, load_common} = modules[3];
      const {default: modifiers} = modules[4];

      // сообщяем адаптерам пути, суффиксы и префиксы
      const {wsql, job_prm, classes, adapters: {pouch}} = $p;
      if(wsql.get_user_param('couch_path') !== job_prm.couch_path) {
        wsql.set_user_param('couch_path', job_prm.couch_path);
      }
      if(!wsql.get_user_param('auth_provider')) {
        wsql.set_user_param('auth_provider', 'couchdb');
      }

      classes.PouchDB.plugin(proxy_login());
      pouch.init(wsql, job_prm);
      pouch.remote.ram = new classes.PouchDB(pouch.dbpath('ram'), {skip_setup: true, owner: pouch, fetch: pouch.fetch});

      // выполняем модификаторы
      modifiers($p);

      // информируем хранилище о готовности MetaEngine
      handleIfaceState({meta_loaded: true});

      // читаем общие данные в ОЗУ
      return load_common($p)
        .then(() => import('../drawer/editor'))
        .then((module) => {
          handleIfaceState({common_loaded: true});
          return module.default($p);
        });
    })
    .catch((err) => {
      handleIfaceState({server_error: `${err.message}
      Не удалось загрузить начальные данные
      Попробуйте перезагрузить страницу, проверьте настройки сети или автономного режима
      `});
    });

}

export default $p;
