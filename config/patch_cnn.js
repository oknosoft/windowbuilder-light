

/**
 * предопределенные зоны
 */
export const predefined = {
  'localhost:3027': {
    zone: 27,
    log_level: 'warn',
    //keys: {google: ''},
  },
  'localhost:3010': {
    zone: 10,
    log_level: 'warn',
    //keys: {google: ''},
  },
  'ecookna.': {
    zone: 10,
    host: 'https://develop.ecookna.ru/',
    splash: {css: 'splash21', title: false},
  },
  'brusnika.': {
    zone: 27,
    host: 'https://brusnika.oknosoft.ru/',
  },
}

/**
 * патч зоны по умолчанию
 */
export function patch_prm(settings) {
  return (prm) => {
    settings(prm);
    for (const elm in predefined) {
      if(location.host.match(elm)) {
        'zone,ram_indexer'.split(',').forEach((name) => {
          if(predefined[elm].hasOwnProperty(name)) {
            prm[name] = predefined[elm][name];
          }
        });
      }
    }
    return prm;
  };
}

/**
 * патч параметров подключения
 */
export function patch_cnn() {

  const {job_prm, wsql} = $p;

  for (const elm in predefined) {
    const prm = predefined[elm];
    if(location.host.match(elm)) {
      prm.zone && wsql.get_user_param('zone') != prm.zone && wsql.set_user_param('zone', prm.zone);
      'log_level,splash,templates,keys'.split(',').forEach((name) => {
        if(prm.hasOwnProperty(name)) {
          if(typeof job_prm[name] === 'object') {
            Object.assign(job_prm[name], prm[name]);
          }
          else {
            job_prm[name] = prm[name];
          }
        }
      });
    }
  }
}
