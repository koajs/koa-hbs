'use strict';

const hbs = require('../../index');
const koa = require('koa');
const router = require('koa-router')();

function create (opts) {
  const app = new koa();
  const _hbs = hbs.create();

  app.on('error', (err) => console.error(err.stack));

  app.use(_hbs.middleware(opts));
  app
    .use(router.routes())
    .use(router.allowedMethods());

  router.get('/', async (ctx) => {
    await ctx.render('main', {title: 'test'});
  });

  router.get('/partials', async (ctx) => {
    await ctx.render('mainWithPartials', {
      title: 'test',
      anchorList:[
        {url: 'https://google.com', name: 'google'},
        {url: 'https://github.com', name: 'github'}
      ]
    });
  });

  router.get('/nestedPartials', async (ctx) => {
    await ctx.render('nestedPartials' );
  });

  router.get('/layout', async (ctx) => {
    await ctx.render('useDefaultLayout');
  });

  router.get('/altLayout', async (ctx) => {
    await ctx.render('useAlternativeLayout');
  });

  router.get('/overrideLayout', async (ctx) => {
    await ctx.render('useOverrideLayout', {
      layout: 'override'
    });
  });

  router.get('/noLayout', async (ctx) => {
    await ctx.render('useNoLayout', {
      layout: false
    });
  });

  router.get('/block', async (ctx) => {
    await ctx.render('usesBlockLayout');
  });

  router.get('/blockNoReplace', async (ctx) => {
    await ctx.render('usesBlockLayoutNoBlock');
  });

  router.get('/empty', async (ctx) => {
    await ctx.render('empty');
  });

  router.get('/locals', async (ctx) => {
    await ctx.render('locals');
  });

  router.get('/localsOverride', async (ctx) => {
    await ctx.render('locals', {
      title: 'Bar'
    });
  });

  router.get('/localsRecursive', async (ctx) => {
    let obj;

    obj = {
      title: 'Bar',
      recursive: obj
    };

    await ctx.render('locals', obj);
  });

  router.get('/localsState', async (ctx) => {
    ctx.state = {
      title: 'Foo',
      article: 'State'
    };

    await ctx.render('locals', {
      title: 'Bar'
    });
  });

  router.get('/tplInOtherDir', async (ctx) => {
    await ctx.render('tplInOtherDir');
  });

  router.get('/missingTemplate', async (ctx) => {
    await ctx.render('missingTemplate');
  });

  return app;
};

exports.create = create;
