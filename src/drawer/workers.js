/**
 * Коллекция ссылок на воркеры для фоновых пересчетов
 *
 * @module workers
 *
 * Created by Evgeniy Malyarov on 26.10.2019.
 */

export const workers = [];
const WORKERS_COUNT = 2;

workers.create = function ($p) {

  // пока без воркеров
  $p.adapters.pouch.emit('pouch_complete_loaded');
  return Promise.resolve();

  // return new Promise((resolve, reject) => {
  //   const {job_prm, adapters: {pouch}} = $p;
  //   const inited = {};
  //
  //   if(job_prm.builder.font_size < 77) {
  //     job_prm.builder.font_size = 77;
  //   }
  //
  //   function onmessage(e) {
  //     const {data} = e;
  //     switch (data.name) {
  //     case 'ready':
  //       inited[data._id] = true;
  //       let ok = true;
  //       for(let i = 1; i <= WORKERS_COUNT; i++){
  //         if(!inited[i]) {
  //           ok = false;
  //           break;
  //         }
  //       }
  //       if(ok) {
  //         pouch.emit('pouch_complete_loaded');
  //         resolve();
  //       }
  //       break;
  //     case 'error':
  //       reject();
  //       break;
  //     }
  //   }
  //
  //   pouch.emit('pouch_data_page', {synonym: 'Инициализация фоновых процессов'});
  //
  //   for(const worker of this) {
  //     worker.terminate();
  //   }
  //   this.length = 0;
  //   const start = Date.now();
  //   for(let i = 1; i <= WORKERS_COUNT; i++){
  //     const worker = new Worker('./worker.js', {type: 'module'});
  //     const opts = Object.assign({}, pouch.remote.doc.__opts);
  //     delete opts.owner;
  //     this.push(worker);
  //     worker.onmessage = onmessage;
  //     worker.postMessage({_id: i, _suffix: pouch.props._suffix, start, opts});
  //   }
  // });
};
