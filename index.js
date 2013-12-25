var fs = require('fs');
var handlebars = require('handlebars');
var path = require('path');

/**
 * file reader returning a thunk
 * @param filename {String} Name of file to read
 */

var read = function (filename) {
  return function(done) {
    fs.readFile(filename, done);
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

  // Support for these options is planned, but not yet supported:
  this.contentHelperName = options.contentHelperName || 'contentFor';
  this.blockHelperName = options.blockHelperName || 'block';
  this.partialsDir = options.partialsDir || '';
  this.defaultLayout = options.defaultLayout || '';
  this.layoutsDir = options.layoutsDir || '';

  // Create generators with reference to this instance of Hbs.
  this.attachToKoa(app);

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
