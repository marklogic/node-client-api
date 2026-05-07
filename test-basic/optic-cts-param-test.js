/*
 * Copyright (c) 2015-2026 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
 */

/**
 * Integration test for cts.param support in Optic plan builder (MLE-27883).
 * 
 * This test requires a running MarkLogic server with:
 * - Documents in the /optic/test collection
 * - TDE views under the opticUnitTest schema, including master and musician
 * - Connection configured via testconfig or environment
 * 
 * Run with: npx mocha test-basic/optic-cts-param-test.js
 */

const should = require('should');
const valcheck = require('core-util-is');

const testconfig = require('../etc/test-config.js');
const marklogic = require('../');

// Allow overriding connection info via environment or direct config
const connInfo = {
  host: process.env.ML_TEST_HOST || testconfig.testHost || 'localhost',
  port: process.env.ML_TEST_PORT || 8000,
  database: process.env.ML_TEST_DATABASE || 'Documents',
  authType: process.env.ML_TEST_AUTH_TYPE || 'digest',
  user: process.env.ML_TEST_USER || testconfig.restWriterConnection.user,
  password: process.env.ML_TEST_PASSWORD || testconfig.restWriterConnection.password,
};

const db = marklogic.createDatabaseClient(connInfo);
const op = marklogic.planBuilder;

