/*
 * Copyright (c) 2021 MarkLogic Corporation
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

  describe('tests for new scoring method - bm25', function() {
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
        assert(response.columns != null)
        assert(response.rows != null)
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

  });

  describe('tests for new scoring method - bm25', function() {
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
        assert(response.columns != null)
        assert(response.rows != null)
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
  });
});
