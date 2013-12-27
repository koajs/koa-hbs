var fs = require('fs');
var path = require('path');
var co = require('co');
var readdirp = require('readdirp');

/**
 * file reader returning a thunk
 * @param filename {String} Name of file to read
 */

var read = function (filename) {
  return function(done) {
    fs.readFile(filename, {encoding: 'utf8'}, done);
  };
};

/**
 * expose default instance of `Hbs`
 */

exports = module.exports = new Hbs();

/**
 * expose method to create additional instances of `Hbs`
 */

exports.create = function() {
  return new Hbs();
};


/**
 * Create new instance of `Hbs`
 *
 * @api public
 */

function Hbs() {
  if(!(this instanceof Hbs)) return new Hbs();

  this.handlebars = require('handlebars').create();

  this.Utils = this.handlebars.Utils;
  this.SafeString = this.handlebars.SafeString;
}

/**
 * Configure the instance.
 *
 * @api private
 */

Hbs.prototype.configure = function (options) {

  if(!options.viewPath) throw new Error("must specify view path");

  // Attach options
  var options = options || {};
  this.viewPath = options.viewPath;
  this.handlebars = options.handlebars || this.handlebars;
  this.templateOptions = options.templateOptions || {};
  this.extname = options.extname || '.hbs';
  this.partialsPath = options.partialsPath || '';
  this.contentHelperName = options.contentHelperName || 'contentFor';
  this.blockHelperName = options.blockHelperName || 'block';
  this.defaultLayout = options.defaultLayout || '';
  this.layoutsPath = options.layoutsPath || '';

  this.partialsRegistered = false;

  // Cache templates and layouts
  this.cache = {};
  this.layoutCache = {};

  return this;
};

/**
 * Middleware for koa
 *
 * @api public
 */
Hbs.prototype.middleware = function(options) {
  this.configure(options);

  var render = this.createRenderer();

  return function *(next) {
    this.render = render;
    yield next;
  };
}

/**
 * Create a render generator to be attached to koa context
 */

Hbs.prototype.createRenderer = function() {
  var hbs = this;

  return function *(tpl, locals) {
    var tplPath = path.join(hbs.viewPath, tpl + hbs.extname),
      template,
      file;

    locals = locals || {};

    if(!hbs.partialsRegistered)
      yield hbs.registerPartials();

    if(!hbs.layoutTemplate)
      hbs.layoutTemplate = yield hbs.cacheDefaultLayout();

    // Load Template
    if(hbs.cache[tpl]) {
      template = hbs.cache[tpl];
    } else {
      file = yield read(tplPath);
      template = hbs.cache[tpl] = hbs.handlebars.compile(file);
    }

    // Run the compiled templates
    locals.body = template(locals, hbs.templateOptions);
    this.body = hbs.layoutTemplate(locals, hbs.templateOptions);
  };
}

/**
 * Get layout path
 */

Hbs.prototype.getLayoutPath = function(layout) {
  if(this.layoutsPath)
    return path.join(this.layoutsPath, layout + this.extname);

  return path.join(this.viewPath, layout + this.extname);
}

/**
 * Get a default layout. If none is provided, make a noop
 */

Hbs.prototype.cacheDefaultLayout = function() {
  var hbs = this;
  return co(function* () {
    if(!hbs.defaultLayout)
      return hbs.handlebars.compile("{{{body}}}");

    var layoutTemplate;
    try {
      var layoutFile = hbs.getLayoutPath(hbs.defaultLayout);
      var layout = yield read(layoutFile);
      layoutTemplate = hbs.handlebars.compile(layout);
    } catch (err) {
      console.error(err.stack);
    }

    return layoutTemplate;

  });
}

/**
 * Register helper to internal handlebars instance
 */

Hbs.prototype.registerHelper = function() {
  this.handlebars.registerHelper.apply(this.handlebars, arguments);
}

/**
 * Register partial with internal handlebars instance
 */

Hbs.prototype.registerPartial = function() {
  this.handlebars.registerPartial.apply(this.handlebars, arguments);
}

/**
 * Register directory of partials
 */

Hbs.prototype.registerPartials = function (cb) {
  var self = this, partials, dirpArray, files = [], names = [], partials,
    rname = /^[a-zA-Z_-]+/, readdir;

  if(this.partialsPath == '')
    return;

  if(!(this.partialsPath instanceof Array))
    this.partialsPath = [this.partialsPath];

  /* thunk creator for readdirp */
  readdir = function(root) {
    return function(done) {
      readdirp({root: root, fileFilter: '*' + self.extname}, done);
    };
  };

  /* Read in partials and register them */
  return co(function *() {
    try {
      readdirpResults = yield self.partialsPath.map(readdir);

      // Generate list of files and template names
      readdirpResults.forEach(function(result) {
        result.files.forEach(function(file) {
          files.push(file.fullPath);
          names.push(rname.exec(file.path)[0]);
        });
      });

      // Read all the partial from disk
      partials = yield files.map(read);
      for(var i=0; i!=partials.length; i++) {
        self.registerPartial(names[i], partials[i]);
      }

      self.partialsRegistered = true;
    } catch(e) {
      console.error('Error caught while registering partials');
      console.error(e);
    }

    return cb && cb(null, self);
  });
};