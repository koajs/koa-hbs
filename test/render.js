var koa = require('koa');
var hbs = require('..');
var assert = require('assert');
var request = require('supertest');

describe('hbs', function() {
  it('should throw an error when viewPath is not set', function() {
    var app = koa();
    assert.throws(function() { hbs.create.configure(app, {}); });
  });

  describe('render', function() {

    it('should put html in koa response body', function() {
      var app = koa();
      h = hbs.create().configure(app, {
        viewPath: __dirname + '/assets'
      });

      app.use(function*() {
        yield this.render('main', {title: 'test'});
      });

      request(app.listen())
      .get('/').end(function(err, content) {
        assert.ok(/<title>test<\/title>/.test(content));
        assert.ok(/html/.test(content));
      })
    });

  });

});