/*
* Copyright (c) 2015-2026 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
'use strict';

const should = require('should');

const marklogic = require('../');
const p = marklogic.planBuilder;

const pbb = require('./plan-builder-base');
const execPlan = pbb.execPlan;
const getResults = pbb.getResults;
const assert = require('assert');
const testlib = require("../etc/test-lib");
let serverConfiguration = {};

describe('search', function() {
  before(function (done) {
    this.timeout(6000);
    try {
      testlib.findServerConfiguration(serverConfiguration);
      setTimeout(()=>done(), 3000);
    } catch(error){
      done(error);
    }
  });
  describe('accessors', function() {
    it('basic', function(done) {
      execPlan(
          p.fromSearch(p.cts.wordQuery('trumpet'))
           .orderBy(p.desc('score'))
      ).then(function(response) {
        const output = getResults(response);
        should(output.length).equal(2);
        should(output[0].score.value).greaterThan(0);
        should(output[1].score.value).greaterThan(0);
        should(output[0].score.value).greaterThanOrEqual(output[1].score.value);
        done();
      }).catch(error => done(error));
    });
    it('query shortcut', function(done) {
      execPlan(
          p.fromSearch('trumpet')
           .orderBy(p.desc('score'))
      ).then(function(response) {
        const output = getResults(response);
        should(output.length).equal(2);
        should(output[0].score.value).greaterThan(0);
        should(output[1].score.value).greaterThan(0);
        should(output[0].score.value).greaterThanOrEqual(output[1].score.value);
        done();
      }).catch(error => done(error));
    });
    it('columns', function(done) {
      this.timeout(5000)
      execPlan(
          p.fromSearch(p.cts.jsonPropertyValueQuery('instrument', 'trumpet'),
                  ['fragmentId', p.col('confidence'), 'fitness', p.as('weight', p.col('quality'))])
      ).then(function(response) {
        const output = getResults(response);
        should(output.length).equal(2);
        should(output[0].confidence.value).greaterThanOrEqual(0);
        should(output[0].fitness.value).greaterThanOrEqual(0);
        should(output[0].weight.value).greaterThanOrEqual(0);
        should(output[1].confidence.value).greaterThanOrEqual(0);
        should(output[1].fitness.value).greaterThanOrEqual(0);
        should(output[1].weight.value).greaterThanOrEqual(0);
        done();
      }).catch(error => done(error));
    });
    it('qualifier', function(done) {
      execPlan(
          p.fromSearch(p.cts.jsonPropertyValueQuery('instrument', 'trumpet'), null, 'relevance')
           .orderBy(p.desc('score'))
      ).then(function(response) {
        const output = getResults(response);
        should(output.length).equal(2);
        should(output[0]['relevance.score'].value).greaterThan(0);
        should(output[1]['relevance.score'].value).greaterThan(0);
        should(output[0]['relevance.score'].value).greaterThanOrEqual(output[1]['relevance.score'].value);
        done();
      }).catch(error => done(error));
    });
    it('qualified columns', function(done) {
      execPlan(
          p.fromSearch(p.cts.jsonPropertyValueQuery('instrument', 'trumpet'),
              ['fragmentId', p.col('confidence'), 'fitness', p.as('weight', p.col('quality'))],
              'relevance')
      ).then(function(response) {
        const output = getResults(response);
        should(output.length).equal(2);
        should(output[0]['relevance.confidence'].value).greaterThanOrEqual(0);
        should(output[0]['relevance.fitness'].value).greaterThanOrEqual(0);
        should(output[0]['relevance.weight'].value).greaterThanOrEqual(0);
        should(output[1]['relevance.confidence'].value).greaterThanOrEqual(0);
        should(output[1]['relevance.fitness'].value).greaterThanOrEqual(0);
        should(output[1]['relevance.weight'].value).greaterThanOrEqual(0);
        done();
      }).catch(error => done(error));
    });
    it('columns with options', function(done) {
      execPlan(
          p.fromSearch(p.cts.jsonPropertyValueQuery('instrument', 'trumpet'),
                  ['score', 'quality'], null, {scoreMethod:'simple', qualityWeight:0})
      ).then(function(response) {
        const output = getResults(response);
        should(output.length).equal(2);
        should(output[0].score.value).greaterThan(0);
        should(output[0].quality.value).greaterThanOrEqual(0);
        should(output[1].score.value).greaterThan(0);
        should(output[1].quality.value).greaterThanOrEqual(0);
        done();
      }).catch(error => done(error));
    });
    it('with fragment id column', function(done) {
      execPlan(
          p.fromSearch(p.cts.jsonPropertyValueQuery('instrument', 'trumpet'))
           .limit(1)
           .select(p.as('fragmentIdCheck', p.isDefined(p.col('fragmentId'))))
      ).then(function(response) {
        const output = getResults(response);
        should(output.length).equal(1);
        should(output[0].fragmentIdCheck.value).equal(true);
        done();
      }).catch(error => done(error));
    });
  });
  describe('convenience', function() {
    it('basic', function(done) {
      execPlan(
          p.fromSearchDocs('trumpet')
           .orderBy(p.desc('score'))
      ).then(function(response) {
        const output = getResults(response);
        should(output.length).equal(2);
        should(output[0].score.value).greaterThan(0);
        should(output[0].uri.type).equal('xs:string');
        should(output[0].uri.value).match(/^\/optic\/test\/musician[0-9]\.json$/);
        should(output[0].doc.type).equal('object');
        should(output[0].doc.value.musician.instrument[0]).equal('trumpet');
        should(output[1].score.value).greaterThan(0);
        should(output[1].uri.type).equal('xs:string');
        should(output[1].uri.value).match(/^\/optic\/test\/musician[0-9]\.json$/);
        should(output[1].doc.type).equal('object');
        should(output[1].doc.value.musician.instrument[0]).equal('trumpet');
        should(output[0].score.value).greaterThanOrEqual(output[1].score.value);
        done();
      }).catch(error => done(error));
    });
    it('qualified', function(done) {
      execPlan(
          p.fromSearchDocs(p.cts.wordQuery('trumpet'), 'relevance')
           .orderBy(p.desc('score'))
      ).then(function(response) {
        const output = getResults(response);
        should(output.length).equal(2);
        should(output[0]['relevance.score'].value).greaterThan(0);
        should(output[0]['relevance.uri'].type).equal('xs:string');
        should(output[0]['relevance.uri'].value).match(/^\/optic\/test\/musician[0-9]\.json$/);
        should(output[0]['relevance.doc'].type).equal('object');
        should(output[0]['relevance.doc'].value.musician.instrument[0]).equal('trumpet');
        should(output[1]['relevance.score'].value).greaterThan(0);
        should(output[1]['relevance.uri'].type).equal('xs:string');
        should(output[1]['relevance.uri'].value).match(/^\/optic\/test\/musician[0-9]\.json$/);
        should(output[1]['relevance.doc'].type).equal('object');
        should(output[1]['relevance.doc'].value.musician.instrument[0]).equal('trumpet');
        should(output[0]['relevance.score'].value).greaterThanOrEqual(output[1]['relevance.score'].value);
        done();
      }).catch(error => done(error));
    });
// console.log(JSON.stringify(output, null, 2));
  });

  describe('tests for new scoring methods - bm25, random and zero using fromSearch.', function() {
    before(function (done) {
      if(serverConfiguration.serverVersion < 12) {
        this.skip();
      }
      done();
    });

    it('should search documents with bm25', function(done) {
      execPlan(
          p.fromSearch(p.cts.jsonPropertyValueQuery('instrument', 'trumpet'),
              ['score', 'quality'], null, { scoreMethod: 'bm25', bm25LengthWeight: 0.25 })
      ).then(function(response) {
        assert(response.columns != null);
        assert(response.rows != null);
        done();
      }).catch(error => done(error));
    });

    it('should throw error with invalid bm25LengthWeight', function(done) {
      execPlan(
          p.fromSearch(p.cts.jsonPropertyValueQuery('instrument', 'trumpet'),
              ['score', 'quality'], null, { scoreMethod: 'bm25', bm25LengthWeight: 99 })
      ).catch(error => {
        try{
          assert(error.body.errorResponse.message.toString().includes('Invalid option "bm25-length-weight=99'));
          done();
        } catch(error){
          done(error);
        }
      });
    });

    it('should throw error with string values for bm25LengthWeight', function(done) {
      try {
        execPlan(
            p.fromSearch(p.cts.jsonPropertyValueQuery('instrument', 'trumpet'),
                ['score', 'quality'], null, { scoreMethod: 'bm25', bm25LengthWeight: 'abc' })
        );
      } catch(error){
        assert(error.message.toString().includes('bm25LengthWeight must be a number'));
        done();
      }
    });

    it('should search documents with zero scoring method', function(done) {
      execPlan(
          p.fromSearch(p.cts.jsonPropertyValueQuery('instrument', 'trumpet'),
              ['score', 'quality'], null, { scoreMethod: 'zero'})
      ).then(function(response) {
        assert(response.columns != null);
        assert(response.rows != null);
        for(let i=0; i<response.rows.length; i++){
          assert(response.rows[i].score.value == 0)
        }
        done();
      }).catch(error => done(error));
    });

    it('should search documents with random scoring method', function(done) {
      execPlan(
          p.fromSearch(p.cts.jsonPropertyValueQuery('instrument', 'trumpet'),
              ['score', 'quality'], null, { scoreMethod: 'random'})
      ).then(function(response) {
        assert(response.columns != null);
        assert(response.rows != null);
        done();
      }).catch(error => done(error));
    });
  });

  describe('tests for new scoring methods - bm25, random and zero using fromSearchDocs', function() {
    before(function (done) {
      if(serverConfiguration.serverVersion < 12) {
        this.skip();
      }
      done();
    });

    it('should search documents with bm25', function(done) {
      execPlan(
          p.fromSearchDocs('Armstrong', null, {scoreMethod:'bm25', bm25LengthWeight:0.75})
      ).then(function(response) {
        assert(response.columns != null);
        assert(response.rows != null);
        done();
      }).catch(error => done(error));
    });

    it('should throw error with invalid bm25LengthWeight', function(done) {
      execPlan(
          p.fromSearchDocs('Armstrong', null, {scoreMethod:'bm25', bm25LengthWeight:87})
      ).catch(error => {
        try{
          assert(error.body.errorResponse.message.toString().includes('Invalid option "bm25-length-weight=87'));
          done();
        } catch(error){
          done(error);
        }
      });
    });

    it('should throw error with string values for bm25LengthWeight', function(done) {
      try {
        execPlan(
            p.fromSearchDocs('Armstrong', null, {scoreMethod:'bm25', bm25LengthWeight: 'abc'})
        );
      } catch(error){
        assert(error.message.toString().includes('bm25LengthWeight must be a number'));
        done();
      }
    });

    it('should search documents with zero scoring method', function(done) {
      execPlan(
          p.fromSearchDocs('Armstrong', null, { scoreMethod: 'zero'})
      ).then(function(response) {
        assert(response.columns != null);
        assert(response.rows != null);
        for(let i=0; i<response.rows.length; i++){
          assert(response.rows[i].score.value == 0);
        }
        done();
      }).catch(error => done(error));
    });

    it('should search documents with random scoring method', function(done) {
      execPlan(
          p.fromSearchDocs('Armstrong', null, { scoreMethod: 'random'})
      ).then(function(response) {
        assert(response.columns != null);
        assert(response.rows != null);
        done();
      }).catch(error => done(error));
    });
  });

  describe('fragment option tests for fromSearch', function() {
    const setupXquery = `
      xquery version "1.0-ml";
      let $jsondoc1 := object-node {"AllDataTypes": array-node {object-node {"word":"dog"}, object-node {"rank":1}, object-node {"score":4}}}
      let $jsondoc2 := object-node {"AllDataTypes": array-node {object-node {"word":"cat"}, object-node {"rank":2}, object-node {"score":5}}}
      let $jsondoc3 := object-node {"AllDataTypes": array-node {object-node {"word":"duck"}, object-node {"rank":3}, object-node {"score":6}}}
      return (
        xdmp:document-insert("range-prop-1.json", $jsondoc1, xdmp:default-permissions(), ("elemCol","jsondoc-range")),
        xdmp:document-insert("range-prop-2.json", $jsondoc2, xdmp:default-permissions(), ("elemCol","jsondoc-range")),
        xdmp:document-insert("range-prop-3.json", $jsondoc3, xdmp:default-permissions(), ("elemCol","jsondoc-range")),
        xdmp:document-set-properties("range-prop-1.json", (<my-prop>opticfragmentpropvalue</my-prop>)),
        (: 300s required for CI pipelines where after-hook may run well after setup :)
        xdmp:lock-acquire("range-prop-1.json", "exclusive", "0", "dog rose",  xs:unsignedLong(300)),
        xdmp:lock-acquire("range-prop-2.json", "exclusive", "0", "cat tulip", xs:unsignedLong(300)),
        xdmp:lock-acquire("range-prop-3.json", "exclusive", "0", "duck lily", xs:unsignedLong(300))
      )
    `;

    const teardownReleaseLocks = `
      xquery version "1.0-ml";
      (
        try { xdmp:lock-release("range-prop-1.json") } catch ($e) { if ($e/error:code = "XDMP-NOTLOCKED") then () else xdmp:rethrow() },
        try { xdmp:lock-release("range-prop-2.json") } catch ($e) { if ($e/error:code = "XDMP-NOTLOCKED") then () else xdmp:rethrow() },
        try { xdmp:lock-release("range-prop-3.json") } catch ($e) { if ($e/error:code = "XDMP-NOTLOCKED") then () else xdmp:rethrow() }
      )
    `;

    const teardownDeleteDocs = `
      xquery version "1.0-ml";
      (
        try { xdmp:document-delete("range-prop-1.json") } catch ($e) { if ($e/error:code = "XDMP-DOCNOTFOUND") then () else xdmp:rethrow() },
        try { xdmp:document-delete("range-prop-2.json") } catch ($e) { if ($e/error:code = "XDMP-DOCNOTFOUND") then () else xdmp:rethrow() },
        try { xdmp:document-delete("range-prop-3.json") } catch ($e) { if ($e/error:code = "XDMP-DOCNOTFOUND") then () else xdmp:rethrow() }
      )
    `;

    before(function(done) {
      if (serverConfiguration.serverVersion < 12.1) {
        this.skip();
      }
      pbb.dbWriter.xqueryEval(setupXquery).result()
        .then(() => done())
        .catch(done);
    });

    after(function(done) {
      pbb.dbWriter.xqueryEval(teardownReleaseLocks).result()
        .then(() => pbb.dbWriter.xqueryEval(teardownDeleteDocs).result())
        .then(() => done())
        .catch(done);
    });

    // TC0: No fragment option — default behavior searches document content (same as fragment:'document')
    it('TC0: fromSearch without fragment option should search document content by default', function(done) {
      execPlan(
        p.fromSearch(
          p.cts.wordQuery('dog')
        )
        .joinDocAndUri('doc', 'uri', p.fragmentIdCol('fragmentId'))
        .orderBy('uri')
        .select(['uri', 'doc'])
      ).then(function(response) {
        const output = getResults(response);
        assert(output.length === 1, 'Expected exactly 1 document containing "dog" with default fragment');
        assert(output[0].uri.value === 'range-prop-1.json', 'Expected range-prop-1.json');
        assert(output[0].doc.type === 'object', 'Expected default fragment to return JSON document');
        assert(output[0].doc.value.AllDataTypes[0].word === 'dog', 'Expected word "dog" in document content');
        done();
      }).catch(done);
    });

    // TC0b: Invalid fragment value → client-side error (no server call needed)
    it('TC0b: should throw error for invalid fragment value', function() {
      assert.throws(function() {
        p.fromSearch(
          p.cts.wordQuery('dog'), null, null, { fragment: 'unknown' }
        );
      }, /fragment can only be/);
    });

    // TC1: fragment:'locks' — doc joined from locks fragment must be XML containing 'lock-type'
    it('TC1: fromSearch with fragment:locks should find documents by lock token', function(done) {
      execPlan(
        p.fromSearch(
          p.cts.locksFragmentQuery(p.cts.wordQuery('dog')),
          null, null, { fragment: 'locks' }
        )
        .joinDocAndUri('doc', 'uri', p.fragmentIdCol('fragmentId'))
        .orderBy('uri')
        .select(['uri', 'doc'])
      ).then(function(response) {
        const output = getResults(response);
        assert(output.length === 1, 'Expected exactly 1 result from locks fragment');
        assert(output[0].uri.value === 'range-prop-1.json', 'Expected range-prop-1.json');
        assert(output[0].doc.type === 'element', 'Expected lock doc to be XML element');
        assert(output[0].doc.value.includes('lock-type'), 'Expected lock-type element in lock document');
        done();
      }).catch(done);
    });

    // TC2: fragment:'properties' — doc joined from properties fragment must be XML containing the property value
    it('TC2: fromSearch with fragment:properties should find doc by its properties', function(done) {
      execPlan(
        p.fromSearch(
          p.cts.wordQuery('opticfragmentpropvalue'),
          null, null, { fragment: 'properties' }
        )
        .joinDocAndUri('doc', 'uri', p.fragmentIdCol('fragmentId'))
        .orderBy('uri')
        .select(['uri', 'doc'])
      ).then(function(response) {
        const output = getResults(response);
        assert(output.length === 1, 'Expected exactly 1 result from properties fragment');
        assert(output[0].uri.value === 'range-prop-1.json', 'Expected range-prop-1.json');
        assert(output[0].doc.type === 'element', 'Expected properties doc to be XML element');
        assert(output[0].doc.value.includes('opticfragmentpropvalue'), 'Expected property value in properties document');
        done();
      }).catch(done);
    });

    // TC3: fragment:'any' — returns all fragment types; verify both XML (lock/properties) and JSON (document) rows present
    it('TC3: fromSearch with fragment:any should return results across fragment types', function(done) {
      execPlan(
        p.fromSearch(
          p.cts.locksFragmentQuery(p.cts.wordQuery('dog')),
          null, null, { fragment: 'any' }
        )
        .joinDocAndUri('doc', 'uri', p.fragmentIdCol('fragmentId'))
        .orderBy('uri')
        .select(['uri', 'doc'])
      ).then(function(response) {
        const output = getResults(response);
        assert(output.length > 1, 'Expected multiple rows (all fragment types) with fragment:any');
        const types = output.map(row => row.doc.type);
        assert(types.includes('element'), 'Expected at least one XML fragment (lock or properties)');
        assert(types.includes('object'), 'Expected at least one JSON document fragment');
        done();
      }).catch(done);
    });

    // TC4: fragment:'document' — doc must be JSON containing the word 'dog'
    it('TC4: fromSearch with fragment:document should find documents by content word', function(done) {
      execPlan(
        p.fromSearch(
          p.cts.wordQuery('dog'),
          null, null, { fragment: 'document' }
        )
        .joinDocAndUri('doc', 'uri', p.fragmentIdCol('fragmentId'))
        .orderBy('uri')
        .select(['uri', 'doc'])
      ).then(function(response) {
        const output = getResults(response);
        assert(output.length === 1, 'Expected exactly 1 document containing "dog"');
        assert(output[0].uri.value === 'range-prop-1.json', 'Expected range-prop-1.json');
        assert(output[0].doc.type === 'object', 'Expected document fragment to be JSON');
        assert(output[0].doc.value.AllDataTypes[0].word === 'dog', 'Expected word "dog" in document content');
        done();
      }).catch(done);
    });

    // TC5: explain() on a locks fragment plan should return a valid execution plan structure.
    // Note: the server-side equivalent (TEST26) additionally exercises plan:parse()/plan:execute()
    // on the explain output, but the Node client has no equivalent of those functions.
    it('TC5: explain() on a locks fragment plan should return a valid plan structure', function(done) {
      const plan = p.fromSearch(
        p.cts.locksFragmentQuery(p.cts.wordQuery('dog')),
        null, null, { fragment: 'locks' }
      )
      .joinDocAndUri('doc', 'uri', p.fragmentIdCol('fragmentId'))
      .orderBy('uri')
      .select(['uri', 'doc']);

      pbb.explainPlan(plan)
        .then(function(output) {
          assert(output.node === 'plan', 'Expected explain output to have node:"plan"');
          assert(output.expr != null, 'Expected expr to be present in explain output');
          done();
        })
        .catch(done);
    });

    // TC6: fromSearchDocs with fragment:'locks' — confirms fromSearchDocs honors the fragment option (MLS 12.1+)
    it('TC6: fromSearchDocs with fragment:locks should find documents by lock token', function(done) {
      execPlan(
        p.fromSearchDocs(
          p.cts.locksFragmentQuery(p.cts.wordQuery('dog')),
          null,
          { fragment: 'locks' }
        )
        .orderBy('uri')
        .select(['uri', 'doc'])
      ).then(function(response) {
        const output = getResults(response);
        assert(output.length === 1, 'Expected exactly 1 result from fromSearchDocs with fragment:locks');
        assert(output[0].uri.value === 'range-prop-1.json', 'Expected range-prop-1.json');
        assert(output[0].doc.type === 'element', 'Expected lock doc to be XML element');
        assert(output[0].doc.value.includes('lock-type'), 'Expected lock-type element in lock document');
        done();
      }).catch(done);
    });
  });
});
