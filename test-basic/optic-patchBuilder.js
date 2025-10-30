/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
'use strict';
const marklogic = require('../');
let p = marklogic.planBuilder;

var testconfig = require('../etc/test-config.js');
var dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);
const testlib = require("../etc/test-lib");
let uris = ['/test/patch-builder.xml', '/test/optic/patchBuilder.json'];
let serverConfiguration = {};
var assert = require('assert');
describe('optic patchBuilder tests', function() {
    this.timeout(5000);
    before(function (done) {
        try {
            testlib.findServerConfiguration(serverConfiguration);
            setTimeout(()=>{
                if(serverConfiguration.serverVersion < 11.2){
                    this.skip();
                }
                done();}, 3000);
        } catch(error){
            done(error);
        }
    });

    describe('fromDocUris with patchBuilder', function () {

        before(function (done) {

               let doc =  {
                    uri: uris[0],
                    contentType: 'application/xml',
                    content: '<?xml version="1.0" encoding="UTF-8"?>\n' +
                        '<!-- Copyright (c) 2023 MarkLogic Corporation -->\n' +
                        '<Citation Status="Completed">\n' +
                        '    <ID>123</ID>\n' +
                        '    <PMID>5717905</PMID>\n' +
                        '    <Article>\n' +
                        '        <Journal>\n' +
                        '            <ISSN>5678</ISSN>\n' +
                        '            <JournalIssue>\n' +
                        '                <Volume>118</Volume>\n' +
                        '                <Issue>49</Issue>\n' +
                        '                <PubDate>\n' +
                        '                    <Year>1970</Year>\n' +
                        '                    <Month>12</Month>\n' +
                        '                    <Day>07</Day>\n' +
                        '                </PubDate>\n' +
                        '            </JournalIssue>\n' +
                        '        </Journal>\n' +
                        '        <ArticleTitle>\n' +
                        '            The Influence of Calcium on Cholesterol in Human Serum\n' +
                        '        </ArticleTitle>\n' +
                        '        <AuthorList>\n' +
                        '            <Author>\n' +
                        '                <LastName>Doe</LastName>\n' +
                        '                <ForeName>John</ForeName>\n' +
                        '            </Author>\n' +
                        '            <Author>\n' +
                        '                <LastName>Smith</LastName>\n' +
                        '                <ForeName>Jane</ForeName>\n' +
                        '            </Author>\n' +
                        '        </AuthorList>\n' +
                        '    </Article>\n' +
                        '</Citation>',
                   permissions: [
                       {'role-name': 'rest-reader', capabilities: ['read']},
                       {'role-name': 'rest-writer', capabilities: ['read', 'update']}
                   ]
                };
                dbWriter.documents.write(doc)
                    .result(()=> {
                        dbWriter.documents.write({
                            uri: uris[1],
                            contentType: 'application/json',
                            content: '{"person":{"lastName":"lastname-1", "firstName":"firstname-1"}}'
                        }).result(()=>done());
                    })
                    .catch(err => done(err));

        });

        after(function (done){
            dbWriter.documents.remove(uris)
                .result(()=> done())
                .catch(err=> done(err));
        });


        it('should insert comment using insertBefore', function (done) {
            const plan = p.fromDocUris(p.cts.documentQuery(uris[0]))
                .joinDocCols(null, p.fragmentIdCol('fragmentId'))
                .patch(p.col('doc'),
                    p.patchBuilder('/')
                        .insertBefore('Citation', p.xmlComment('Adding xmlComment'))
                );
            dbWriter.rows.query(plan)
                .then(function (response) {
                    assert(response.rows[0].doc.value.toString().includes('<!--Adding xmlComment-->\n' +
                        '<Citation Status="Completed">'), "xmlComment was not inserted");
                    done();
                })
                .catch(err => done(err));
        });

        it('should insert comment using insertAfter', function (done) {
           const plan = p.fromDocUris(p.cts.documentQuery(uris[0]))
               .joinDocCols(null, p.fragmentIdCol('fragmentId'))
               .patch(p.col('doc'),
                   p.patchBuilder('/')
                       .insertAfter('Citation', p.xmlComment('Adding xmlComment')));
            dbWriter.rows.query(plan)
                .then(function (response) {
                    assert(response.rows[0].doc.value.toString().includes('</Citation><!--Adding xmlComment-->'),
                        "xmlComment was not inserted");
                    done();
                })
                .catch(err => done(err));
        });

        it('should insert child element using insertChild', function (done) {
            const plan = p.fromDocUris(p.cts.documentQuery(uris[0]))
                .joinDocCols(null, p.fragmentIdCol('fragmentId'))
                .patch(p.col('doc'),
                    p.patchBuilder('/Citation')
                        .insertChild('Article', p.xmlComment('Adding insertChild xmlComment'))
                );
            dbWriter.rows.query(plan)
                .then(function (response) {
                    assert(response.rows[0].doc.value.toString().includes('<!--Adding insertChild xmlComment--></Article>'),
                        "xmlComment was not inserted");
                    done();
                })
                .catch(err => done(err));
        });

        it('should insert element using insertNamedChild', function (done) {
            const plan = p.fromDocUris(p.cts.documentQuery(uris[1]))
                .joinDocCols(null, p.fragmentIdCol('fragmentId'))
                .patch(p.col('doc'),
                    p.patchBuilder('/')
                        .insertNamedChild('person', 'address', '123')
                );
            dbWriter.rows.query(plan)
                .then(function (response) {
                    assert(response.rows[0].doc.value.person.address === '123', "Address was not added");
                    done();
                })
                .catch(err => done(err));
        });

        it('should delete element using remove', function (done) {
            const plan = p.fromDocUris(p.cts.documentQuery(uris[1]))
                .joinDocCols(null, p.fragmentIdCol('fragmentId'))
                .patch(p.col('doc'),
                    p.patchBuilder('/')
                        .remove('person/firstName')
                );
            dbWriter.rows.query(plan)
                .then(function (response) {
                    assert(response.rows[0].doc.value.person.toString().indexOf('firstName') === -1,
                        "firstName element was not deleted");
                    done();
                })
                .catch(err => done(err));
        });

        it('should replace element using replace', function (done) {
            const plan = p.fromDocUris(p.cts.documentQuery(uris[1]))
                .joinDocCols(null, p.fragmentIdCol('fragmentId'))
                .patch(p.col('doc'),
                    p.patchBuilder('/')
                        .replace('person/firstName', 'test-firstName')
                );
            dbWriter.rows.query(plan)
                .then(function (response) {
                    assert(response.rows[0].doc.value.person.firstName === 'test-firstName',
                        'firstName value was not replaced');
                    done();
                })
                .catch(err => done(err));
        });

        it('should replace content using replaceInsertChild', function (done) {
            const plan = p.fromDocUris(p.cts.documentQuery(uris[1]))
                .joinDocCols(null, p.fragmentIdCol('fragmentId'))
                .patch(p.col('doc'),
                    p.patchBuilder('/')
                        .replaceInsertChild('.', 'person', 'newPerson')
                );
            dbWriter.rows.query(plan)
                .then(function (response) {
                    assert(response.rows[0].doc.value.person === 'newPerson','person value was not replaced');
                    done();
                })
                .catch(err => done(err));
        });

        it('should replace key value using replaceValue', function (done) {
            const plan = p.fromDocUris(p.cts.documentQuery(uris[1]))
                .joinDocCols(null, p.fragmentIdCol('fragmentId'))
                .patch(p.col('doc'),
                    p.patchBuilder('/')
                        .replaceValue( 'person/lastName', 'newLastName')
                );
            dbWriter.rows.query(plan)
                .then(function (response) {
                    assert(response.rows[0].doc.value.person.lastName === 'newLastName' , "lastName was not updated.");
                    done();
                })
                .catch(err => done(err));
        });

        it('should work with two different instances of PlanBuilder', function (done) {
            let planBuilder1 = marklogic.planBuilder;
            let planBuilder2 = marklogic.planBuilder;
            const plan = planBuilder1.fromDocUris(p.cts.documentQuery(uris[0]))
                .joinDocCols(null, planBuilder1.fragmentIdCol('fragmentId'))
                .patch(planBuilder1.col('doc'),
                    planBuilder1.patchBuilder('/')
                        .insertBefore('Citation', planBuilder1.xmlComment('Adding xmlComment'))
                );
            const plan2 = planBuilder2.fromDocUris(planBuilder2.cts.documentQuery(uris[0]))
                .joinDocCols(null, planBuilder2.fragmentIdCol('fragmentId'))
                .patch(planBuilder2.col('doc'),
                    planBuilder2.patchBuilder('/')
                        .insertAfter('Citation', planBuilder2.xmlComment('Adding xmlComment')));
            try {
                assert(JSON.stringify(plan.export()).indexOf('insert-after') === -1);
                assert(JSON.stringify(plan2.export()).indexOf('insert-before') === -1);
                done();
            } catch(error){
                done(error);
            }
        });

        it('should continue with onError as continue during CONFLICTINGUPDATES', function (done) {
            const plan = p.fromDocUris(p.cts.documentQuery(uris[1]))
                .joinDocCols(null, p.fragmentIdCol('fragmentId'))
                .patch(p.col('doc'),
                    p.patchBuilder('/')
                        .replaceValue( 'person/lastName', 'newLastName')
                        .replaceValue( 'person/lastName', 'newLastName-2')
                )
                .onError("continue", p.col("Error"));
            dbWriter.rows.query(plan)
                .then(function (response) {
                    assert(response.rows[0].doc.value.person.lastName === 'lastname-1' , "lastName was updated.");
                    assert(response.rows[0].Error.value.name === 'XDMP-CONFLICTINGUPDATES' ,
                        "should receive error column with value as XDMP-CONFLICTINGUPDATES");
                    done();
                })
                .catch(err => done(err));
        });
    });
});

