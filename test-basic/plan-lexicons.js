/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

'use strict';

const should = require('should');

const marklogic = require('../');
const p = marklogic.planBuilder;

const pbb = require('./plan-builder-base');
const testconfig = require("../etc/test-config");
const execPlan = pbb.execPlan;
const getResults = pbb.getResults;

describe('lexicons', function() {
  const exportedLexicon =
  {$optic:{ns:'op', fn:'operators', args:[
    {ns:'op', fn:'from-lexicons', args:[{
      uri:{ns:'cts', fn:'uri-reference', args:[]},
      number:{ns:'cts', fn:'json-property-reference', args:['srchNumber']},
      city:{ns:'cts', fn:'json-property-reference', args:['srchCity']}
      },
      'docRange']}
    ]}};

  // This document sometimes gets left behind, so try to remove it before running the test
  // TODO - Need a better method to clean-up the test content database
  before(function (done) {
    const db = marklogic.createDatabaseClient(testconfig.restWriterConnection);
    db.documents.remove(['/optic/test/office1.json']).result(function () {
      done();
    }, function (error) {
      done(error);
    });
  });

  it('on access', function(done) {
    execPlan(
      p.fromLexicons({
              uri:p.cts.uriReference(),
              number:p.cts.jsonPropertyReference('srchNumber'),
              level:p.cts.jsonPropertyReference('srchLevel'),
              city:p.cts.jsonPropertyReference('srchCity')
            })
          .orderBy('number')
      )
    .then(function(response) {
      const output = getResults(response);
      should(output.length).equal(3);
      should(output[0].uri.value).equal('/optic/test/queryDoc3.json');
      should(output[0].number.value).equal(1);
      should(output[0].level.value).equal(10);
      should(output[0].city.value).equal('Bonn');
      should(output[1].uri.value).equal('/optic/test/queryDoc1.json');
      should(output[1].number.value).equal(2);
      should(output[1].level.value).equal(20);
      should(output[1].city.value).equal('Cairo');
      should(output[2].uri.value).equal('/optic/test/queryDoc2.json');
      should(output[2].number.value).equal(3);
      should(output[2].level.value).equal(30);
      should(output[2].city.value).equal('Antioch');
      done();
    })
  .catch(done);
  });
  it('with fragment id column', function(done) {
    execPlan(
      p.fromLexicons({
              uri:    p.cts.uriReference(),
              number: p.cts.jsonPropertyReference('srchNumber')
            },
            null,
            p.fragmentIdCol('sourceDocId'))
          .orderBy('number')
          .select(['uri', 'number', 'sourceDocId',
              p.as('sourceDocCheck', p.isDefined(p.col('sourceDocId')))])
      )
    .then(function(response) {
      const output = getResults(response);
      should(output.length).equal(3);
      should(output[0].uri.value).equal('/optic/test/queryDoc3.json');
      should(output[0].number.value).equal(1);
      should(output[0].sourceDocCheck.value).equal(true);
      should.not.exist(output[0].srcDocId);
      should(output[1].uri.value).equal('/optic/test/queryDoc1.json');
      should(output[1].number.value).equal(2);
      should(output[1].sourceDocCheck.value).equal(true);
      should.not.exist(output[1].srcDocId);
      should(output[2].uri.value).equal('/optic/test/queryDoc2.json');
      should(output[2].number.value).equal(3);
      should(output[2].sourceDocCheck.value).equal(true);
      should.not.exist(output[2].srcDocId);
      done();
    })
  .catch(done);
  });
  it('having col method', function(done) {
    const accessor = p.fromLexicons({
        uri:p.cts.uriReference(),
        number:p.cts.jsonPropertyReference('srchNumber')
      },
      'urinum');
    const colPlan = accessor.select(accessor.col('number'));
    const value = colPlan.export();
    should(value.$optic.args.length).equal(2);
    should(value.$optic.args[1].args.length).equal(1);
    should(value.$optic.args[1].args[0]).deepEqual(
      {ns:'op', fn:'view-col', args:['urinum', 'number']}
    );
    execPlan(
      colPlan
        .orderBy(accessor.col('number'))
        .limit(2)
      )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(2);
        should(output[0]['urinum.number'].value).equal(1);
        should.not.exist(output[0]['urinum.uri']);
        should(output[1]['urinum.number'].value).equal(2);
        should.not.exist(output[1]['urinum.uri']);
        done();
      })
      .catch(done);
  });
  it('with nullable column', function(done) {
    execPlan(
      p.fromLexicons({
              uri:p.cts.uriReference(),
              number:p.cts.jsonPropertyReference('srchNumber', 'nullable')
            })
          .where(p.cts.directoryQuery('/optic/test/'))
          .orderBy('uri')
      )
    .then(function(response) {
      const output = getResults(response);
      should(output.length).equal(13);
      for (let i=0; i < 9; i++) {
        should(output[i].number.value).equal(null);
      }
      should(output[9].uri.value).equal('/optic/test/queryDoc1.json');
      should(output[9].number.value).equal(2);
      should(output[10].uri.value).equal('/optic/test/queryDoc2.json');
      should(output[10].number.value).equal(3);
      should(output[11].uri.value).equal('/optic/test/queryDoc3.json');
      should(output[11].number.value).equal(1);
      should(output[12].number.value).equal(null);
      done();
    })
  .catch(done);
  });
  it('with query', function(done) {
    execPlan(
      p.fromLexicons({
              uri:p.cts.uriReference(),
              number:p.cts.jsonPropertyReference('srchNumber', 'nullable')
            })
          .where(p.cts.jsonPropertyWordQuery('srchColA', 'common'))
          .orderBy('uri')
      )
    .then(function(response) {
      const output = getResults(response);
      should(output.length).equal(2);
      should(output[0].uri.value).equal('/optic/test/queryDoc1.json');
      should(output[0].number.value).equal(2);
      should(output[1].uri.value).equal('/optic/test/queryDoc2.json');
      should(output[1].number.value).equal(3);
      done();
    })
  .catch(done);
  });
  describe('serialize', function() {
    it('on export', function(done) {
      const value =
        p.fromLexicons({
                uri:p.cts.uriReference(),
                number:p.cts.jsonPropertyReference('srchNumber'),
                city:p.cts.jsonPropertyReference('srchCity')
              },
              'docRange')
          .export();
      should(value).deepEqual(exportedLexicon);
      done();
    });
  });
});
