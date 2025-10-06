/**
 * Здесь определяем специфичные для хоста параметры
 */

(() => {
  const keys21 = {
    google: '',
    yandex: '',
    yasuggest: '',
  };

  window._dynamic_patch_ = {

    predefined: {
      zone: 32,
      keys: keys21,
    },

  };

  // заглушка
  // try {
  //   sessionStorage.setItem('zone', window._dynamic_patch_.predefined.zone);
  //   sessionStorage.setItem('year', 2025);
  // }
  // catch (e) {}
  // при желании-необходимости, здесь можно разместить...

})();

