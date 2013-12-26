var hbs = require('../../index');
var koa = require('koa');

var create = function() {
  var app = koa();
  var _hbs = hbs.create();

  app.on('error', function(err) {
    console.error(err.stack);
  });

  app.use(_hbs.middleware({
    viewPath: __dirname + '/assets',
    partialsPath: __dirname + '/assets/partials'
  }));

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

  return app;
}

exports.create = create;
