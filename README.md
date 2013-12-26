koa-hbs
=======

Handlebars Templates via Generators for [Koa](https://github.com/koajs/koa/)

## Foreward
This is package offers minimum viability. Registering partials and synchronous
helpers is supported, but asynchronous helpers and layouts are not. There is no
caching of templates. Every call to render reads the template from disk. Layouts
and caching are next on the list.

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

### Registering Helpers
Helpers are registered using the #registerHelper method. Here is an example
using the default instance (helper stolen from official Handlebars
[docs](http://handlebarsjs.com):

```javascript
hbs = require('koa-hbs');

hbs.registerHelper('link', function(text, url) {
  text = hbs.Utils.escapeExpression(text);
  url  = hbs.Utils.escapeExpression(url);

  var result = '<a href="' + url + '">' + text + '</a>';

  return new hbs.SafeString(result);
});
```

registerHelper, Utils, and SafeString all proxy to an internal Handlebars
instance. If passing an alternative instance of Handlebars to the middleware
configurator, make sure to do so before registering your helpers via the koa-hbs
proxies, or just register your helpers directly via your Handlebars instance.

### Registering Partials
The simple way to register partials is to stick them all in a directory, and
pass the `partialsPath` option when generating the middleware. Say your views
are in `./views`, and your partials are in `./views/partials`. Configuring the
middleware as

## Example
You can run the included example via `npm install koa` and `node --harmony app.js` from the example folder.

## Credits
Functionality and code were inspired/taken from
[express-hbs](https://github.com/barc/express-hbs/).
