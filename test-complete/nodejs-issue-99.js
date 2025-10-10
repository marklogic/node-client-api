/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
var should = require('should');

var testconfig = require('../etc/test-config-qa.js');

var marklogic = require('../');
var q = marklogic.queryBuilder;

var dbEval = marklogic.createDatabaseClient(testconfig.restEvaluatorConnection);
var dbAdmin = marklogic.createDatabaseClient(testconfig.restAdminConnection);

describe('Issue 99', function () {

    it('should do javascript eval on json', function (done) {
        debugger;
        dbEval.eval('declareUpdate(); var textNode = new NodeBuilder(); textNode.addText("This is a text document"); xdmp.documentInsert("issue99.json", textNode.toNode(), [xdmp.permission("rest-evaluator", "read"), xdmp.permission("rest-evaluator", "update")]);')
            .result(function (values) {
                values.should.be.an.Array;
                values.length.should.equal(0);
                // values[0].value.should.equal(true);
                done();
            }, function (err) {
                // console.log(JSON.stringify(err));
                console.log(err);

                done(err);
            }, done);
    });

    it('should read the document', function (done) {
        dbEval.documents.read({ uris: 'issue99.json', categories: ['content'] }).result(function (documents) {
            var document = documents[0];
            document.uri.should.equal('issue99.json');
            document.category.should.containEql('content');
            done();
        },
        function (err) {
            console.log(err);
            done(err);
        },
        done);
    });

    after(function (done) {
        dbAdmin.documents.removeAll({
            all: true
        }).
            result(function (response) {
                done();
            }, done);
    });



});
