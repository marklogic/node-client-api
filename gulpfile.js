/*
 * Copyright 2014-2019 MarkLogic Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const gulp   = require('gulp');
const jshint = require('gulp-jshint');
const mocha  = require('gulp-mocha');
const jsdoc  = require('gulp-jsdoc3');


function lint() {
  return gulp.src('lib/*')
      .pipe(jshint({lookup:true}))
      .pipe(jshint.reporter('default'));
}

function test() {
  return gulp.src(['test-basic/*.js'])
      .pipe(mocha({
        reporter: 'spec',
        globals: {
            should: require('should')
        }
      }));
}

function doc() {
  // TODO: clear the directory first
  const config = require('./jsdoc.json');
  return gulp.src(['./lib/*.js', 'README.md'])
    .pipe(jsdoc(config));
}

exports.doc = doc;
exports.lint = lint;
exports.test = test;
exports.default = lint;
