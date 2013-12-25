var koa = require('koa');
var hbs = require('../index'); // require koa-hbs
var app = koa();

// Options for koa-hbs. See below for full options
var hbsOptions = {
  viewPath: __dirname + '/views'
}

// koa-hbs isn't a middleware - call hbs passing app and options
hbs(app, hbsOptions);

// Render is attached to the koa context. Call this.render in your middleware
// to attach your rendered html to the response body.
app.use(function *() {
  yield this.render('main', {title: 'koa-hbs'});
})

app.listen(3000);
