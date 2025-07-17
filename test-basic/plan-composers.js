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

describe('composers', function() {
  describe('for literals', function() {
    it('with inner join', function(done) {
      execPlan(
          p.fromLiterals([
              {masterId:1, masterVal:'A'},
              {masterId:2, masterVal:'B'},
              {masterId:3, masterVal:'C'}
              ])
            .joinInner(
              p.fromLiterals([
                {detailId:1, masterId:1, detailVal:'a'},
                {detailId:2, masterId:1, detailVal:'b'},
                {detailId:3, masterId:3, detailVal:'c'},
                {detailId:4, masterId:4, detailVal:'d'}
                ])
              )
            .orderBy(['masterId', 'detailId'])
          )
        .then(function(response) {
          const output = getResults(response);
          should(output.length).equal(3);
          should(output[0].masterId.value).equal(1);
          should(output[0].masterVal.value).equal('A');
          should(output[0].detailId.value).equal(1);
          should(output[0].detailVal.value).equal('a');
          should(output[1].masterId.value).equal(1);
          should(output[1].masterVal.value).equal('A');
          should(output[1].detailId.value).equal(2);
          should(output[1].detailVal.value).equal('b');
          should(output[2].masterId.value).equal(3);
          should(output[2].masterVal.value).equal('C');
          should(output[2].detailId.value).equal(3);
          should(output[2].detailVal.value).equal('c');
          done();
        })
      .catch(done);
    });
    it('with left join', function(done) {
      execPlan(
          p.fromLiterals([
              {masterId:1, masterVal:'A'},
              {masterId:2, masterVal:'B'},
              {masterId:3, masterVal:'C'}
              ])
            .joinLeftOuter(
              p.fromLiterals([
                {detailId:1, masterId:1, detailVal:'a'},
                {detailId:2, masterId:1, detailVal:'b'},
                {detailId:3, masterId:3, detailVal:'c'},
                {detailId:4, masterId:4, detailVal:'d'}
                ])
              )
            .orderBy(['masterId', 'detailId'])
      )
      .then(function(response) {
        const output = getResults(response);
          should(output.length).equal(4);
          should(output[0].masterId.value).equal(1);
          should(output[0].masterVal.value).equal('A');
          should(output[0].detailId.value).equal(1);
          should(output[0].detailVal.value).equal('a');
          should(output[1].masterId.value).equal(1);
          should(output[1].masterVal.value).equal('A');
          should(output[1].detailId.value).equal(2);
          should(output[1].detailVal.value).equal('b');
          should(output[2].masterId.value).equal(2);
          should(output[2].masterVal.value).equal('B');
          should(output[2].detailId.value).equal(null);
          should(output[2].detailVal.value).equal(null);
          should(output[3].masterId.value).equal(3);
          should(output[3].masterVal.value).equal('C');
          should(output[3].detailId.value).equal(3);
          should(output[3].detailVal.value).equal('c');
          done();
        })
      .catch(done);
    });
    it('with exists join', function(done) {
      execPlan(
          p.fromLiterals([
              {masterId:1, masterVal:'A'},
              {masterId:2, masterVal:'B'},
              {masterId:3, masterVal:'C'}
              ])
            .existsJoin(
              p.fromLiterals([
                {detailId:1, masterId:1, detailVal:'a'},
                {detailId:2, masterId:1, detailVal:'b'},
                {detailId:3, masterId:3, detailVal:'c'},
                {detailId:4, masterId:4, detailVal:'d'}
                ])
              )
            .orderBy('masterId')
      )
      .then(function(response) {
        const output = getResults(response);
          should(output.length).equal(2);
          should(output[0].masterId.value).equal(1);
          should(output[0].masterVal.value).equal('A');
          should.not.exist(output[0].detailId);
          should.not.exist(output[0].detailVal);
          should(output[1].masterId.value).equal(3);
          should(output[1].masterVal.value).equal('C');
          should.not.exist(output[1].detailId);
          should.not.exist(output[1].detailVal);
          done();
        })
      .catch(done);
    });
    it('with not exists join', function(done) {
      execPlan(
          p.fromLiterals([
              {masterId:1, masterVal:'A'},
              {masterId:2, masterVal:'B'},
              {masterId:3, masterVal:'C'}
              ])
            .notExistsJoin(
              p.fromLiterals([
                {detailId:1, masterIdRef:1, detailVal:'a'},
                {detailId:2, masterIdRef:1, detailVal:'b'},
                {detailId:3, masterIdRef:3, detailVal:'c'},
                {detailId:4, masterIdRef:4, detailVal:'d'}
                ]),
              p.on('masterId', 'masterIdRef')
              )
      )
      .then(function(response) {
        const output = getResults(response);
          should(output.length).equal(1);
          should(output[0].masterId.value).equal(2);
          should(output[0].masterVal.value).equal('B');
          should.not.exist(output[0].detailId);
          should.not.exist(output[0].detailVal);
          done();
        })
      .catch(done);
    });
    it('with key matches on inner join', function(done) {
      execPlan(
          p.fromLiterals([
              {primaryKey:1, masterVal:'A'},
              {primaryKey:2, masterVal:'B'},
              {primaryKey:3, masterVal:'C'}
              ])
            .joinInner(
              p.fromLiterals([
                {detailId:1, foreignKey:1, detailVal:'a'},
                {detailId:2, foreignKey:1, detailVal:'b'},
                {detailId:3, foreignKey:3, detailVal:'c'},
                {detailId:4, foreignKey:4, detailVal:'d'}
                ]),
                p.on('primaryKey', 'foreignKey')
              )
            .orderBy(['primaryKey', 'detailId'])
          )
        .then(function(response) {
          const output = getResults(response);
          should(output.length).equal(3);
          should(output[0].primaryKey.value).equal(1);
          should(output[0].foreignKey.value).equal(1);
          should(output[0].masterVal.value).equal('A');
          should(output[0].detailId.value).equal(1);
          should(output[0].detailVal.value).equal('a');
          should(output[1].primaryKey.value).equal(1);
          should(output[1].foreignKey.value).equal(1);
          should(output[1].masterVal.value).equal('A');
          should(output[1].detailId.value).equal(2);
          should(output[1].detailVal.value).equal('b');
          should(output[2].primaryKey.value).equal(3);
          should(output[2].foreignKey.value).equal(3);
          should(output[2].masterVal.value).equal('C');
          should(output[2].detailId.value).equal(3);
          should(output[2].detailVal.value).equal('c');
          done();
        })
      .catch(done);
    });
    it('with condition on left join', function(done) {
      execPlan(
          p.fromLiterals([
              {masterId:1, masterVal:'A'},
              {masterId:2, masterVal:'B'},
              {masterId:3, masterVal:'C'}
              ])
            .joinLeftOuter(
              p.fromLiterals([
                {detailId:1, masterId:1, detailVal:'a'},
                {detailId:2, masterId:1, detailVal:'b'},
                {detailId:3, masterId:3, detailVal:'c'},
                {detailId:4, masterId:4, detailVal:'d'}
                ]),
                null,
                p.eq(p.col('detailVal'), 'b')
              )
            .orderBy(['masterId', 'detailId'])
      )
      .then(function(response) {
        const output = getResults(response);
          should(output.length).equal(3);
          should(output[0].masterId.value).equal(1);
          should(output[0].masterVal.value).equal('A');
          should(output[0].detailId.value).equal(2);
          should(output[0].detailVal.value).equal('b');
          should(output[1].masterId.value).equal(2);
          should(output[1].masterVal.value).equal('B');
          should(output[1].detailId.value).equal(null);
          should(output[1].detailVal.value).equal(null);
          should(output[2].masterId.value).equal(3);
          should(output[2].masterVal.value).equal('C');
          should(output[2].detailId.value).equal(null);
          should(output[2].detailVal.value).equal(null);
          done();
        })
      .catch(done);
    });
    it('with cross product join', function(done) {
      execPlan(
          p.fromLiterals([
              {masterId:1, masterVal:'A'},
              {masterId:2, masterVal:'B'}
              ])
            .joinCrossProduct(
              p.fromLiterals([
                {detailId:1, detailVal:'a'},
                {detailId:2, detailVal:'b'}
                ])
              )
            .orderBy(['masterId', 'detailId'])
          )
        .then(function(response) {
          const output = getResults(response);
          should(output.length).equal(4);
          should(output[0].masterId.value).equal(1);
          should(output[0].masterVal.value).equal('A');
          should(output[0].detailId.value).equal(1);
          should(output[0].detailVal.value).equal('a');
          should(output[1].masterId.value).equal(1);
          should(output[1].masterVal.value).equal('A');
          should(output[1].detailId.value).equal(2);
          should(output[1].detailVal.value).equal('b');
          should(output[2].masterId.value).equal(2);
          should(output[2].masterVal.value).equal('B');
          should(output[2].detailId.value).equal(1);
          should(output[2].detailVal.value).equal('a');
          should(output[3].masterId.value).equal(2);
          should(output[3].masterVal.value).equal('B');
          should(output[3].detailId.value).equal(2);
          should(output[3].detailVal.value).equal('b');
          done();
        })
      .catch(done);
    });
    it('with union', function(done) {
      execPlan(
          p.fromLiterals([
              {id:1, val:'a'},
              {id:3, val:'c'}
              ])
            .union(
              p.fromLiterals([
                {id:2, val:'b'},
                {id:4, val:'d'}
                ])
              )
            .orderBy('id')
          )
      .then(function(response) {
        const output = getResults(response);
          should(output.length).equal(4);
          should(output[0].id.value).equal(1);
          should(output[0].val.value).equal('a');
          should(output[1].id.value).equal(2);
          should(output[1].val.value).equal('b');
          should(output[2].id.value).equal(3);
          should(output[2].val.value).equal('c');
          should(output[3].id.value).equal(4);
          should(output[3].val.value).equal('d');
          done();
        })
      .catch(done);
    });
    it('with intersect', function(done) {
      execPlan(
          p.fromLiterals([
              {val:'a', id:1},
              {val:'b', id:2},
              {val:'x', id:3}
              ])
            .intersect(
              p.fromLiterals([
                {id:1, val:'x'},
                {id:2, val:'b'},
                {id:3, val:'c'}
                ])
              )
            .orderBy('id')
          )
        .then(function(response) {
          const output = getResults(response);
          should(output.length).equal(1);
          should(output[0].id.value).equal(2);
          should(output[0].val.value).equal('b');
          done();
        })
      .catch(done);
    });
    it('with except', function(done) {
      execPlan(
          p.fromLiterals([
              {val:'a', id:1},
              {val:'b', id:2}
              ])
            .except(
              p.fromLiterals([
                {id:1, val:'a'},
                {id:2, val:'x'},
                {id:3, val:'c'}
                ])
              )
            .orderBy('id')
      )
      .then(function(response) {
        const output = getResults(response);
          should(output.length).equal(1);
          should(output[0].id.value).equal(2);
          should(output[0].val.value).equal('b');
          done();
        })
      .catch(done);
    });
  });
});
