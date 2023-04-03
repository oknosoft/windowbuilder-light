/**
 * Здесь определяем специфичные для хоста параметры
 */

(() => {
  const keys21 = {
    google: '',
    yandex: '283f550e-8184-4c84-b0e3-bdc5c1dee693',
  };

  const zone = location.host.includes('2210') ? 10 : 29;

  window._dynamic_patch_ = {

    predefined: {
      zone,
      host: zone === 29 ? 'steklotorg.oknosoft.ru' : 'steklotorg.oknosoft.ru:2310',
      log_level: 'warn',
      keys: keys21,
      ram_indexer: false,
    },

  };
  // при желании-необходимости, здесь можно разместить...

})();

