koa-hbs
=======

Handlebars Templates via Generators for [Koa](https://github.com/koajs/koa/)

## Foreward
This is package offers minimum viability. There is no support for partials or layouts yet. You may render a self contained template. Handlebars helpers can be defined on your own instance of Handlebars which you pass to koa-hbs options.

## Usage
koa-hbs isn't a middleware. Require the library and call it, passing a Koa app instance and options for koa-hbs like so:

```javascript
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

```

### Options
The plan for koa-hbs is to offer identical functionality as express-hbs (eventaully). These options are supported _now_.

- `viewPath`: [_required_] Where to load templates from
- `handlebars`: Pass your own instance of handlebars
- `templateOptions`: Options to pass to `template()`
- `extname`: Alter the default template extension (default: `.hbs`)

These options are **NOT** supported yet.

- `contentHelperName`: Alter `contentFor` helper name
- `blockHelperName`: Alter `block` helper name
- `partialsDir`: Use this directory for partials
- `defaultLayout`: Name of the default layout
- `layoutsDir`: Load layouts from here

## Example
You can run the included example via `npm install koa` and `node --harmony app.js` from the example folder.

