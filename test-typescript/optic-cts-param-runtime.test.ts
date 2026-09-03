/*
 * Copyright (c) 2015-2026 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
 */

/// <reference path="../marklogic.d.ts" />

/**
 * Runtime smoke tests for cts.param support in Optic plan builder (MLE-27883).
 *
 * These tests verify that:
 * - op.cts.param() constructs correctly with ns:"cts" (not ns:"op")
 * - cts.param() can be passed to all value-accepting CTS query functions
 * - Plan export serializes cts.param with the correct JSON shape
 *
 * No MarkLogic server connection required — tests only verify plan construction
 * and serialization (plan.export()).
 *
 * Run with: npm run test:compile && npx mocha test-typescript/*.js
 */

import should = require('should');
const marklogic = require('../lib/marklogic.js');

const op = marklogic.planBuilder;

// Helper: extract the cts.param node from a serialized plan arg
function findCtsParam(obj: any): any {
  if (obj && typeof obj === 'object') {
    if (obj.ns === 'cts' && obj.fn === 'param') return obj;
    for (const key of Object.keys(obj)) {
      const found = findCtsParam(obj[key]);
      if (found) return found;
    }
  }
  if (Array.isArray(obj)) {
    for (const item of obj) {
      const found = findCtsParam(item);
      if (found) return found;
    }
  }
  return null;
}

