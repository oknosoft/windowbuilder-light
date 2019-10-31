/**
 * Для фоновых пересчетов
 *
 * @module worker
 *
 * Created by Evgeniy Malyarov on 26.10.2019.
 */

import MetaEngine from 'metadata-core';
import plugin_pouchdb from 'metadata-pouchdb';
import proxy_login from 'metadata-superlogin/proxy';
import {patch_cnn, patch_prm} from '../../config/patch_cnn';
import settings from '../../config/app.settings';
import meta_init from 'windowbuilder/public/dist/init';
import modifiers from './modifiers';
import {load_ram, load_common} from '../metadata/common/load_ram';

// подключаем плагины к MetaEngine
MetaEngine.plugin(plugin_pouchdb);

// создаём экземпляр MetaEngine и экспортируем его глобально
const $p = self.$p = new MetaEngine();

// параметры сеанса инициализируем сразу
$p.wsql.init(patch_prm(settings));
patch_cnn();

// со скрипом инициализации метаданных, так же - не затягиваем
meta_init($p);

self.init = (data) => {
  return Promise.resolve()
    .then(() => {
      self._id = data._id;
      const {wsql, job_prm, classes, adapters: {pouch}} = $p;
      classes.PouchDB.plugin(proxy_login());
      pouch.init(wsql, job_prm);
      pouch.props._auth_provider = 'couchdb';
      pouch.props._suffix = data._suffix;
      modifiers($p);
      data.opts.owner = pouch;
      pouch.remote.doc = new classes.PouchDB(data.opts.name, data.opts);
      return load_common($p);
    })
    .then(() => load_ram($p))
    .then(() => {
      postMessage({_id: self._id, name: 'ready'});
      console.log(`Worker #${self._id}: ${Date.now() - data.start}ms`);
    })
    .catch((error) => postMessage({_id: self._id, name: 'error', error}));
}

self.onmessage = (e) => {
  const {data} = e;
  if(!self._id && data._id) {
    self.init(data);
  }
}
