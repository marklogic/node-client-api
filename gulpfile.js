/*
 * Copyright 2014-2015 MarkLogic Corporation
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

gulp.task('lint', function() {
  gulp.src('lib/*')
      .pipe(jshint())
      .pipe(jshint.reporter('default'));
});

gulp.task('test', function() {
  gulp.src(['test-basic/*.js'])
      .pipe(mocha({
        reporter: 'spec',
        globals: {
            should: require('should')
        }
      }));
});

gulp.task('doc', function() {
  // TODO: clear the directory first
  gulp.src(['./lib/*.js', 'README.md'])
    .pipe(jsdoc.parser())
    .pipe(jsdoc.generator('doc',
      {
        path:              'etc/marklogic-template',
        systemName:        'MarkLogic Node.js API',
        copyright:         'Copyright 2014-2015 MarkLogic Corporation',
        theme:             'marklogic',
        inverseNav:        true,
        navType:           'vertical',
        outputSourceFiles: false,
        outputSourcePath:  false
        },
      {
        'private':         false,
        monospaceLinks:    false,
        cleverLinks:       false,
        outputSourceFiles: false
        }
      ));
});

gulp.task('default', ['lint']);
