/*
 * Copyright 2014 MarkLogic Corporation
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
var gulp      = require('gulp');
var jshint    = require('gulp-jshint');
var mocha     = require('gulp-mocha');
var jsdoc     = require('gulp-jsdoc');
var intercept = require('gulp-intercept');
// var debug     = require('gulp-debug');

gulp.task('lint', function() {
  gulp.src('./lib/*')
      .pipe(jshint())
      .pipe(jshint.reporter('default'));
});

gulp.task('test', function() {
  gulp.src(['./test/*.js'])
      .pipe(mocha({
        reporter: 'spec',
        globals: {
            should: require('should')
        }
      }));
});

// TODO: debug jsdoc outside of gulp
gulp.task('doc', function() {
  gulp.src(['./*', 'README.md'])
      .pipe(jsdoc('./doc'));
});

// do not run optimistic locking example concurrently
// with other examples
gulp.task('examples', function() {
  gulp.src(['./examples/*.js', '!./examples/before-*.js', '!./examples/optimistic-locking.js'],
        {read: false}
      )
    .pipe(intercept(function(file){
      require(file.path);
    }));
});

gulp.task('default', ['lint']);
