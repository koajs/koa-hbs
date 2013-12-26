var koa = require('koa');
var hbs = require('..');
var assert = require('assert');
var request = require('supertest');
var testApp = require('./app');

describe('when called incorrectly', function() {
  it('should throw an error when viewPath is not set', function() {
    var app = koa();
    assert.throws(function() { hbs.create.configure(app, {}); });
  });
});

describe('render', function() {
  var app;
  before(function(done) {
    app = testApp.create();
    setTimeout(done, 200); // make sure partials are loaded
  });

  it('should put html in koa response body', function(done) {
    request(app.listen())
      .get('/')
      .expect(200)
      .end(function(err, content) {
        if(err) return done(err);
        assert.ok(/<title>test<\/title>/.test(content.text));
        assert.ok(/html/.test(content.text));
        done();
      });
  });

  describe('with partials', function() {
    it('should render the partials', function(done) {
      request(app.listen())
        .get('/partials')
        .expect(200)
        .end(function(err, content) {
          if(err) return done(err);
          assert.ok(/google\.com/.test(content.text));
          done();
        });
    });
  });

});
