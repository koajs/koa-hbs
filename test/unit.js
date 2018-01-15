'use strict';

import assert from 'assert';
import path from 'path';
import hbs from '../lib/hbs';

describe('unit tests', () => {

  describe('getLayoutPath', () => {
    let _hbs;

    before(() => {
      _hbs = hbs.create();
      _hbs.middleware({
        viewsPath: __dirname + '/app/assets',
        layoutsPath: __dirname + '/app/assets/layouts',
        partialsPath: __dirname + '/app/assets/partials'
      });
    });

    it('should return the correct path', () => {
      let layoutPath = path.join(__dirname, '/app/assets/layouts/default.hbs');
      assert.equal(_hbs.getLayoutPath('default'), layoutPath);
    });
  });

  describe('registerPartials', () => {
    let _hbs;

    before(() => {
      _hbs = hbs.create();
      _hbs.middleware({
        viewsPath: __dirname + '/app/assets'
      });
    });
  });
});
