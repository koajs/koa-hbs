'use strict';

const koa = require('koa');
const hbs = require('..');
const assert = require('assert');
const request = require('supertest');
const testApp = require('./app');

describe('without required options', () => {
  it('should throw an error when viewPath is not set', () => {
    assert.throws(() => hbs.create().middleware({}));
  });
});

describe('rendering', () => {
  let app,
    server;

  before(() => {
    app = testApp.create({
      viewPath: __dirname + '/app/assets',
      partialsPath: __dirname + '/app/assets/partials',
      locals: {
        title: 'hbs',
        article: 'locals'
      }
    });

    server = app.listen();
  });

  after(() => server.close());

  it('should render into the response body', (done) => {
    request(server)
      .get('/')
      .expect(200)
      .end((err, content) => {
        if (err) {
          return done(err);
        }
        assert.ok(/<title>test<\/title>/.test(content.text));
        assert.ok(/html/.test(content.text));
        done(err);
      });
  });

  it('should render a blank page', (done) => {
    request(server)
      .get('/empty')
      .expect(200)
      .end((err, page) => {
        if (err) {
          return done(err);
        }
        assert.deepEqual(page.text, '');
        done(err);
      });
  });

  it('should not render a missing template', (done) => {
    request(server)
      .get('/missingTemplate')
      .expect(500)
      .end((err, page) => {
        if (err) {
          return done(err);
        }
        assert.deepEqual(page.text, 'Internal Server Error');
        done(err);
      });
  });

  describe('with partials', () => {
    it('should render into the response body', (done) => {
      request(server)
        .get('/partials')
        .expect(200)
        .end((err, content) => {
          if (err) {
            return done(err);
          }
          assert.ok(/google\.com/.test(content.text));
          done(err);
        });
    });

    it('should work also for nested partials', (done) => {
      request(server)
        .get('/nestedPartials')
        .expect(200)
        .end((err, content) => {
          assert.ok(/NESTED/.test(content.text));
          done(err);
        });
    });
  });

  describe('when using layouts', () => {
    let app,
      server;

    before(() => {
      app = testApp.create({
        viewPath: __dirname + '/app/assets',
        partialsPath: __dirname + '/app/assets/partials',
        layoutsPath: __dirname + '/app/assets/layouts',
        defaultLayout: 'default'
      });

      server = app.listen();
    });

    after(() => server.close());

    describe('with the default layout', () => {
      it('should insert rendered content', (done) => {
        request(server)
          .get('/layout')
          .expect(200)
          .end((err, content) => {
            if (err) {
              return done(err);
            }
            assert.ok(/DEFAULT LAYOUT/.test(content.text));
            assert.ok(/DEFAULT CONTENT/.test(content.text));
            done();
          });
      });

      it('should support alternative layouts', (done) => {
        request(server)
          .get('/altLayout')
          .expect(200)
          .end((err, content) => {
            if (err) {
              return done(err);
            }
            assert.ok(/ALTERNATIVE LAYOUT/.test(content.text));
            assert.ok(/ALTERNATIVE CONTENT/.test(content.text));
            done();
          });
      });

      it('should support overriding layouts from locals', (done) => {
        request(server)
          .get('/overrideLayout')
          .expect(200)
          .end((err, content) => {
            if (err) {
              return done(err);
            }
            assert.ok(/OVERRIDE LAYOUT/.test(content.text));
            assert.ok(/OVERRIDE CONTENT/.test(content.text));
            done();
          });
      });

      it('should support specifying no layout from locals', (done) => {
        request(server)
          .get('/noLayout')
          .expect(200)
          .end((err, content) => {
            if (err) {
              return done(err);
            }
            assert.ok(!(/ALTERNATIVE LAYOUT/.test(content.text)));
            assert.ok(/NO LAYOUT CONTENT/.test(content.text));
            done();
          });
      });
    });

    describe('with block content', () => {
      it('should show default without content for', (done) => {
        request(server)
          .get('/blockNoReplace')
          .expect(200)
          .end((err, content) => {
            assert.ok(/DEFAULT BLOCK CONTENT/.test(content.text));
            assert.ok(/NO BLOCK/.test(content.text));
            done(err);
          });
      });

      it('should replace block content with contentFor', (done) => {
        request(server)
          .get('/block')
          .expect(200)
          .end((err, content) => {
            assert.ok(/CONTENT FOR SIDEBAR/.test(content.text));
            assert.ok(/CONTENT IN THE BODY/.test(content.text));
            done(err);
          });
      });
    });

  });

  describe('when using locals', () => {
    let app,
      server;

    before(() => {
      // Create app which specifies layouts
      app = testApp.create({
        viewPath: __dirname + '/app/assets',
        partialsPath: __dirname + '/app/assets/partials',
        layoutsPath: __dirname + '/app/assets/layouts',
        locals: {
          title: 'Foo'
        }
      });

      server = app.listen();
    });

    after(() => server.close());

    it('should not overflow the call stack when recursive', (done) => {
      request(server)
        .get('/localsRecursive')
        .expect(200)
        .end((err, content) => {
          return done(err);
        });
    });

    it('should render "Foo"', (done) => {
      request(server)
        .get('/locals')
        .expect(200)
        .end((err, content) => {
          assert.ok(/Foo/.test(content.text));
          done(err);
        });
    });

    it('should render "Bar"', (done) => {
      request(server)
        .get('/localsOverride')
        .expect(200)
        .end((err, content) => {
          assert.ok(/Bar/.test(content.text));
          done(err);
        });
    });

    it('should render "Bar" and "State"', (done) => {
      request(server)
      .get('/localsState')
      .expect(200)
      .end((err, content) => {
        assert.ok(/Bar/.test(content.text));
        assert.ok(/State/.test(content.text));
        done(err);
      });
    });
  });

});

describe('let conflict', () => {
  const app = new koa();
  let server;

  before(() => {
    app.use(hbs.middleware({
      viewPath: __dirname + '/app/assets'
    }));

    app.use(async (ctx) => {
      if (ctx.url === '/first') {
        await ctx.render('locals', {
          title: 'hbs'
        });
        return;
      }
      if (ctx.url === '/second') {
        await ctx.render('locals', {
          name: 'hbs'
        });
        return;
      }
    });

    server = app.listen();
  });

  after(() => server.close());

  it('should render title', (done) => {
    request(server)
      .get('/first')
      .expect(200)
      .end((err, content) => {
        assert.ok(content.text.indexOf('<h1>hbs</h1>') !== -1);
        done(err);
      });
  });

  it('should not have title', (done) => {
    request(server)
      .get('/second')
      .expect(200)
      .end((err, content) => {
        assert.ok(content.text.indexOf('<h1></h1>') !== -1);
        done(err);
      });
  });
});

describe('list of view paths', () => {
  let app,
    server;

  before(() => {
    // Create app which specifies layouts
    app = testApp.create({
      viewPath: [
        __dirname + '/app/assets',
        __dirname + '/app/otherViews',
        __dirname + '/app/pathThatDoesNotExist'
      ],
      partialsPath: __dirname + '/app/assets/partials',
      layoutsPath: __dirname + '/app/assets/layouts'
    });

    server = app.listen();
  });

  after(() => server.close());

  it('searches for views in all paths', (done) => {
    request(server)
      .get('/tplInOtherDir')
      .expect(200)
      .end((err, content) => {
        assert.ok(content.text.indexOf('I\'m in another directory!') !== -1);
        done(err);
      });
  });
});
