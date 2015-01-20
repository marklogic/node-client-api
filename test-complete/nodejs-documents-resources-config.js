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

var testconfig = require('../etc/test-config-qa.js');

var marklogic = require('../');
var q = marklogic.queryBuilder;

var db = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var restAdminDB = marklogic.createDatabaseClient(testconfig.restAdminConnection);

describe('when configuring resource services', function(){
  var serviceName = 'timeService';
  var serviceNameInvalid = 'BlaBla';
  var servicePath = './node-client-api/test-basic/data/timeService.xqy';
    it('should write the resource service with positional parameters', function(done){
    this.timeout(10000);
    restAdminDB.config.resources.write(serviceName, 'xquery', fs.createReadStream(servicePath)).
    result(function(response){
      done();
    }, done);
  }); 
   it('should write the resource service with named parameters', function(done){
    this.timeout(10000);
    restAdminDB.config.resources.write({
      name:        serviceName,
      title:       'The Time Service',
      description: 'About time.',
      provider:    'Temporizers',
      version:     0.1,
      format:      'xquery',
      source:      fs.createReadStream(servicePath)
      }).
    result(function(response){
      done();
    }, done);
  }); 
   it('should read the resource service', function(done){
    restAdminDB.config.resources.read(serviceName).
    result(function(source){
      //console.log(JSON.stringify(source, null, 4));
	  (valcheck.isNullOrUndefined(source)).should.equal(false);
      done();
    }, done);
  }); 
  
  it('should try to read the resource service via invalid name', function(done){
    restAdminDB.config.resources.read(serviceNameInvalid).
    result(function(source){
	  //console.log(JSON.stringify("Output :"+source, null, 4));
	  },function(error){
	  //console.log(JSON.stringify(error, null, 4));
	  (valcheck.isNullOrUndefined(error)).should.equal(false);
	  done();
	  }, done);
  });
  it('should list the resource services', function(done){
    db.config.resources.list().
    result(function(response){
      //Need to verify content
	  //console.log(JSON.stringify(response, null, 4));
      response.should.have.property('resources');
	  response.resources.should.have.property('resource');
	  response.resources.resource.length.should.be.above(0);
      response.resources.resource.filter(function(item){return item.name === serviceName;}).
          length.should.equal(1);
      done();
    }, done);
  }); 
   it('should over-write the resource service with named parameters', function(done){
    this.timeout(10000);
    restAdminDB.config.resources.write({
      name:        serviceName,
      title:       'The Hindustan Time Service',
      description: 'About time zones',
      provider:    'Temporizers',
      version:     0.2,
      format:      'xquery',
      source:      fs.createReadStream(servicePath)
      }).
    result(function(response){
      done();
    }, done);
  }); 
  
/*   //Need to get to the content first
	it('should delete specified resource config ', function(done){
    restAdminDB.config.resources.resource.remove(serviceName).
    result(function(response){
      done();
    }, done);
  });  */ 
  it('should delete the resource service', function(done){
    restAdminDB.config.resources.remove(serviceName).
    result(function(response){
      done();
    }, done);
  });  
    it('should try read the resource service after remove', function(done){
    restAdminDB.config.resources.read(serviceName).
    result(function(source){
	},function(error){
	  //console.log(JSON.stringify(error, null, 4));
	  (valcheck.isNullOrUndefined(error)).should.equal(false);
	  done();
	  }, done);
  });  
   it('should delete the invalid resource service', function(done){
    restAdminDB.config.resources.remove(serviceNameInvalid).
    result(function(response){
      done();
    }, done);
  }); 
 });
