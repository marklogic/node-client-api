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
var should = require('should');

var marklogic = require('../');
var q = marklogic.queryBuilder;

var connection = {
    host:     'localhost',
    port:     '8004',         // TODO: 8013 from common utility module
    user:     'rest-writer',
    password: 'x',
    authType: 'DIGEST'
};
var restAdminConnection = {};
Object.keys(connection).forEach(function(key){
  if (key === 'user') {
    restAdminConnection.user = 'rest-admin';    
  } else {
    restAdminConnection[key] = connection[key];
  }
});
var db = marklogic.createDatabaseClient(connection);
var restAdminDB = marklogic.createDatabaseClient(restAdminConnection);

// NOTE: clears the forest
// TODO: increase the time allowed
describe('document remove all', function(){
  before(function(done){
    var types = ['collection', 'directory', 'all'];
    var max = 2;
    var docs = [];
    types.forEach(function(type){
      var collection = '/removeAll/'+type;
      for (var i=0; i < max; i++) {
        docs.push({
          uri: collection+'/doc'+i+'.txt',
          collections: [collection],
          contentType: 'text/plain',
          content: type+' text '+i
          });
      }
    });
    db.documents.write(docs).
    result(function(response){done();}, done);
  });
  it('should remove the collection', function(done){
    db.removeAll({collections:'/removeAll/collection'}).
    result(function(result) {
      return db.check('/removeAll/collection/doc'+1+'.txt').result();
      }, done).
    then(function(exists) {
      exists.should.eql(false);
      return db.check('/removeAll/collection/doc'+2+'.txt').result();
    }, done).
    then(function(exists) {
      exists.should.eql(false);
      done();
      }, done);
  });
  it('should remove the directory', function(done){
    db.removeAll({directory:'/removeAll/directory'}).
    result(function(result) {
      return db.check('/removeAll/directory/doc'+1+'.txt').result();
      }, done).
    then(function(exists) {
      exists.should.eql(false);
      return db.check('/removeAll/directory/doc'+2+'.txt').result();
    }, done).
    then(function(exists) {
      exists.should.eql(false);
      done();
      }, done);
  });
  it('should remove all', function(done){
    restAdminDB.removeAll({all:true}).
    result(function(result) {
      return db.check('/removeAll/all/doc'+1+'.txt').result();
      }, done).
    then(function(exists) {
      exists.should.eql(false);
      return db.check('/removeAll/all/doc'+2+'.txt').result();
    }, done).
    then(function(exists) {
      exists.should.eql(false);
      done();
      }, done);
  });
});

