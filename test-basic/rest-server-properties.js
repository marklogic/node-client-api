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
var should = require('should');

var testconfig = require('../etc/test-config.js');

var valcheck = require('core-util-is');
var marklogic = require('../');

var db = marklogic.createDatabaseClient(testconfig.restAdminConnection);

describe('rest server properties', function() {
  it('should read and write properties', function(done) {
    var propKey = 'validate-queries';
    var origVal = null;
    db.config.serverprops.read()
    .result(function(props) {
      valcheck.isNullOrUndefined(props).should.equal(false);
      origVal = props[propKey];
      valcheck.isNullOrUndefined(origVal).should.equal(false);
      props[propKey] = !origVal;
      return db.config.serverprops.write(props).result();
      })
    .then(function(response) {
      response.should.equal(true);
      return db.config.serverprops.read().result();
      })
    .then(function(props) {
      valcheck.isNullOrUndefined(props).should.equal(false);
      var modVal = props[propKey];
      valcheck.isNullOrUndefined(modVal).should.equal(false);
      modVal.should.equal(!origVal);
      var sparseProps = {};
      sparseProps[propKey] = origVal;
      return db.config.serverprops.write(sparseProps).result();
      })
    .then(function(response) {
      return db.config.serverprops.read().result();
      })
    .then(function(props) {
      valcheck.isNullOrUndefined(props).should.equal(false);
      var revertVal = props[propKey];
      valcheck.isNullOrUndefined(revertVal).should.equal(false);
      revertVal.should.equal(origVal);
      done();
      })
    .catch(done);
  });
});
