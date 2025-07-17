/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

let testconfig = require('../etc/test-config.js');
let should = require('should');
let marklogic = require('../');
let db = marklogic.createDatabaseClient(testconfig.restWriterConnection);
let uris = ['/hello.xqy', '/hello-2.xqy', '/test-doc.txt', '/test-doc.json'];

describe('document-read-xqy-documents', function() {
    this.timeout(5000);
    before(function(done){
        db.documents.write({
            uri: uris[0],
            contentType: 'application/vnd.marklogic-xdmp',
            content: 'Hello, world! in hello.xqy'
        })
            .result(()=>{
                db.documents.write({
                    uri: uris[1],
                    contentType: 'application/vnd.marklogic-xdmp',
                    content: 'Hello, world! in hello-2.xqy'
                }).result(()=>{
                    db.documents.write({
                        uri: uris[2],
                        contentType: 'text/plain',
                        content: 'Hello, world! in test-doc.txt'
                    }).result(()=> {
                        db.documents.write({
                            uri: uris[3],
                            contentType: 'application/json',
                            content: '{"key":"value"}'
                        }).result(()=> done())
                    })
                })
            })
            .catch(error=> done(error));
    });

    after(function(done){
        db.documents.remove(uris)
            .result(function(response){
                done();
            })
            .catch(err=> done(err));
    });

    it('should read single xqy document and return content in string',  done => {

        db.eval(`cts.doc('/hello.xqy')`).result(res=>{
            res[0].value.should.equal('Hello, world! in hello.xqy')
        }).then(()=> done())
            .catch(error=> done(error))
    });

    it('should read multiple xqy documents and return content in string',  done => {

        db.eval(`Sequence.from([cts.doc('/hello.xqy'), cts.doc('/hello-2.xqy')])`).result(res=>{
            res[0].value.should.equal('Hello, world! in hello.xqy');
            res[1].value.should.equal('Hello, world! in hello-2.xqy');
        }).then(()=> done())
            .catch(error=> done(error))
    });

    it('should read xqy document along with text document and return content in string',  done => {

        db.eval(`Sequence.from([cts.doc('/hello.xqy'), cts.doc('/test-doc.txt')])`).result(res=>{
            res[0].value.should.equal('Hello, world! in hello.xqy');
            res[1].value.should.equal('Hello, world! in test-doc.txt');
        }).then(()=> done())
            .catch(error=> done(error))
    });

    it('should read multiple xqy documents along with json document and return content in string',  done => {

        db.eval(`Sequence.from([cts.doc('/hello.xqy'), cts.doc('/hello-2.xqy'), cts.doc('/test-doc.json')])`).result(res=>{
            res[0].value.should.equal('Hello, world! in hello.xqy');
            res[1].value.should.equal('Hello, world! in hello-2.xqy');
            res[2].value.should.have.property('key');
            res[2].value.key.should.equal('value');
        }).then(()=> done())
            .catch(error=> done(error))
    });
});