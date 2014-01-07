var koa = require('koa');
var hbs = require('..');
var assert = require('assert');
var request = require('supertest');
var testApp = require('./app');

describe('without required options', function() {
  it('should throw an error when viewPath is not set', function() {
    assert.throws(function() { hbs.create().middleware({}); });
  });
});

describe('rendering', function() {
  var app;

  it('should render into the response body', function(done) {
    app = testApp.create({
      viewPath: __dirname + '/app/assets'
    });

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
    it('should render into the response body', function(done) {
      app = testApp.create({
        viewPath: __dirname + '/app/assets',
        partialsPath: __dirname + '/app/assets/partials'
      });
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

  describe('when using layouts', function() {
    var app;
    before(function() {
      // Create app which specifies layouts
      app = testApp.create({
        viewPath: __dirname + '/app/assets',
        partialsPath: __dirname + '/app/assets/partials',
        layoutsPath: __dirname + '/app/assets/layouts',
        defaultLayout: 'default'
      });
    });

    describe('with the default layout', function() {
      it('should insert rendered content', function(done) {
        request(app.listen())
          .get('/layout')
          .expect(200)
          .end(function(err, content) {
            if(err) return done(err);
            assert.ok(/DEFAULT LAYOUT/.test(content.text));
            assert.ok(/DEFAULT CONTENT/.test(content.text));
            done();
          });
      });

      it('should support alternative layouts', function(done) {
        request(app.listen())
          .get('/altLayout')
          .expect(200)
          .end(function(err, content) {
            if(err) return done(err);
            assert.ok(/ALTERNATIVE LAYOUT/.test(content.text));
            assert.ok(/ALTERNATIVE CONTENT/.test(content.text));
            done();
          })
      })
    });

    describe('with block content', function() {
      it('should show default without content for', function(done) {
        request(app.listen())
          .get('/blockNoReplace')
          .expect(200)
          .end(function(err, content) {
            assert.ok(/DEFAULT BLOCK CONTENT/.test(content.text));
            assert.ok(/NO BLOCK/.test(content.text));
            done();
          });
      });

      it('should replace block content with contentFor', function(done) {
        request(app.listen())
          .get('/block')
          .expect(200)
          .end(function(err, content) {
            assert.ok(/CONTENT FOR SIDEBAR/.test(content.text));
            assert.ok(/CONTENT IN THE BODY/.test(content.text));
            done();
          });
      });
    });

  });

});
