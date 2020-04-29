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

const marklogic = require('../');
const proxy = require('../lib/proxy-generator.js');
const testconfig = require('../etc/test-config-qa.js');
const basicloader = require('../lib/basic-loader.js');

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

let testModulesClient = null;
function getTestModulesClient() {
	var modDBName = testconfig.testServerName+'-modules';
  if (testModulesClient === null) {
    const connectionParams = {
      host:     testconfig.restEvaluatorConnection.host,
      port:     testconfig.restEvaluatorConnection.port,
      user:     testconfig.restEvaluatorConnection.user,
      password: testconfig.restEvaluatorConnection.password,
      authType: testconfig.restEvaluatorConnection.authType,
      database: modDBName
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

function loadQAModules(callback) {
  const databaseClient   = getTestModulesClient();
  const documentMetadata = {
    collections: ['/qa/test/cases'],
    permissions: getTestDocumentPermissions()
  };
  const uriPrefix     = '/qa/test/';
  const uriStartDepth = 2;
  return gulp.src([
    '../test-complete-proxy/ml-modules/*/service.json',
    '../test-complete-proxy/ml-modules/*/*.api',
    '../test-complete-proxy/ml-modules/*/*.sjs',
    '../test-complete-proxy/ml-modules/*/*.mjs',
    '../test-complete-proxy/ml-modules/*/*.xqy'
        ])
      .pipe(basicloader.loadFileStream({
        databaseClient:   databaseClient,
        documentMetadata: documentMetadata,
        uriPrefix:        uriPrefix,
        uriStartDepth:    uriStartDepth
        }));
}
function generateTestFnClasses() {
  return gulp.src('../test-complete-proxy/ml-modules/**/*')
      .pipe(proxy.generate())
      .pipe(gulp.dest('../test-complete-proxy/lib/'));
}

function copyClassesTotestComplete() {
  return gulp.src('./lib/*.js')
    .pipe(gulp.dest('./'));
}

exports.lint = lint;
exports.loadToModulesDB = loadQAModules;
exports.generateFnClasses = generateTestFnClasses;
exports.copyFnClasses = copyClassesTotestComplete;

exports.test = test;
exports.default = lint;