describe('cts.param integration tests (MLE-27883)', function() {
  this.timeout(10000); // Allow 10 seconds for server queries

  // ──────────────────────────────────────────────────────────────────────────────
  // Test: collectionQuery with cts.param binding
  // ──────────────────────────────────────────────────────────────────────────────

  describe('op.cts.collectionQuery with cts.param', function() {

    it('should build a plan that compiles', function() {
      const plan = op
        .fromView('opticUnitTest', 'master')
        .where(op.cts.collectionQuery(op.cts.param('collection')))
        .select(['id', 'name']);
      
      should.exist(plan, 'plan should exist');
      should.exist(plan.export, 'plan should have export method');
      
      const exported = plan.export();
      should.exist(exported, 'exported plan should exist');
      valcheck.isObject(exported).should.equal(true);
      Object.keys(exported).length.should.be.greaterThan(0);
    });

    it('should serialize cts.param with ns:"cts" in the plan', function() {
      const plan = op
        .fromView('opticUnitTest', 'master')
        .where(op.cts.collectionQuery(op.cts.param('collection')))
        .select(['id', 'name']);
      
      const exported = plan.export();
      const serialized = JSON.stringify(exported);
      
      // Verify cts.param is present with correct namespace
      should(serialized).containEql('"param"');
      should(serialized).containEql('"cts"');
      should(serialized).not.containEql('collection-query.*"ns":"op"');
    });

    it('should execute query with collection parameter binding', function() {
      const plan = op
        .fromView('opticUnitTest', 'master')
        .where(op.cts.collectionQuery(op.cts.param('collection')))
        .select(['id', 'name', 'date']);
      
      return db.rows.query(plan, {
        bindings: {
          collection: { value: '/optic/test', type: 'string' }
        }
      })
      .then(function(response) {
        should.exist(response, 'response should exist');
        valcheck.isObject(response).should.equal(true);
        response.should.have.property('columns');
        response.should.have.property('rows');
        
        // Verify structure
        const columns = response.columns;
        should.exist(columns, 'response should have columns');
        valcheck.isArray(columns).should.equal(true);
        columns.length.should.be.above(0);
        
        // Verify data was returned
        const rows = response.rows;
        should.exist(rows, 'response should have rows');
        rows.length.should.be.above(0);
      });
    });

    it('should support multiple cts.param bindings in a single plan', function() {
      const plan = op
        .fromView('opticUnitTest', 'musician')
        .where(
          op.cts.andQuery([
            op.cts.collectionQuery(op.cts.param('collection')),
            op.cts.jsonPropertyWordQuery(op.cts.param('propertyName'), op.cts.param('keyword'))
          ])
        )
        .select(['lastName', 'firstName']);
      
      const exported = plan.export();
      const serialized = JSON.stringify(exported);
      
      // Should contain at least 2 cts.param references
      const paramMatches = serialized.match(/"fn":"param"/g);
      should.exist(paramMatches, 'should have param function references');
      paramMatches.length.should.be.greaterThanOrEqual(2);
    });

  });

  // ──────────────────────────────────────────────────────────────────────────────
  // Test: Other cts.param combinations
  // ──────────────────────────────────────────────────────────────────────────────

  describe('other cts functions with cts.param', function() {

    it('should support jsonPropertyWordQuery with cts.param text binding', function() {
      const plan = op
        .fromView('opticUnitTest', 'musician')
        .where(op.cts.jsonPropertyWordQuery('instrument', op.cts.param('searchTerm')))
        .select(['lastName', 'firstName']);
      
      const exported = plan.export();
      should.exist(exported);
      
      const serialized = JSON.stringify(exported);
      should(serialized).containEql('"json-property-word-query"');
      should(serialized).containEql('"param"');
    });

    it('should support jsonPropertyValueQuery with cts.param bindings', function() {
      const plan = op
        .fromView('opticUnitTest', 'musician')
        .where(
          op.cts.jsonPropertyValueQuery(
            op.cts.param('propertyName'),
            op.cts.param('propertyValue')
          )
        )
        .select(['lastName', 'firstName']);
      
      const exported = plan.export();
      should.exist(exported);
      
      const serialized = JSON.stringify(exported);
      should(serialized).containEql('"json-property-value-query"');
      should(serialized).containEql('"param"');
    });

    it('should support collectionQuery with cts.param on master view', function() {
      const plan = op
        .fromView('opticUnitTest', 'master')
        .where(op.cts.collectionQuery(op.cts.param('col')))
        .select(['id', 'name', 'date'])
        .orderBy('id');
      
      const exported = plan.export();
      should.exist(exported);
      
      const serialized = JSON.stringify(exported);
      should(serialized).containEql('"collection-query"');
      should(serialized).containEql('"param"');
    });

  });

  // ──────────────────────────────────────────────────────────────────────────────
  // Test: Negative cases — op.param() must NOT be accepted by cts query functions
  // ──────────────────────────────────────────────────────────────────────────────

  describe('negative: op.param() rejected by cts query functions', function() {

    it('should throw when passing op.param() to collectionQuery', function() {
      should.throws(() => {
        op.cts.collectionQuery(op.param('myParam'));
      }, /cts\.collectionQuery/);
    });

    it('should throw when passing op.param() to wordQuery', function() {
      should.throws(() => {
        op.cts.wordQuery(op.param('myParam'));
      }, /cts\.wordQuery/);
    });

    it('should throw when passing op.param() as text to jsonPropertyWordQuery', function() {
      should.throws(() => {
        op.cts.jsonPropertyWordQuery('instrument', op.param('myParam'));
      }, /cts\.jsonPropertyWordQuery/);
    });

  });

  // ──────────────────────────────────────────────────────────────────────────────
  // Test: Parameter distinctness (cts.param vs op.param)
  // ──────────────────────────────────────────────────────────────────────────────

  describe('cts.param namespace distinctness', function() {

    it('should use ns:"cts" not ns:"op" for cts.param', function() {
      const plan = op
        .fromView('opticUnitTest', 'master')
        .where(op.cts.collectionQuery(op.cts.param('collection')))
        .select(['id', 'name']);
      
      const exported = plan.export();
      const serialized = JSON.stringify(exported);
      
      // Find the param node and verify namespace
      const lines = serialized.split('\n');
      let foundCtsParam = false;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('"fn":"param"')) {
          // Check preceding and following lines for ns
          const contextStart = Math.max(0, i - 5);
          const contextEnd = Math.min(lines.length, i + 5);
          const context = lines.slice(contextStart, contextEnd).join('\n');
          
          if (context.includes('"ns":"cts"')) {
            foundCtsParam = true;
            // Ensure it's not op.param
            should(context).not.containEql('"ns":"op".*"fn":"param"');
            break;
          }
        }
      }
      
      should(foundCtsParam).equal(true, 'should find cts.param with ns:"cts"');
    });

  });

});
