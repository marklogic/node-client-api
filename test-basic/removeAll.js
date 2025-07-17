/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

var should = require('should');

var testconfig = require('../etc/test-config.js');

var marklogic = require('../');

var db = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var restAdminDB = marklogic.createDatabaseClient(testconfig.restAdminConnection);

// NOTE: clears the forest
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
    db.documents.write(docs)
    .result(function(response){done();})
    .catch(done);
  });
  it('should remove the collection', function(done){
    this.timeout(5000);
    db.documents.removeAll({collection:'/removeAll/collection'})
    .result(function(result) {
      return db.documents.probe('/removeAll/collection/doc'+1+'.txt').result();
      })
    .then(function(document) {
      document.exists.should.eql(false);
      return db.documents.probe('/removeAll/collection/doc'+2+'.txt').result();
      })
    .then(function(document) {
      document.exists.should.eql(false);
      done();
      })
    .catch(done);
  });
  it('should remove the directory', function(done){
    this.timeout(5000);
    db.documents.removeAll({directory:'/removeAll/directory'}).
    result(function(result) {
      return db.documents.probe('/removeAll/directory/doc'+1+'.txt').result();
      })
    .then(function(document) {
      document.exists.should.eql(false);
      return db.documents.probe('/removeAll/directory/doc'+2+'.txt').result();
      })
    .then(function(document) {
      document.exists.should.eql(false);
      done();
      })
    .catch(done);
  });
/*
  it('should remove all', function(done){
    this.timeout(15000);
    restAdminDB.documents.removeAll({all:true})
    .result(function(result) {
      return db.documents.probe('/removeAll/all/doc'+1+'.txt').result();
      })
    .then(function(document) {
      document.exists.should.eql(false);
      return db.documents.probe('/removeAll/all/doc'+2+'.txt').result();
      })
    .then(function(document) {
      document.exists.should.eql(false);
      done();
      })
    .catch(done);
  });
 */
});

