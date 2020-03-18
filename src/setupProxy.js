const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(proxy('/auth', { target: 'http://localhost:3016/' }));
  app.use(proxy('/couchdb', { target: 'http://localhost:3016/'}));
  // app.use(proxy('/auth', { target: 'https://tmk-online.ru/' }));
  // app.use(proxy('/couchdb', { target: 'https://tmk-online.ru/'}));
};
