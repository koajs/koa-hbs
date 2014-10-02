var assert = require('assert');
var path = require('path');
var co = require('co');

describe('unit tests', function() {
  describe('getLayoutPath', function() {
    var hbs;
    before(function() {
      hbs = require('..').create();
      hbs.middleware({
        viewPath: __dirname + '/app/assets',
        layoutsPath: __dirname + '/app/assets/layouts',
        partialsPath: __dirname + '/app/assets/partials'
      });
    });

    it('should return the correct path', function() {
      var layoutPath = path.join(__dirname, '/app/assets/layouts/default.hbs');
      assert.equal(hbs.getLayoutPath('default'), layoutPath);
    });
  });

  describe('registerPartials', function() {
    var hbs;
    before(function() {
      hbs = require('..').create();
      hbs.middleware({
        viewPath: __dirname + '/app/assets'
      });
    });
  });
});
