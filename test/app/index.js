var hbs = require('../../index');
var koa = require('koa');
var router = require('koa-router')();

var create = function (opts) {
  var app = new koa();
  var _hbs = hbs.create();

  app.on('error', function (err) {
    console.error(err.stack);
  });

  app.use(_hbs.middleware(opts));

  router.get('/', async function (ctx) {
    await ctx.render('main', { title: 'test' });
  });

  router.get('/partials', async function (ctx) {
    await ctx.render('mainWithPartials', {
      title: 'test',
      anchorList: [
        { url: 'https://google.com', name: 'google' },
        { url: 'https://github.com', name: 'github' }
      ]
    });
  });

  router.get('/nestedPartials', async function (ctx) {
    await ctx.render('nestedPartials');
  });

  router.get('/layout', async function (ctx) {
    await ctx.render('useDefaultLayout');
  });

  router.get('/altLayout', async function (ctx) {
    await ctx.render('useAlternativeLayout');
  });

  router.get('/overrideLayout', async function (ctx) {
    await ctx.render('useOverrideLayout', {
      layout: 'override'
    });
  });

  router.get('/noLayout', async function (ctx) {
    await ctx.render('useNoLayout', {
      layout: false
    });
  });

  router.get('/block', async function (ctx) {
    await ctx.render('usesBlockLayout');
  });

  router.get('/blockNoReplace', async function (ctx) {
    await ctx.render('usesBlockLayoutNoBlock');
  });

  router.get('/empty', async function (ctx) {
    await ctx.render('empty');
  });

  router.get('/locals', async function (ctx) {
    await ctx.render('locals');
  });

  router.get('/localsOverride', async function (ctx) {
    await ctx.render('locals', {
      title: 'Bar'
    });
  });

  router.get('/localsRecursive', async function (ctx) {
    var obj = {};
    obj.title = 'Bar';
    obj.recursive = obj;
    await ctx.render('locals', obj);
  });

  router.get('/localsState', async function (ctx) {
    ctx.state = { title: 'Foo', article: 'State' };
    await ctx.render('locals', {
      title: 'Bar'
    });
  });

  router.get('/tplInOtherDir', async function (ctx) {
    await ctx.render('tplInOtherDir');
  });

  router.get('/missingTemplate', async function (ctx) {
    await ctx.render('missingTemplate');
  });

  app
    .use(router.routes())
    .use(router.allowedMethods());

  return app;
};

exports.create = create;
