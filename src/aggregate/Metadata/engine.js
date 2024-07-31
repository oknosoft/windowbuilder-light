import MetaEngine from '@oknosoft/metadata/core/src';
import pluginPouchdb from '@oknosoft/metadata/pouchdb/src';
import settings from '../../../config/app.settings';
import {meta, classes, exclude} from '../../meta';
import plugins from '../../plugins';

// подключаем плагины к MetaEngine
MetaEngine
  .plugin(pluginPouchdb);

const $p = global.$p = new MetaEngine();

// параметры сеанса инициализируем сразу
$p.jobPrm.init(settings);
// создаём структуру метаданных
$p.md.init(meta);
// создаём менеджеры данных (здесь могут быть индивидуальные конструкторы)
$p.md.createManagers(classes, exclude);
// выполняем плагины 'после'
plugins($p);

export function init(handleIfaceState) {

  try{

    // сообщяем адаптерам пути, суффиксы и префиксы
    const {jobPrm, classes, adapters: {pouch}, ui} = $p;
    if(jobPrm.get('couch_path') !== jobPrm.couch_path && process.env.NODE_ENV !== 'development') {
      jobPrm.set('couch_path', jobPrm.couch_path);
    }
    if(!jobPrm.get('auth_provider')) {
      jobPrm.set('auth_provider', 'couchdb');
    }

    // classes.PouchDB.plugin(proxy_login());
    // pouch.init(jobPrm);

    // выполняем модификаторы
    //modifiers($p);
    ui.dialogs.init({handleIfaceState});

    // информируем хранилище о готовности MetaEngine
    handleIfaceState({meta_loaded: true});

    // читаем общие данные в ОЗУ
    //return load_common($p);

  }
  catch(err) {
    $p.utils.record_log(err);
  }

}
