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
const path   = require('path');
const gulp   = require('gulp');
const jshint = require('gulp-jshint');
const mocha  = require('gulp-mocha');
const jsdoc  = require('gulp-jsdoc3');

const { parallel, series } = gulp;

const marklogic = require('./');
const proxy = require('./lib/proxy-generator.js');
const testproxy = require('./test-basic-proxy/testGenerator.js');
const testconfig = require('./etc/test-config.js');
const basicloader = require('./lib/basic-loader.js');

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

let testModulesClient = null;
function getTestModulesClient() {
  if (testModulesClient === null) {
    const connectionParams = {
      host:     testconfig.restEvaluatorConnection.host,
      port:     testconfig.restEvaluatorConnection.port,
      user:     testconfig.restEvaluatorConnection.user,
      password: testconfig.restEvaluatorConnection.password,
      authType: testconfig.restEvaluatorConnection.authType,
      database: 'unittest-nodeapi-modules'
    };
    testModulesClient = marklogic.createDatabaseClient(connectionParams);
  }
  return testModulesClient;
}
function getTestDocumentPermissions() {
  return [
    {'role-name':'rest-reader', capabilities:['read', 'execute']},
    {'role-name':'rest-writer', capabilities:['update']}
  ];
}

function loadProxyTestInspector(callback) {
  const testdir    = path.resolve('test-basic-proxy');
  const modulesdir = path.resolve(testdir, 'ml-modules');
  const filePath           = path.resolve(modulesdir, 'testInspector.sjs');
  const databaseClient     = getTestModulesClient();
  const documentDescriptor = {
    uri:         '/dbf/test/testInspector.sjs',
    contentType: 'application/vnd.marklogic-javascript',
    permissions: getTestDocumentPermissions()
  };
  basicloader.loadFile(callback, {
    filePath:           filePath,
    databaseClient:     databaseClient,
    documentDescriptor: documentDescriptor
  });
}

function loadProxyTestData(callback) {
  const testdir = path.resolve('test-basic-proxy');
  const filePath           = path.resolve(testdir, 'testdef.json');
  const databaseClient     = marklogic.createDatabaseClient(testconfig.restWriterConnection);
  const documentDescriptor = {
    uri:         '/dbf/test.json',
    contentType: 'application/json'
  };
  basicloader.loadFile(callback, {
    filePath:           filePath,
    databaseClient:     databaseClient,
    documentDescriptor: documentDescriptor
  });
}

function loadProxyTestCases(callback) {
  const databaseClient   = getTestModulesClient();
  const documentMetadata = {
    collections: ['/dbf/test/cases'],
    permissions: getTestDocumentPermissions()
  };
  const uriPrefix     = '/dbf/test/';
  const uriStartDepth = 4;
  return gulp.src([
    'test-basic-proxy/ml-modules/*/*/service.json',
    'test-basic-proxy/ml-modules/*/*/*.api',
    'test-basic-proxy/ml-modules/*/*/*.sjs',
    'test-basic-proxy/ml-modules/*/*/*.mjs',
    'test-basic-proxy/ml-modules/*/*/*.xqy'
        ])
      .pipe(basicloader.loadFileStream({
        databaseClient:   databaseClient,
        documentMetadata: documentMetadata,
        uriPrefix:        uriPrefix,
        uriStartDepth:    uriStartDepth
        }));
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
          should: require('chai')
        }
      }));
}
function proxyDocTests() {
  return gulp.src(['test-basic-proxy/lib/positive/DescribedBundle.js'])
      .pipe(jsdoc({opts:{destination:'test-basic-proxy/doc'}}));
}

exports.doc = doc;
exports.lint = lint;
exports.loadProxyTests     = parallel(loadProxyTestInspector, loadProxyTestData, loadProxyTestCases);
exports.generateProxyTests = parallel(positiveProxyTests, negativeProxyTests, generatedProxyTests);
exports.generateProxyDocTests = proxyDocTests;
exports.runProxyTests = runProxyTests;
exports.proxyTests = series(
    parallel(loadProxyTestInspector, loadProxyTestData, loadProxyTestCases),
    parallel(positiveProxyTests, negativeProxyTests, generatedProxyTests),
    proxyDocTests,
    runProxyTests);
exports.test = test;
exports.default = lint;
