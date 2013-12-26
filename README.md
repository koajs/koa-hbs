koa-hbs
=======

Handlebars Templates via Generators for [Koa](https://github.com/koajs/koa/)

## Foreward
This is package offers minimum viability. Registering partials and synchronous
helpers is supported, but asynchronous helpers and layouts are not. Layouts are
next on the list.

## Usage
koa-hbs is middleware. Configure the default instance by passing an options hash to #middleware, or create an independent instance using #create().

```javascript
var koa = require('koa');
var hbs = require('koa-hbs');

var app = koa();

// koa-hbs is middleware. Use it before you want to render a view
app.use(hbs.middleware({
  viewPath: __dirname + '/views'
}));

// Render is attached to the koa context. Call this.render in your middleware
// to attach your rendered html to the response body.
app.use(function *() {
  yield this.render('main', {title: 'koa-hbs'});
})

app.listen(3000);

```

### Options
The plan for koa-hbs is to offer identical functionality as express-hbs (eventaully). These options are supported _now_.

- `viewPath`: [_required_] Where to load templates from
- `handlebars`: Pass your own instance of handlebars
- `templateOptions`: Options to pass to `template()`
- `extname`: Alter the default template extension (default: `.hbs`)
- `partialsPath`: Use this directory for partials

These options are **NOT** supported (because we don't support layouts ... yet).

- `contentHelperName`: Alter `contentFor` helper name
- `blockHelperName`: Alter `block` helper name
- `defaultLayout`: Name of the default layout
- `layoutsDir`: Load layouts from here

## Example
You can run the included example via `npm install koa` and `node --harmony app.js` from the example folder.

