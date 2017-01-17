'use strict';

require('harmonica')();

const eslint = require('gulp-eslint');
const gulp = require('gulp');

gulp.task('lint', () => {
  const glob = [
    '**/*.js',
    '!node_modules'
  ];

  return gulp.src(glob)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

const mocha = require('gulp-mocha');

gulp.task('test', ['lint'], () => {
  const glob = [
    'test/render.js',
    'test/unit.js'
  ];

  return gulp.src(glob, { read: false })
    .pipe(mocha());
});

gulp.task('default', ['lint']);
