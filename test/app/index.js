var hbs = require('../../index');
var koa = require('koa');
var router = require('koa-router');

var create = function(opts) {
  var app = koa();
  var _hbs = hbs.create();

  app.on('error', function(err) {
    console.error(err.stack);
  });

  app.use(_hbs.middleware(opts));
  app.use(router(app));

  app.get('/', function*() {
    yield this.render('main', {title: 'test'});
  });

  app.get('/partials', function*() {
    yield this.render('mainWithPartials', {
      title: 'test',
      anchorList:[
        {url: 'https://google.com', name: 'google'},
        {url: 'https://github.com', name: 'github'}
      ]
    });
  });

  app.get('/layout', function *() {
    yield this.render('useDefaultLayout');
  });

  app.get('/altLayout', function *() {
    yield this.render('useAlternativeLayout');
  });

  app.get('/block', function *() {
    yield this.render('usesBlockLayout');
  });

  app.get('/blockNoReplace', function *() {
    yield this.render('usesBlockLayoutNoBlock');
  });

  app.get('/empty', function *() {
    yield this.render('empty');
  });

  return app;
}

exports.create = create;
