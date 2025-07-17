/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
'use strict';
const testconfig = require('../etc/test-config.js');
const marklogic = require('../');
const db = marklogic.createDatabaseClient(testconfig.restWriterConnection);
const op = marklogic.planBuilder;
let should = require('should');
const fs = require("fs");
const testlib = require("../etc/test-lib");
let serverConfiguration = {};

describe('optic-update fromParam tests', function(){
    this.timeout(20000);
    before(function (done) {
        try {
            testlib.findServerConfiguration(serverConfiguration);
            setTimeout(()=>{done();}, 3000);
        } catch(error){
            done(error);
        }
    });

    describe('binding from param', function () {

        before(function(done){
            if(serverConfiguration.serverVersion < 11){
                this.skip();
            }
            done();
        });

    it('test bindParam with null qualifier', function (done) {
        const rows = [{id: 1, firstName: "FirstName1", lastName: "LastName1"}, {
            id: 2,
            firstName: "FirstName2",
            lastName: "LastName2"
        }];

        const outputCols = [{"column": "id", "type": "integer", "nullable": false}, {
            "column": "firstName",
            "type": "string",
            "nullable": true
        }, {"column": "lastName", "type": "string", "nullable": true}];

        const planBuilderTemplate = op.fromParam('myDocs', null, outputCols);
        const temp = {myDocs: rows};
        db.rows.query(planBuilderTemplate,null, temp)
            .then(function (response) {
                const columns = response.columns;
                columns[0].name.should.equal("id");
                columns[1].name.should.equal("firstName");
                columns[2].name.should.equal("lastName");

                const rows = response.rows;
                rows[0].id.value.should.equal(1);
                rows[0].firstName.value.should.equal("FirstName1");
                rows[0].lastName.value.should.equal("LastName1");
                rows[1].id.value.should.equal(2);
                rows[1].firstName.value.should.equal("FirstName2");
                rows[1].lastName.value.should.equal("LastName2");
                done();
            }).catch(err => {
            done(err);
        });
    });

    it('test bindParam with qualifier', function (done) {
        const rows = [{id: 1, firstName: "FirstName1", lastName: "LastName1"}, {
            id: 2,
            firstName: "FirstName2",
            lastName: "LastName2"
        }];

        const outputCols = [{"column": "id", "type": "integer", "nullable": false}, {
            "column": "firstName",
            "type": "string",
            "nullable": true
        }, {"column": "lastName", "type": "string", "nullable": true}];

        const planBuilderTemplate = op.fromParam('myDocs', 'qualifier', outputCols);
        const temp = {myDocs: rows};
        db.rows.query(planBuilderTemplate, null, temp)
            .then(function (response) {
                const rows = response.rows;
                rows[0]['qualifier.id'].value.should.equal(1);
                rows[0]['qualifier.firstName'].value.should.equal("FirstName1");
                rows[0]['qualifier.lastName'].value.should.equal("LastName1");
                rows[1]['qualifier.id'].value.should.equal(2);
                rows[1]['qualifier.firstName'].value.should.equal("FirstName2");
                rows[1]['qualifier.lastName'].value.should.equal("LastName2");
                done();
            }).catch(err => {
            done(err);
        });
    });

    it('test without column', function (done) {
        const rows = [{id: 1, firstName: "FirstName1", lastName: "LastName1"}, {
            id: 2,
            firstName: "FirstName2",
            lastName: "LastName2"
        }];

        const outputCols = [{"type": "integer", "nullable": false}, {
            "type": "string",
            "nullable": true
        }, {"type": "string", "nullable": true}];
        try {
            const planBuilderTemplate = op.fromParam('myDocs', 'qualifier', outputCols);
            const temp = {myDocs: rows};
            db.rows.query(planBuilderTemplate,null, temp);
        } catch (e) {
            e.toString().should.equal('Error: row-col-types argument at 2 of PlanBuilder.fromParam() has invalid argument for PlanRowColTypes value: [object Object]');
            done();
        }

    });

    it('test with qualifier and with column, default type, none; default nullable, false;', function (done) {
        const rows = [{id: 1, firstName: "FirstName1", lastName: "LastName1"}, {
            id: 2,
            firstName: "FirstName2",
            lastName: "LastName2"
        }];

        const outputCols = [{"column": "id"}, {"column": "firstName"}, {"column": "lastName"}];

        const planBuilderTemplate = op.fromParam('myDocs', 'qualifier', outputCols);
        const temp = {myDocs: rows};
        db.rows.query(planBuilderTemplate, null, temp)
            .then(function (response) {
                const rows = response.rows;
                rows[0]['qualifier.id'].value.should.equal(1);
                rows[0]['qualifier.firstName'].value.should.equal("FirstName1");
                rows[0]['qualifier.lastName'].value.should.equal("LastName1");
                rows[1]['qualifier.id'].value.should.equal(2);
                rows[1]['qualifier.firstName'].value.should.equal("FirstName2");
                rows[1]['qualifier.lastName'].value.should.equal("LastName2");
                done();
            }).catch(err => {
            done(err);
        });
    });

    it('test with wrong column type;', function (done) {
        const rows = [{id: 1, firstName: "FirstName1", lastName: "LastName1"}, {
            id: 2,
            firstName: "FirstName2",
            lastName: "LastName2"
        }];

        const outputCols = [{"column": 2}, {"column": true}, {"column": null}];

        try {
            const planBuilderTemplate = op.fromParam('myDocs', 'qualifier', outputCols);
            const temp = {myDocs: rows};
            db.rows.query(planBuilderTemplate, null, temp);
        } catch (e) {
            e.toString().should.equal('Error: row-col-types argument at 2 of PlanBuilder.fromParam() has another type than string');
            done();
        }
    });

    it('test with column and type (nullable default false)', function (done) {
        const rows = [{id: 1, firstName: "FirstName1", lastName: "LastName1"}, {
            id: 2,
            firstName: "FirstName2",
            lastName: "LastName2"
        }];

        const outputCols = [{"column": "id", "type": "integer"}, {
            "column": "firstName",
            "type": "string"
        }, {"column": "lastName", "type": "string"}];

        try {
            const planBuilderTemplate = op.fromParam('myDocs', null, outputCols);
            const temp = {myDocs: rows};
            db.rows.query(planBuilderTemplate, null, temp)
                .then(function (response) {
                    const rows = response.rows;
                    rows[0].id.value.should.equal(1);
                    rows[0].firstName.value.should.equal("FirstName1");
                    rows[0].lastName.value.should.equal("LastName1");
                    rows[1].id.value.should.equal(2);
                    rows[1].firstName.value.should.equal("FirstName2");
                    rows[1].lastName.value.should.equal("LastName2");
                    done();
                }).catch(e => {
                done(e);
            });
        } catch (e) {
            done(e);
        }
    });

    it('test with nullable default false, expect an exception', function (done) {
        const rows = [{id: 1, firstName: 'firstName_1'}];

        const outputCols = [{"column": "id", "type": "integer"}, {
            "column": "firstName",
            "type": "string"
        }, {"column": "lastName", "type": "string"}];
        const planBuilderTemplate = op.fromParam('myDocs', 'qualifier', outputCols);
        const temp = {myDocs: rows};
        db.rows.query(planBuilderTemplate, null, temp).catch(e => {
            e.toString().includes('Error: binding arguments /v1/rows: cannot process response with 500 status');
            done();
        });
    });

    it('test with different columns', function (done) {
        const rows = [{id: 1, firstName: 'firstName_1', lastName: 'lastName_1'}];

        const outputCols = [{"column": "id1", "type": "string", "nullable": true}, {
            "column": "firstName",
            "type": "string",
            "nullable": true
        }, {"column": "lastName", "type": "string", "nullable": true}];
        const planBuilderTemplate = op.fromParam('myDocs', 'qualifier', outputCols);
        const temp = {myDocs: rows};
        db.rows.query(planBuilderTemplate, null,temp).catch(e => {
            e.toString().includes('Error: binding arguments /v1/rows: cannot process response with 500 status');
            done();
        });
    });

    it('test with column and invalid type', function (done) {
        const rows = [{id: 1, firstName: 'firstName_1', lastName: 'lastName_1'}];

        const outputCols = [{"column": "id", "type": "string", "nullable": false}, {
            "column": "firstName",
            "type": "string",
            "nullable": true
        }, {"column": "lastName", "type": "string", "nullable": true}];
        const planBuilderTemplate = op.fromParam('myDocs', 'qualifier', outputCols);
        const temp = {myDocs: rows};
        db.rows.query(planBuilderTemplate,null, temp).catch(e => {
            e.toString().includes('Error: binding arguments /v1/rows: cannot process response with 500 status');
            done();
        });
    });

    it('test with when non-nullable column is null', function (done) {
        const rows = [{id: null, firstName: 'firstName_1', lastName: 'lastName_1'}];

        const outputCols = [{"column": "id", "type": "integer", "nullable": false}, {
            "column": "firstName",
            "type": "string",
            "nullable": true
        }, {"column": "lastName", "type": "string", "nullable": true}];
        try {
            const planBuilderTemplate = op.fromParam('myDocs', null, outputCols);
            const temp = {myDocs: rows};
            db.rows.query(planBuilderTemplate,null, temp)
                .catch(e => {
                    e.toString().includes('Error: binding arguments /v1/rows: cannot process response with 500 status');
                    done();
                });
        } catch (e) {
            done();
        }

    });

    it('test with extra non-defined column types', function (done) {
        const rows = [{id: 1, firstName: 'firstName_1', lastName: 'lastName_1', cell: 1234567890}];

        const outputCols = [{"column": "id", "type": "integer", "nullable": false},
            {"column": "firstName", "type": "string", "nullable": true},
            {"column": "lastName", "type": "string", "nullable": true}];
        const planBuilderTemplate = op.fromParam('myDocs', null, outputCols);
        const temp = {myDocs: rows};
        db.rows.query(planBuilderTemplate, null,temp)
            .catch(e => {
                e.toString().includes('Error: binding arguments /v1/rows: cannot process response with 500 status');
                done();
            });

    });

    it('test with non-consistent binding argument name', function (done) {
        const rows = [{id: 1, firstName: 'firstName_1', lastName: 'lastName_1'}];

        const outputCols = [{"column": "id", "type": "integer", "nullable": false},
            {"column": "firstName", "type": "string", "nullable": true},
            {"column": "lastName", "type": "string", "nullable": true}];
        const planBuilderTemplate = op.fromParam('myDocs', null, outputCols);
        const temp = {bindingParam: rows};
        db.rows.query(planBuilderTemplate, null, temp)
            .catch(e => {
                e.toString().includes('Error: binding arguments /v1/rows: cannot process response with 500 status');
                done();
            });

    });

    it('should throw exception when mismatch type is specified', function (done) {
        const rows = [
            {id: 1, firstName: 'firstName_1', lastName: 'lastName_1'},
            {id: 2, firstName: 'firstName_2', lastName: 'lastName_2'}
        ];

        const outputCols = [
            {"column": "id", "type": "string", "nullable": false},
            {"column": "firstName", "type": "string", "nullable": true},
            {"column": "lastName", "type": "string", "nullable": true}
        ];
        const planBuilderTemplate = op.fromParam('myDocs', null, outputCols);
        const temp = {myDocs: rows};
        db.rows.query(planBuilderTemplate, null, temp)
            .catch(e => {
                e.toString().includes('Error: binding arguments /v1/rows: cannot process response with 500 status');
                done();
            });

    });

    it('test with different datatypes for selected arguments', function (done) {
        const rows = [
            {id: 1, firstName: 'firstName_1', lastName: 'lastName_1'},
            {id: 2, firstName: 'firstName_2', lastName: 'lastName_2'}
        ];

        const outputCols = [
            {"column": "id", "type": "string", "nullable": false},
            {"column": "firstName", "type": "string", "nullable": true},
            {"column": "lastName", "type": "string", "nullable": true}
        ];
        try {
            const planBuilderTemplate = op.fromParam('myDocs', 1234, outputCols);
            const temp = {myDocs: rows};
            db.rows.query(planBuilderTemplate, null, temp);
        } catch (e) {
            e.toString().includes('Error: qualifier argument at 1 of PlanBuilder.fromParam() must be a XsString value');
            done();
        }

    });

    it('test with none type', function (done) {
        const rows = [
            {id: 1, firstName: 'firstName_1', lastName: 'lastName_1'}
        ];

        const outputCols = [
            {"column": "id", "type": "integer", "nullable": false},
            {"column": "firstName", "type": "string", "nullable": true},
            {"column": "lastName", "type": "none", "nullable": true},
        ];
        const planBuilderTemplate = op.fromParam('myDocs', null, outputCols);
        const temp = {myDocs: rows};
        db.rows.query(planBuilderTemplate, null, temp).then(res => {
            const rows = res.rows;
            rows[0].id.value.should.equal(1);
            rows[0].firstName.value.should.equal("firstName_1");
            rows[0].lastName.value.should.equal("lastName_1");
            done();
        });

    });

    it('should return nothing when rows is null', function (done) {
        const rows = null;

        const outputCols = [
            {"column": "id"},
            {"column": "firstName", "nullable": true},
            {"column": "lastName", "nullable": true},
        ];
        const planBuilderTemplate = op.fromParam('myDocs', null, outputCols);
        const temp = {myDocs: rows};
        db.rows.query(planBuilderTemplate, null, temp).then(res => {
            try {
                should.not.exist(res);
                done();
            } catch (e) {
                done(e);
            }
        }).catch(e => {
            done(e);
        });

    });

    it('test fromParam with with only 1 colType object', function (done) {
        const rows = [{uriNew: '/optic/update/remove4.json'}, {uriNew: '/optic/update/remove5.json'}];
        const outputCols = {"column": "uriNew", "type": "string", "nullable": false};

        const planBuilderTemplate = op.fromParam('myDocs', null, outputCols);
        const temp = {myDocs: rows};
        db.rows.query(planBuilderTemplate, null, temp).then(res => {
            try {
                const rows = res.rows;
                rows[0].uriNew.value.should.equal("/optic/update/remove4.json");
                rows[1].uriNew.value.should.equal("/optic/update/remove5.json");
                done();
            } catch (e) {
                done(e);
            }
        }).catch(e => {
            done(e);
        });

    });

    it('test with data as file', function (done) {
        const rowsData = fs.readFileSync('./test-basic/data/dataFromParam.json', 'utf8');
        const rows = JSON.parse(rowsData);
        const outputCols = [
            {"column": "rowId"},
            {"column": "colorId", "nullable": true},
        ];
        const planBuilderTemplate = op.fromParam('bindingParam', null, outputCols);
        const temp = {bindingParam: rows};
        db.rows.query(planBuilderTemplate, null, temp).then(res => {
            try {
                const rows = res.rows;
                rows[0].rowId.value.should.equal(1);
                rows[0].colorId.value.should.equal(1);
                rows[1].rowId.value.should.equal(2);
                rows[1].colorId.value.should.equal(2);
                done();
            } catch (e) {
                done(e);
            }
        }).catch(e => {
            done(e);
        });
    });

        it('test with bindingParam as Json string', function (done) {
            const outputCols = [
                {"column": "rowId"},
                {"column": "colorId", "nullable": true},
            ];
            const planBuilderTemplate = op.fromParam('bindingParam', null, outputCols);
            const temp = {bindingParam: "[\n" +
                    "  {\"rowId\": 1, \"colorId\": 1},\n" +
                    "  {\"rowId\": 2, \"colorId\": 2}\n" +
                    "]"};
            db.rows.query(planBuilderTemplate, null, temp).then(res => {
                try {
                    const rows = res.rows;
                    rows[0].rowId.value.should.equal(1);
                    rows[0].colorId.value.should.equal(1);
                    rows[1].rowId.value.should.equal(2);
                    rows[1].colorId.value.should.equal(2);
                    done();
                } catch (e) {
                    done(e);
                }
            }).catch(e => {
                done(e);
            });
        });

    it('test fromParam binding binary files', function (done) {
        const bindingParam = "bindingParam";

        const rows = [{rowId: 1, doc: 'doc1.bin'}, {rowId: 2, doc: 'doc2.bin'}];
        const attachments = [{"doc1.bin": "test bin 1"}, {"doc2.bin": "this is test for bin 2"}];
        const metadata = {"attachments": {"docs": [{"rowsField": bindingParam, "column": "doc"}]}};
        const outputCols = [{"column": "rowId", "type": "integer", "nullable": false}, {
            "column": "doc",
            "type": "none",
            "nullable": true
        }];

        const planBuilderTemplate = op.fromParam(bindingParam, null, outputCols);
        const bindParam = {[bindingParam]: rows, attachments: attachments, metadata: metadata};
        db.rows.query(planBuilderTemplate, null,bindParam).then(res => {
            try {
                const rows = res.rows;
                rows[0].rowId.value.should.equal(1);
                rows[1].rowId.value.should.equal(2);
                rows[0].doc.type.should.equal('binary');
                rows[1].doc.type.should.equal('binary');
                rows[0].doc.value.should.equal('746573742062696e2031');
                rows[1].doc.value.should.equal('74686973206973207465737420666f722062696e2032');
                done();
            } catch (e) {
                done(e);
            }
        }).catch(e => {
            done(e);
        });
    });

    it('test fromParam binding xml files', function (done) {
        const bindingParam = "bindingXmlFiles";

        const rows = [{rowId: 1, doc: 'doc1.xml'}, {rowId: 2, doc: 'doc2.xml'}];
        const attachments = [{"doc1.xml": "<doc>1</doc>"}, {"doc2.xml": "<doc>2</doc>"}];
        const metadata = {"attachments": {"docs": [{"rowsField": bindingParam, "column": "doc"}]}};
        const outputCols = [{"column": "rowId", "type": "integer", "nullable": false}, {
            "column": "doc",
            "type": "none",
            "nullable": true
        }];
        const planBuilderTemplate = op.fromParam(bindingParam, null, outputCols);
        const bindParam = {[bindingParam]: rows, attachments: attachments, metadata: metadata};
        db.rows.query(planBuilderTemplate,null, bindParam).then(res => {
            try {
                const rows = res.rows;
                rows[0].rowId.value.should.equal(1);
                rows[1].rowId.value.should.equal(2);
                rows[0].doc.type.should.equal('element');
                rows[1].doc.type.should.equal('element');
                rows[0].doc.value.should.equal('<doc>1</doc>');
                rows[1].doc.value.should.equal('<doc>2</doc>');
                done();
            } catch (e) {
                done(e);
            }
        }).catch(e => {
            done(e);
        });
    });

    it('test fromParam binding txt files', function (done) {
        const bindingParam = "bindingTxtFiles";

        const rows = [{rowId: 1, doc: 'doc1.txt'}, {rowId: 2, doc: 'doc2.txt'}];
        const attachments = [{"doc1.txt": "doc1-text"}, {"doc2.txt": "doc2-text"}];
        const metadata = {"attachments": {"docs": [{"rowsField": bindingParam, "column": "doc"}]}};
        const outputCols = [{"column": "rowId", "type": "integer", "nullable": false}, {
            "column": "doc",
            "type": "none",
            "nullable": true
        }];

        const planBuilderTemplate = op.fromParam(bindingParam, null, outputCols);
        const bindParam = {[bindingParam]: rows, attachments: attachments, metadata: metadata};

        db.rows.query(planBuilderTemplate, null, bindParam).then(res => {
            try {
                const rows = res.rows;
                rows[0].rowId.value.should.equal(1);
                rows[1].rowId.value.should.equal(2);
                rows[0].doc.type.should.equal('text');
                rows[1].doc.type.should.equal('text');
                rows[0].doc.value.should.equal('doc1-text');
                rows[1].doc.value.should.equal('doc2-text');
                done();
            } catch (e) {
                done(e);
            }
        }).catch(e => {
            done(e);
        });
    });

    it('test fromParam single doc attachment as object', function (done) {
        const bindingParam = "bindingSingleDoc";

        const rows = [{rowId: 1, doc: 'doc1.txt'}];
        const attachments = {"doc1.txt": "doc1-text"};
        const metadata = {"attachments": {"docs": [{"rowsField": bindingParam, "column": "doc"}]}};
        const outputCols = [{"column": "rowId", "type": "integer", "nullable": false}, {
            "column": "doc",
            "type": "none",
            "nullable": true
        }];

        const planBuilderTemplate = op.fromParam(bindingParam, null, outputCols);
        const bindParam = {[bindingParam]: rows, attachments: attachments, metadata: metadata};

        db.rows.query(planBuilderTemplate, null, bindParam).then(res => {
            try {
                const rows = res.rows;
                rows[0].rowId.value.should.equal(1);
                rows[0].doc.type.should.equal('text');
                rows[0].doc.value.should.equal('doc1-text');
                done();
            } catch (e) {
                done(e);
            }
        }).catch(e => {
            done(e);
        });
    });

    it('test fromParam with multiple attachments column', function (done) {
        const bindingParam = "bindingMultipleAttachments columns";

        const rows = [{rowId: 1, doc: 'doc.xml', otherDoc: 'otherDoc.xml'}];
        const attachments = [{"doc.xml": "<doc>doc1</doc>"}, {'otherDoc.xml': "<otherDoc>otherDoc1</otherDoc>"}];
        const metadata = {
            "attachments": {
                "docs": [
                    {"rowsField": bindingParam, "column": "doc"},
                    {"rowsField": bindingParam, "column": "otherDoc"}
                ]
            }
        };
        const outputCols = [{"column": "rowId", "type": "integer", "nullable": false}, {
            "column": "doc",
            "type": "none",
            "nullable": true
        }, {"column": "otherDoc", "type": "none", "nullable": true}];

        const planBuilderTemplate = op.fromParam(bindingParam, null, outputCols);
        const bindParam = {[bindingParam]: rows, attachments: attachments, metadata: metadata};

        db.rows.query(planBuilderTemplate, null, bindParam).then(res => {
            try {
                const rows = res.rows;
                rows[0].rowId.value.should.equal(1);
                rows[0].doc.type.should.equal('element');
                rows[0].otherDoc.type.should.equal('element');
                rows[0].doc.value.should.equal('<doc>doc1</doc>');
                rows[0].otherDoc.value.should.equal('<otherDoc>otherDoc1</otherDoc>');
                done();
            } catch (e) {
                done(e);
            }
        }).catch(e => {
            done(e);
        });
    });

    it('test fromParam binding xml files with no metadata', function (done) {
        const bindingParam = "bindingXmlFiles";

        const rows = [{rowId: 1, doc: 'doc1.xml'}, {rowId: 2, doc: 'doc2.xml'}];
        const attachments = [{"doc1.xml": "<doc>1</doc>"}, {"doc2.xml": "<doc>2</doc>"}];
        const outputCols = [{"column": "rowId", "type": "integer", "nullable": false}, {
            "column": "doc",
            "type": "none",
            "nullable": true
        }];

        const planBuilderTemplate = op.fromParam(bindingParam, null, outputCols);
        const bindParam = {[bindingParam]: rows, attachments: attachments};

        db.rows.query(planBuilderTemplate, null, bindParam).then(res => {
            try {
                const rows = res.rows;
                rows[0].rowId.value.should.equal(1);
                rows[1].rowId.value.should.equal(2);
                rows[0].doc.value.should.equal('doc1.xml');
                rows[1].doc.value.should.equal('doc2.xml');
                done();
            } catch (e) {
                done(e);
            }
        }).catch(e => {
            done(e);
        });
    });

});
});
