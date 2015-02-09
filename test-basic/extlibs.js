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

var fs = require('fs');
var valcheck = require('core-util-is');

var testconfig = require('../etc/test-config.js');

var marklogic = require('../');
var q = marklogic.queryBuilder;

var db = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var restAdminDB = marklogic.createDatabaseClient(testconfig.restAdminConnection);

describe('extension libraries', function(){
  var dbDir    = '/marklogic/query/custom/';
  var dbModule = 'directoryConstraint.xqy';
  var dbPath   = dbDir+dbModule;
  var fsPath   = './test-basic/data/directoryConstraint.xqy';
  describe('when configuring an extension library', function() {
    it('should write the extension library', function(done){
      this.timeout(3000);
      restAdminDB.config.extlibs.write(dbPath, [
          {'role-name':'app-user',    capabilities:['execute']},
          {'role-name':'app-builder', capabilities:['execute', 'read', 'update']}
        ], 'application/xquery', fs.createReadStream(fsPath))
      .result(function(response){done();})
      .catch(done);
    });
    it('should read the extension library', function(done){
      restAdminDB.config.extlibs.read(dbPath)
      .result(function(source){
        (!valcheck.isNullOrUndefined(source)).should.equal(true);
        done();
        })
      .catch(done);
    });
    it('should list the extension libraries', function(done){
      restAdminDB.config.extlibs.list(dbDir)
      .result(function(response){
        response.should.have.property('assets');
        response.assets.length.should.be.greaterThan(0);
        done();
        })
      .catch(done);
    });
    it('should delete the extension library', function(done) {
      restAdminDB.config.extlibs.remove(dbPath)
      .result(function(response){done();})
      .catch(done);
    });
    // TODO: test streaming of source and list
  });

  describe('when configuring a custom query', function() {
    it('should write the custom query', function(done){
      this.timeout(3000);
      restAdminDB.config.query.custom.write(dbModule, [
          {'role-name':'app-user',    capabilities:['execute']},
          {'role-name':'app-builder', capabilities:['execute', 'read', 'update']}
        ], fs.createReadStream(fsPath))
      .result(function(response){done();})
      .catch(done);
    });
    it('should read the custom query', function(done){
      restAdminDB.config.query.custom.read(dbModule)
      .result(function(source){
        (!valcheck.isNullOrUndefined(source)).should.equal(true);
        done();
        })
      .catch(done);
    });
    it('should list the custom queries', function(done){
      restAdminDB.config.query.custom.list()
      .result(function(response){
        response.should.have.property('assets');
        response.assets.length.should.be.greaterThan(0);
        done();
        })
      .catch(done);
    });
    it('should delete the custom query', function(done) {
      restAdminDB.config.query.custom.remove(dbModule)
      .result(function(response){done();})
      .catch(done);
    });
  });

  describe('when using', function() {
    before(function(done){
      this.timeout(3000);
      restAdminDB.config.query.custom.write(dbModule, fs.createReadStream(fsPath))
      .result(function(response) {
        return db.documents.write({
          uri: '/test/extlib/queryDoc1.json',
          collections: ['constraintList'],
          contentType: 'application/json',
          content: {
            rangeKey1:         'constraintValue',
            constraintQueryKey:'constraint query value'
            }
          }).result();
        })
      .then(function(response){done();})
      .catch(done);
    });
    after(function(done) {
      restAdminDB.config.query.custom.remove(dbModule)
      .result(function(response){done();})
      .catch(done);
    });
    it('a custom constraint to parse', function(done){
      db.documents.query(
        q.where(
          q.parsedFrom('dirs:/test/',
            q.parseBindings(
              q.parseFunction('directoryConstraint.xqy', q.bind('dirs'))
              ))
          )
        )
      .result(function(documents) {
        documents.should.be.ok;
        documents.length.should.be.greaterThan(0);
        done();
        })
      .catch(done);
    });
    it('a custom constraint for facet calculation', function(done){
      db.documents.query(
          q.where().
          calculate(
              q.facet('directories', q.calculateFunction('directoryConstraint.xqy'))
              ).
          slice(0)
          )
        .result(function(response) {
          response.length.should.equal(1);
          response[0].should.have.property('facets');
          response[0].facets.should.have.property('directories');
          response[0].facets.directories.should.have.property('facetValues');
          response[0].facets.directories.facetValues.length.should.be.greaterThan(0);
          done();
          })
        .catch(done);
    });
    it('should merge constraints', function(done) {
      db.documents.query(
          q.where(
              q.parsedFrom('range:constraintValue dirs:/test/',
                q.parseBindings(
                  q.range('rangeKey1', q.bind('range'),
                      q.rangeOptions('max-occurs=10')),
                  q.parseFunction('directoryConstraint.xqy', q.bind('dirs'))
                  ))
              ).
          calculate(
              q.facet('range', 'rangeKey1', q.facetOptions('item-frequency')),
              q.facet('dirs', q.calculateFunction('directoryConstraint.xqy'))
              ).
          slice(0)
          )
        .result(function(response) {
          response.length.should.equal(1);
          response[0].should.have.property('facets');
          response[0].facets.should.have.property('dirs');
          response[0].facets.dirs.should.have.property('facetValues');
          response[0].facets.dirs.facetValues.length.should.be.greaterThan(0);
          response[0].facets.should.have.property('range');
          response[0].facets.range.should.have.property('facetValues');
          response[0].facets.range.facetValues.length.should.be.greaterThan(0);
          done();
          })
        .catch(done);
      // TODO: mix of implicit bindings for facets and explicit bindings
    });
  });

  var replaceModuleXQY = 'objectify.xqy';
  var replaceFSPathXQY = './test-basic/data/objectify.xqy';
  describe('when configuring a replacement library', function() {
    it('should write the replacement library', function(done){
      this.timeout(3000);
      restAdminDB.config.patch.replace.write(replaceModuleXQY, [
          {'role-name':'app-user',    capabilities:['execute']},
          {'role-name':'app-builder', capabilities:['execute', 'read', 'update']}
        ], fs.createReadStream(replaceFSPathXQY))
      .result(function(response){done();})
      .catch(done);
    });
    it('should read the replacement library', function(done){
      restAdminDB.config.patch.replace.read(replaceModuleXQY)
      .result(function(source){
        (!valcheck.isNullOrUndefined(source)).should.equal(true);
        done();
        })
      .catch(done);
    });
    it('should list the replacement libraries', function(done){
      restAdminDB.config.patch.replace.list()
      .result(function(response){
        response.should.have.property('assets');
        response.assets.length.should.be.greaterThan(0);
        done();
        })
      .catch(done);
    });
    it('should delete the replacement library', function(done) {
      restAdminDB.config.patch.replace.remove(replaceModuleXQY)
      .result(function(response){
        done();
        })
      .catch(done);
    });
  });

  var patchDoc = '/test/extlib/patchDoc1.json';
  describe('when using an XQuery replacement library', function() {
    before(function(done){
      this.timeout(3000);
      restAdminDB.config.patch.replace.write(replaceModuleXQY, fs.createReadStream(replaceFSPathXQY))
      .result(function(response) {
        return db.documents.write({
          uri: patchDoc,
          contentType: 'application/json',
          content: {
            targetKey:'existing value'
            }
          }).result();
        })
      .then(function(response){done();})
      .catch(done);
    });
    after(function(done) {
      restAdminDB.config.query.custom.remove(replaceModuleXQY)
      .result(function(response){done();})
      .catch(done);
    });
    it('should apply', function(done){
      var p = marklogic.patchBuilder;
      db.documents.patch(patchDoc,
          p.library(replaceModuleXQY),
          p.replace('/targetKey', p.apply('value', {paramKey: 'parameter value'}))
          )
      .result(function(response){
        return db.documents.read(patchDoc).result();
        })
      .then(function(documents) {
        documents.length.should.equal(1);
        var document = documents[0];
        document.should.have.property('content');
        document.content.should.have.property('targetKey');
        document.content.targetKey.should.have.property('value');
        document.content.targetKey.value.should.equal('existing value');
        document.content.targetKey.should.have.property('paramKey');
        document.content.targetKey.paramKey.should.equal('parameter value');
        done();
        })
      .catch(done);
    });
  });
});
