'use strict';

const assert = require('assert');
const path = require('path');
const co = require('co');

describe('unit tests', () => {

  describe('getLayoutPath', () => {
    let hbs;

    before(() => {
      hbs = require('..').create();
      hbs.middleware({
        viewPath: __dirname + '/app/assets',
        layoutsPath: __dirname + '/app/assets/layouts',
        partialsPath: __dirname + '/app/assets/partials'
      });
    });

    it('should return the correct path', () => {
      let layoutPath = path.join(__dirname, '/app/assets/layouts/default.hbs');
      assert.equal(hbs.getLayoutPath('default'), layoutPath);
    });
  });

  describe('registerPartials', () => {
    let hbs;

    before(() => {
      hbs = require('..').create();
      hbs.middleware({
        viewPath: __dirname + '/app/assets'
      });
    });
  });
});
