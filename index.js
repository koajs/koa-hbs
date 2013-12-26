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
}

/**
 * Configure the instance.
 */

Hbs.prototype.configure = function (app, options) {
  if(!app) throw new Error("must provide koa app instance");
  this.app = app;

  if(!options.viewPath) throw new Error("must specify view path");

  // Attach options
  var options = options || {};
  this.viewPath = options.viewPath;
  this.handlebars = options.handlebars || require('handlebars').create();
  this.templateOptions = options.templateOptions || {};
  this.extname = options.extname || '.hbs';
  this.partialsPath = options.partialsPath || '';

  // Support for these options is planned, but not yet supported:
  this.contentHelperName = options.contentHelperName || 'contentFor';
  this.blockHelperName = options.blockHelperName || 'block';
  this.defaultLayout = options.defaultLayout || '';
  this.layoutsDir = options.layoutsDir || '';

  // Create generators with reference to this instance of Hbs.
  this.attachToKoa(app);

  // Register partials in options partialsPath(s)
  this.registerPartials();

  return this;
};

/**
 * Create generator for rendering templates
 */

Hbs.prototype.getRender = function () {
  var hbs = this;
  return function *(templateName, args) {
    var templatePath = path.join(hbs.viewPath, templateName + hbs.extname);
    var tplFile = yield read(templatePath);
    var template = hbs.handlebars.compile(tplFile.toString());

    this.body = template(args, hbs.templateOptions);
  };
};

/**
 * Attach Hbs methods to koa context
 * @param {Object} instance of koajs context
 */

Hbs.prototype.attachToKoa = function(koa) {
  koa.context.render = this.getRender();
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

Hbs.prototype.registerPartials = function(cb) {
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
  co(function *() {
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

    } catch(e) {
      console.error('Error caught while registering partials');
      console.error(e);
    }
  })();
};