describe('cts.param Optic plan builder smoke tests (MLE-27883)', function() {

  // ── cts.param construction ──────────────────────────────────────────────────

  describe('op.cts.param()', function() {

    it('returns an object (not null/undefined)', function() {
      const p = op.cts.param('myParam');
      should(p).not.be.null();
      should(p).not.be.undefined();
    });

    it('serializes with ns:"cts"', function() {
      const plan = op.fromView('s', 'v')
        .where(op.cts.collectionQuery(op.cts.param('col')));
      const exported = plan.export();
      const paramNode = findCtsParam(exported);
      should.exist(paramNode, 'expected a cts.param node in the exported plan');
      paramNode.ns.should.equal('cts');
    });

    it('serializes with fn:"param"', function() {
      const plan = op.fromView('s', 'v')
        .where(op.cts.collectionQuery(op.cts.param('col')));
      const exported = plan.export();
      const paramNode = findCtsParam(exported);
      paramNode.fn.should.equal('param');
    });

    it('serializes the name as the sole arg', function() {
      const plan = op.fromView('s', 'v')
        .where(op.cts.collectionQuery(op.cts.param('myCollection')));
      const exported = plan.export();
      const paramNode = findCtsParam(exported);
      paramNode.args.should.be.an.Array().and.have.length(1);
      paramNode.args[0].should.equal('myCollection');
    });

    it('is distinct from op.param (ns must be "cts" not "op")', function() {
      const plan = op.fromView('s', 'v')
        .where(op.cts.collectionQuery(op.cts.param('col')));
      const exported = plan.export();
      const paramNode = findCtsParam(exported);
      paramNode.ns.should.not.equal('op');
    });

  });

  // ── Negative: op.param() must be rejected by cts query functions ─────────────

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

  // ── collectionQuery ─────────────────────────────────────────────────────────

  describe('cts.collectionQuery with cts.param', function() {

    it('accepts cts.param as uris argument without throwing', function() {
      should.doesNotThrow(() => {
        op.fromView('s', 'v').where(op.cts.collectionQuery(op.cts.param('col')));
      });
    });

    it('serializes collectionQuery with nested cts.param', function() {
      const plan = op.fromView('s', 'v')
        .where(op.cts.collectionQuery(op.cts.param('col')));
      const exported = plan.export();
      const str = JSON.stringify(exported);
      should(str).containEql('"collection-query"');
      should(str).containEql('"param"');
    });

  });

  // ── directoryQuery ──────────────────────────────────────────────────────────

  describe('cts.directoryQuery with cts.param', function() {

    it('accepts cts.param as uris argument without throwing', function() {
      should.doesNotThrow(() => {
        op.fromView('s', 'v').where(op.cts.directoryQuery(op.cts.param('dir')));
      });
    });

  });

  // ── documentQuery ───────────────────────────────────────────────────────────

  describe('cts.documentQuery with cts.param', function() {

    it('accepts cts.param as uris argument without throwing', function() {
      should.doesNotThrow(() => {
        op.fromView('s', 'v').where(op.cts.documentQuery(op.cts.param('uri')));
      });
    });

  });

  // ── wordQuery ───────────────────────────────────────────────────────────────

  describe('cts.wordQuery with cts.param', function() {

    it('accepts cts.param as text argument without throwing', function() {
      should.doesNotThrow(() => {
        op.fromView('s', 'v').where(op.cts.wordQuery(op.cts.param('word')));
      });
    });

    it('serializes wordQuery with nested cts.param', function() {
      const plan = op.fromView('s', 'v')
        .where(op.cts.wordQuery(op.cts.param('word')));
      const exported = plan.export();
      const str = JSON.stringify(exported);
      should(str).containEql('"word-query"');
      should(str).containEql('"param"');
    });

  });

  // ── elementWordQuery ────────────────────────────────────────────────────────

  describe('cts.elementWordQuery with cts.param', function() {

    it('accepts cts.param as text argument without throwing', function() {
      should.doesNotThrow(() => {
        op.fromView('s', 'v').where(
          op.cts.elementWordQuery(op.xs.QName('title'), op.cts.param('word'))
        );
      });
    });

  });

  // ── elementAttributeWordQuery ───────────────────────────────────────────────

  describe('cts.elementAttributeWordQuery with cts.param', function() {

    it('accepts cts.param as text argument without throwing', function() {
      should.doesNotThrow(() => {
        op.fromView('s', 'v').where(
          op.cts.elementAttributeWordQuery(
            op.xs.QName('elem'), op.xs.QName('attr'), op.cts.param('word')
          )
        );
      });
    });

  });

  // ── elementValueQuery ───────────────────────────────────────────────────────

  describe('cts.elementValueQuery with cts.param', function() {

    it('accepts cts.param as text argument without throwing', function() {
      should.doesNotThrow(() => {
        op.fromView('s', 'v').where(
          op.cts.elementValueQuery(op.xs.QName('title'), op.cts.param('val'))
        );
      });
    });

  });

  // ── elementRangeQuery ───────────────────────────────────────────────────────

  describe('cts.elementRangeQuery with cts.param', function() {

    it('accepts cts.param as value argument without throwing', function() {
      should.doesNotThrow(() => {
        op.fromView('s', 'v').where(
          op.cts.elementRangeQuery(op.xs.QName('age'), '=', op.cts.param('ageVal'))
        );
      });
    });

  });

  // ── elementAttributeRangeQuery ──────────────────────────────────────────────

  describe('cts.elementAttributeRangeQuery with cts.param', function() {

    it('accepts cts.param as value argument without throwing', function() {
      should.doesNotThrow(() => {
        op.fromView('s', 'v').where(
          op.cts.elementAttributeRangeQuery(
            op.xs.QName('elem'), op.xs.QName('attr'), '=', op.cts.param('val')
          )
        );
      });
    });

  });

  // ── elementAttributeValueQuery ──────────────────────────────────────────────

  describe('cts.elementAttributeValueQuery with cts.param', function() {

    it('accepts cts.param as text argument without throwing', function() {
      should.doesNotThrow(() => {
        op.fromView('s', 'v').where(
          op.cts.elementAttributeValueQuery(
            op.xs.QName('elem'), op.xs.QName('attr'), op.cts.param('text')
          )
        );
      });
    });

  });

  // ── fieldRangeQuery ─────────────────────────────────────────────────────────

  describe('cts.fieldRangeQuery with cts.param', function() {

    it('accepts cts.param as value argument without throwing', function() {
      should.doesNotThrow(() => {
        op.fromView('s', 'v').where(
          op.cts.fieldRangeQuery(op.cts.param('fieldName'), '=', op.cts.param('val'))
        );
      });
    });

  });

  // ── fieldValueQuery ─────────────────────────────────────────────────────────

  describe('cts.fieldValueQuery with cts.param', function() {

    it('accepts cts.param as field-name and text arguments without throwing', function() {
      should.doesNotThrow(() => {
        op.fromView('s', 'v').where(
          op.cts.fieldValueQuery(op.cts.param('fieldName'), op.cts.param('text'))
        );
      });
    });

  });

  // ── fieldWordQuery ──────────────────────────────────────────────────────────

  describe('cts.fieldWordQuery with cts.param', function() {

    it('accepts cts.param as field-name and text arguments without throwing', function() {
      should.doesNotThrow(() => {
        op.fromView('s', 'v').where(
          op.cts.fieldWordQuery(op.cts.param('fieldName'), op.cts.param('word'))
        );
      });
    });

  });

  // ── jsonPropertyRangeQuery ──────────────────────────────────────────────────

  describe('cts.jsonPropertyRangeQuery with cts.param', function() {

    it('accepts cts.param as property-name and value arguments without throwing', function() {
      should.doesNotThrow(() => {
        op.fromView('s', 'v').where(
          op.cts.jsonPropertyRangeQuery(op.cts.param('prop'), '=', op.cts.param('val'))
        );
      });
    });

  });

  // ── jsonPropertyValueQuery ──────────────────────────────────────────────────

  describe('cts.jsonPropertyValueQuery with cts.param', function() {

    it('accepts cts.param as property-name and value arguments without throwing', function() {
      should.doesNotThrow(() => {
        op.fromView('s', 'v').where(
          op.cts.jsonPropertyValueQuery(op.cts.param('prop'), op.cts.param('val'))
        );
      });
    });

    it('serializes jsonPropertyValueQuery with nested cts.param', function() {
      const plan = op.fromView('s', 'v')
        .where(op.cts.jsonPropertyValueQuery(op.cts.param('prop'), op.cts.param('val')));
      const exported = plan.export();
      const str = JSON.stringify(exported);
      should(str).containEql('"json-property-value-query"');
      should(str).containEql('"param"');
      should(str).containEql('"cts"');
    });

  });

  // ── jsonPropertyWordQuery ───────────────────────────────────────────────────

  describe('cts.jsonPropertyWordQuery with cts.param', function() {

    it('accepts cts.param as property-name and text arguments without throwing', function() {
      should.doesNotThrow(() => {
        op.fromView('s', 'v').where(
          op.cts.jsonPropertyWordQuery(op.cts.param('prop'), op.cts.param('word'))
        );
      });
    });

  });

  // ── pathRangeQuery ──────────────────────────────────────────────────────────

  describe('cts.pathRangeQuery with cts.param', function() {

    it('accepts cts.param as path-name and value arguments without throwing', function() {
      should.doesNotThrow(() => {
        op.fromView('s', 'v').where(
          op.cts.pathRangeQuery(op.cts.param('path'), '=', op.cts.param('val'))
        );
      });
    });

  });

  // ── rangeQuery ──────────────────────────────────────────────────────────────

  describe('cts.rangeQuery with cts.param', function() {

    it('accepts cts.param as value argument without throwing', function() {
      should.doesNotThrow(() => {
        op.fromView('s', 'v').where(
          op.cts.rangeQuery(
            op.cts.jsonPropertyReference('salary'),
            '=',
            op.cts.param('salaryVal')
          )
        );
      });
    });

  });

  // ── columnRangeQuery ────────────────────────────────────────────────────────

  describe('cts.columnRangeQuery with cts.param', function() {

    it('accepts cts.param as value argument without throwing', function() {
      should.doesNotThrow(() => {
        op.fromView('s', 'v').where(
          op.cts.columnRangeQuery('main', 'employees', 'Position', op.cts.param('posVal'))
        );
      });
    });

  });

});
