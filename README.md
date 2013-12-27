koa-hbs
=======

Handlebars Templates via Generators for [Koa](https://github.com/koajs/koa/)

## Forward
Things that are supported:
- Registering helpers
- Registering partials
- Specify a directory or multiple directories of partials to register
- Single default layout
- Template caching (actually, this cannot be disabled presently)

Things that will be, but are **not** yet supported:
- Asynchronous helpers
- Alternative layouts
- Content blocks

## Usage
koa-hbs is middleware. Configure the default instance by passing an options hash
to #middleware, or create an independent instance using #create().

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

after a template has been rendered, the template function is cached.

### Options
The plan for koa-hbs is to offer identical functionality as express-hbs
(eventaully). These options are supported _now_.

- `viewPath`: [_required_] Full path from which to load templates
  (`Array|String`)
- `handlebars`: Pass your own instance of handlebars
- `templateOptions`: Hash of
  [options](http://handlebarsjs.com/execution.html#Options) to pass to
  `template()`
- `extname`: Alter the default template extension (default: `'.hbs'`)
- `partialsPath`: Full path to partials directory (`Array|String`)
- `defaultLayout`: Name of the default layout
- `layoutsPath`: Full path to layouts directory (`String`)

These options are **NOT** supported yet.

- `contentHelperName`: Alter `contentFor` helper name
- `blockHelperName`: Alter `block` helper name


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

### Layouts
Passing `defaultLayout` with the a layout name will cause all templates to be
inserted into the `{{{body}}}` expression of the layout. If `layoutsPath` is
specified, koa-hbs will load your layout from that path; otherwise, the layout
is assumed to be located in `viewPath`.

**Note:** Only a single layout is currently supported. Alternative layout
support will be added soon. To use an alternative layout, specify
`{{!> layoutName}}` somewhere in your template. Again, this is **NOT** supported
yet.

## Example
You can run the included example via `npm install koa` and
`node --harmony app.js` from the example folder.

## Credits
Functionality and code were inspired/taken from
[express-hbs](https://github.com/barc/express-hbs/).
