var hbs = require('../../index');
var koa = require('koa');
var router = require('koa-router')();

var create = function(opts) {
  var app = koa();
  var _hbs = hbs.create();

  app.on('error', function(err) {
    console.error(err.stack);
  });

  app.use(_hbs.middleware(opts));
  app
    .use(router.routes())
    .use(router.allowedMethods());

  router.get('/', function*() {
    yield this.render('main', {title: 'test'});
  });

  router.get('/partials', function*() {
    yield this.render('mainWithPartials', {
      title: 'test',
      anchorList:[
        {url: 'https://google.com', name: 'google'},
        {url: 'https://github.com', name: 'github'}
      ]
    });
  });

  router.get('/nestedPartials', function*() {
    yield this.render('nestedPartials' );
  });

  router.get('/layout', function *() {
    yield this.render('useDefaultLayout');
  });

  router.get('/altLayout', function *() {
    yield this.render('useAlternativeLayout');
  });

  router.get('/overrideLayout', function *() {
    yield this.render('useOverrideLayout', {
      layout: 'override'
    });
  });

  router.get('/noLayout', function *() {
    yield this.render('useNoLayout', {
      layout: false
    });
  });

  router.get('/block', function *() {
    yield this.render('usesBlockLayout');
  });

  router.get('/blockNoReplace', function *() {
    yield this.render('usesBlockLayoutNoBlock');
  });

  router.get('/empty', function *() {
    yield this.render('empty');
  });

  router.get('/locals', function *() {
    yield this.render('locals');
  });

  router.get('/localsOverride', function *() {
    yield this.render('locals', {
      title: 'Bar'
    });
  });

  router.get('/localsRecursive', function *() {
    var obj = {};
    obj.title = 'Bar';
    obj.recursive = obj;
    yield this.render('locals', obj);
  });

  router.get('/localsState', function *() {
    this.state = { title: 'Foo', article: 'State' };
    yield this.render('locals', {
      title: 'Bar'
    });
  });

  router.get('/tplInOtherDir', function *() {
    yield this.render('tplInOtherDir');
  });

  router.get('/missingTemplate', function *() {
    yield this.render('missingTemplate');
  });

  return app;
};

exports.create = create;
