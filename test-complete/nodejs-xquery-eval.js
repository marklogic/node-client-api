/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
var should = require('should');

var testconfig = require('../etc/test-config-qa.js');

var marklogic = require('../');
var q = marklogic.queryBuilder;

var db = marklogic.createDatabaseClient(testconfig.restReaderConnection);
var dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var dbEval = marklogic.createDatabaseClient(testconfig.restEvaluatorConnection);
var dbAdmin = marklogic.createDatabaseClient(testconfig.restAdminConnection);

describe('Server xquery eval test', function () {

    it('should do simple xquery eval', function (done) {
        dbEval.xqueryEval('fn:true()').result(function (values) {
            //console.log(values);
            values[0].value.should.equal(true);
            done();
        }, done);
    });

    it('should do more complex xquery eval with string', function (done) {
        dbEval.xqueryEval('let $s := "hello" Intentional error to see how this looks in Jenkins' +
                      'let $t := "world"' +
                      'return fn:concat($s, " ", $t)')
            .result(function (values) {
                //console.log(values);
                values[0].value.should.equal('hello world');
                done();
            }, done);
    });

    it('should do more complex xquery eval with xml node', function (done) {
        dbEval.xqueryEval('for $i in (1, 2), $j in ("a", "b")' +
                      'return <oneEval>i is {$i} and js is {$j}</oneEval>')
            .result(function (values) {
                //console.log(values);
                values.length.should.equal(4);
                done();
            }, done);
    });

    it('should do more complex xquery eval with json', function (done) {
        dbEval.xqueryEval('let $object := json:object()' +
                      'let $_ := map:put($object, "a", 111)' +
                      'return xdmp:to-json($object)')
            .result(function (values) {
                //console.log(values);
                values[0].value.a.should.equal(111);
                done();
            }, done);
    });

});
