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

const { parallel, series } = gulp;

const proxy = require('./lib/proxy-generator.js');
const testproxy = require('./test-basic-proxy/testGenerator.js');
const testload = require('./test-basic-proxy/testLoader.js');

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
  // TODO: clear the directory first - maybe by following this recipe:
  // https://github.com/gulpjs/gulp/blob/master/docs/recipes/delete-files-folder.md
  const config = require('./jsdoc.json');
  return gulp.src(['./lib/*.js', 'README.md'])
    .pipe(jsdoc(config));
}

function loadProxyTests() {
  return gulp.src([
    'test-basic-proxy/ml-modules/*/*/service.json',
    'test-basic-proxy/ml-modules/*/*/*.api',
    'test-basic-proxy/ml-modules/*/*/*.sjs',
    'test-basic-proxy/ml-modules/*/*/*.mjs',
    'test-basic-proxy/ml-modules/*/*/*.xqy'
        ])
      .pipe(testload.load());
}
function positiveProxyTests() {
  return gulp.src('test-basic-proxy/ml-modules/positive/*')
      .pipe(proxy.generate())
      .pipe(gulp.dest('test-basic-proxy/lib/positive/'));
}
function negativeProxyTests() {
  return gulp.src('test-basic-proxy/ml-modules/negative/*')
      .pipe(proxy.generate())
      .pipe(gulp.dest('test-basic-proxy/lib/negative/'));
}
function generatedProxyTests() {
  return gulp.src('test-basic-proxy/ml-modules/generated/*')
      .pipe(testproxy.generate())
      .pipe(gulp.dest('test-basic-proxy/lib/generated/'));
}
function runProxyTests() {
  return gulp.src(['test-basic-proxy/lib/*/*Test.js'])
      .pipe(mocha({
        reporter: 'spec',
        globals: {
          should: require('should')
        }
      }));
}
function proxyDocTests() {
  return gulp.src(['test-basic-proxy/lib/positive/DescribedBundle.js'])
      .pipe(jsdoc({opts:{destination:'test-basic-proxy/doc'}}));
}

exports.doc = doc;
exports.lint = lint;
exports.loadProxyTests = loadProxyTests;
exports.generateProxyTests = parallel(positiveProxyTests, negativeProxyTests, generatedProxyTests);
exports.generateProxyDocTests = proxyDocTests;
exports.proxyTests = series(parallel(positiveProxyTests, negativeProxyTests, generatedProxyTests), proxyDocTests, runProxyTests);
exports.test = test;
exports.default = lint;
