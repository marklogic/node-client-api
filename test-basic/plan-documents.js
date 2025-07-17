/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
'use strict';

const should = require('should');

const marklogic = require('../');
const p = marklogic.planBuilder;

const pbb = require('./plan-builder-base');
const execPlan = pbb.execPlan;
const getResults = pbb.getResults;

describe('documents', function() {
  const runnerMod = '/ext/optic/querytester.sjs';
  describe('join uri', function() {
    it('with fragment id', function(done) {
      execPlan(
        p.fromView('opticUnitTest', 'musician', null, p.fragmentIdCol('musicianDocId'))
          .orderBy(p.desc('lastName'))
          .limit(2)
          .joinDocUri('musicianDocUri', p.fragmentIdCol('musicianDocId'))
          .orderBy(p.desc('lastName'))
          .select(null, '')
          )
        .then(function(response) {
          const output = getResults(response);
          should(output.length).equal(2);
          should(output[0].lastName.value).equal('Davis');
          should(output[0].firstName.value).equal('Miles');
          should(output[0].musicianDocUri.value).equal('/optic/test/musician4.json');
          should(output[1].lastName.value).equal('Coltrane');
          should(output[1].firstName.value).equal('John');
          should(output[1].musicianDocUri.value).equal('/optic/test/musician3.json');
          done();
        })
      .catch(done);
    });
  });
    describe('group-bucket', function() {
        it('group-bucket-1', function (done) {
            execPlan(
                p.fromLiterals([

                    {"r": 1, "c1": "a", "c2": 1, "c3": "m"},
                    {"r": 2, "c1": "b", "c2": 1},
                    {"r": 3, "c1": "a", "c3": "n"},
                    {"r": 4, "c2": 3, "c3": 0},
                    {"r": 5, "c1": "b"},
                    {"r": 6, "c2": 5},
                    {"r": 7, "c3": "p"},
                    {"r": 8, "c1": "b", "c2": 1, "c3": "q"}

                ])
                    .groupToArrays(
                        p.bucketGroup("rBucket", p.col("r"), [2, 4]),
                        p.count("numRows")
                    )
            )
                .then(function (response) {
                    const output = getResults(response);
                    should(output[0]['rBucket']['value'].length).equal(3);
                    done();
                })
                .catch(done);
        });
        it('group-bucket-2', function (done) {
            execPlan(
                p.fromLiterals([

                    {"r": 1, "c1": "a", "c2": 1, "c3": "m"},
                    {"r": 2, "c1": "b", "c2": 1},
                    {"r": 3, "c1": "a", "c3": "n"},
                    {"r": 4, "c2": 3, "c3": 0},
                    {"r": 5, "c1": "b"},
                    {"r": 6, "c2": 5},
                    {"r": 7, "c3": "p"},
                    {"r": 8, "c1": "b", "c2": 1, "c3": "q"}

                ])
                    .groupToArrays(
                        p.bucketGroup("rBucket", p.col("r"), [0, 7]),
                        p.count("numRows")
                    )
            )
                .then(function (response) {
                    const output = getResults(response);
                    should(output[0]['rBucket']['value'].length).equal(2);
                    done();
                })
                .catch(done);
        });
    });

    describe('sample by', function() {
    it('sample by limit 2 number', function(done) {
      execPlan(
        p.fromView('opticUnitTest', 'musician', null, p.fragmentIdCol('musicianDocId'))
          .sampleBy({limit:2})
          )
        .then(function(response) {
          const output = getResults(response);
          should(output.length).equal(2);
          done();
        })
      .catch(done);
    });
    it('sample by no arguments', function(done) {
       execPlan(
        p.fromView('opticUnitTest', 'musician', null, p.fragmentIdCol('musicianDocId'))
          .sampleBy({})
          )
        .then(function(response) {
          const output = getResults(response);
          should(output.length).equal(4);
          done();
        })
      .catch(done);
    });
  });
  describe('join content', function() {
    it('with fragment id', function(done) {
      execPlan(
        p.fromView('opticUnitTest', 'musician', null, p.fragmentIdCol('musicianDocId'))
          .orderBy(p.desc('lastName'))
          .limit(2)
          .joinDoc('musicianDoc', p.fragmentIdCol('musicianDocId'))
          .orderBy(p.desc('lastName'))
          .select(null, '')
          )
        .then(function(response) {
          const output = getResults(response);
          should(output.length).equal(2);
          should(output[0].lastName.value).equal('Davis');
          should(output[0].firstName.value).equal('Miles');
          should(output[0].musicianDoc.value.musician.instrument.length).equal(1);
          should(output[0].musicianDoc.value.musician.instrument[0]).equal('trumpet');
          should(output[1].lastName.value).equal('Coltrane');
          should(output[1].firstName.value).equal('John');
          should(output[1].musicianDoc.value.musician.instrument.length).equal(1);
          should(output[1].musicianDoc.value.musician.instrument[0]).equal('saxophone');
          done();
        })
      .catch(done);
    });
    it('with xpath', function(done) {
      execPlan(
        p.fromView('opticUnitTest', 'musician', null, p.fragmentIdCol('musicianDocId'))
          .orderBy(p.desc('lastName'))
          .limit(2)
          .joinDoc('musicianDoc', p.fragmentIdCol('musicianDocId'))
          .orderBy(p.desc('lastName'))
          .select(['lastName', 'firstName', p.as('nodes', p.xpath('musicianDoc', '/musician/(dob|instrument)'))], '')
          )
        .then(function(response) {
          const output = getResults(response);
          should(output.length).equal(2);
          should(output[0].lastName.value).equal('Davis');
          should(output[0].firstName.value).equal('Miles');
          should(output[0].nodes.value.length).equal(2);
          should(output[0].nodes.value[0]).equal('1926-05-26');
          should(output[0].nodes.value[1]).equal('trumpet');
          should(output[1].lastName.value).equal('Coltrane');
          should(output[1].firstName.value).equal('John');
          should(output[1].nodes.value.length).equal(2);
          should(output[1].nodes.value[0]).equal('1926-09-23');
          should(output[1].nodes.value[1]).equal('saxophone');
          done();
        })
      .catch(done);
    });
    it('with collections', function(done) {
      execPlan(
        p.fromView('opticUnitTest', 'musician', null, p.fragmentIdCol('musicianDocId'))
          .orderBy(p.desc('lastName'))
          .limit(2)
          .joinDoc('musicianDoc', p.fragmentIdCol('musicianDocId'))
          .orderBy(p.desc('lastName'))
          .select(['lastName', 'firstName', p.as('tag', p.xdmp.nodeCollections(p.col('musicianDoc')))], '')
          )
        .then(function(response) {
          const output = getResults(response);
          should(output.length).equal(2);
          should(output[0].lastName.value).equal('Davis');
          should(output[0].firstName.value).equal('Miles');
          should(output[0].tag.value).containEql('/optic/test');
          should(output[0].tag.value).containEql('/optic/music');
          should(output[1].lastName.value).equal('Coltrane');
          should(output[1].firstName.value).equal('John');
          should(output[1].tag.value).containEql('/optic/test');
          should(output[1].tag.value).containEql('/optic/music');
          done();
        })
      .catch(done);
    });
    it('with document uri', function(done) {
      execPlan(
        p.fromLiterals([
              {id:1, val: 2, musicianDocUri:'/optic/test/musician4.json'},
              {id:2, val: 4, musicianDocUri:'/optic/test/not/a/real/doc.nada'},
              {id:3, val: 6, musicianDocUri:'/optic/test/musician3.json'}
          ])
          .joinDoc('musicianDoc', p.col('musicianDocUri'))
          .orderBy('id')
          )
        .then(function(response) {
          const output = getResults(response);
          should(output.length).equal(2);
          should(output[0].id.value).equal(1);
          should(output[0].val.value).equal(2);
          should(output[0].musicianDocUri.value).equal('/optic/test/musician4.json');
          should(output[0].musicianDoc.value.musician.lastName).equal('Davis');
          should(output[0].musicianDoc.value.musician.firstName).equal('Miles');
          should(output[1].id.value).equal(3);
          should(output[1].val.value).equal(6);
          should(output[1].musicianDocUri.value).equal('/optic/test/musician3.json');
          should(output[1].musicianDoc.value.musician.lastName).equal('Coltrane');
          should(output[1].musicianDoc.value.musician.firstName).equal('John');
          done();
        })
      .catch(done);
    });
  });
});
