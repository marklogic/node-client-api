/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
var should = require('should');

var fs = require('fs');
var valcheck = require('core-util-is');

var testconfig = require('../etc/test-config.js');

var marklogic = require('../');
var q = marklogic.queryBuilder;

var db = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var restAdminDB = marklogic.createDatabaseClient(testconfig.restAdminConnection);

describe('when configuring resource services', function(){
  var serviceName = 'timeService';
  var servicePath = './test-basic/data/timeService.xqy';
  it('should write the resource service with positional parameters', function(done){
    this.timeout(3000);
    restAdminDB.config.resources.write(serviceName, 'xquery', fs.createReadStream(servicePath))
    .result(function(response){
      done();
      })
    .catch(done);
  });
  it('should write the resource service with named parameters', function(done){
    this.timeout(3000);
    restAdminDB.config.resources.write({
      name:        serviceName,
      title:       'The Time Service',
      description: 'About time.',
      provider:    'Temporizers',
      version:     0.1,
      format:      'xquery',
      source:      fs.createReadStream(servicePath)
      })
    .result(function(response){
      done();
      })
    .catch(done);
  });
  it('should read the resource service', function(done){
    restAdminDB.config.resources.read(serviceName)
    .result(function(source){
      (!valcheck.isNullOrUndefined(source)).should.equal(true);
      (typeof source).should.equal('string');
      done();
      })
    .catch(done);
  });
  it('should list the resource services', function(done){
    db.config.resources.list()
    .result(function(response){
      response.should.have.property('resources');
      response.resources.should.have.property('resource');
      response.resources.resource.length.should.be.above(0);
      response.resources.resource.filter(function(item){return item.name === serviceName;}).
          length.should.equal(1);
      done();
      })
    .catch(done);
  });
  it('should delete the resource service', function(done){
    restAdminDB.config.resources.remove(serviceName)
    .result(function(response){
      done();
      })
    .catch(done);
  });
  // TODO: test streaming of source and list
});
