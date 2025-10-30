/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
var should = require('should'),
    testconfig = require('../etc/test-config.js'),
    marklogic = require('../'),
    bunyan = require('bunyan'),
    intercept = require("intercept-stdout");

var dbDefault = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var dbBunyan  = marklogic.createDatabaseClient(testconfig.restWriterConnection);

describe('logging', function(){

  describe('with default', function(){
    dbDefault.setLogger('debug');
    it('should write default entries', function(done){
      var captured = [];
      var unhook = intercept(function(txt) {
          captured.push(txt);
      });
      dbDefault.config.serverprops.read().result(function(response) {
        unhook();
        captured[0].should.startWith('Debug:');
        done();
      }, done);
    });
  });

  describe('with Bunyan', function(){
    var bunyanLogger = bunyan.createLogger({name: 'bunyanlog', level: 'debug'});
    dbBunyan.setLogger(bunyanLogger);
    it('should write Bunyan JSON entries', function(done){
      var captured = [];
      var unhook = intercept(function(txt) {
          captured.push(txt);
      });
      dbBunyan.config.serverprops.read().result(function(response) {
        unhook();
        var first = JSON.parse(captured[0]);
        first.should.have.property('name');
        first.name.should.eql('bunyanlog');
        done();
      }, done);
    });
  });

});



