var hbs = require('../../index');
var koa = require('koa');

var create = function(opts) {
  var app = koa();
  var _hbs = hbs.create();

  app.on('error', function(err) {
    console.error(err.stack);
  });

  app.use(_hbs.middleware(opts));

  app.use(function*(next) {
    if(this.path == '/')
      yield this.render('main', {title: 'test'});
    else
      yield next;
  });

  app.use(function* (next) {
    if(this.path == '/partials') {
      yield this.render('mainWithPartials', {
        title: 'test',
        anchorList:[
          {url: 'https://google.com', name: 'google'},
          {url: 'https://github.com', name: 'github'}
        ]
      });
    } else {
      yield next;
    }
  });

  app.use(function*(next) {
    if(this.path == '/layout')
      yield this.render('useDefaultLayout');
    else
      yield next;
  });

  app.use(function*(next) {
    if(this.path == '/altLayout')
      yield this.render('useAlternativeLayout');
    else
      yield next;
  });

  return app;
}

exports.create = create;
