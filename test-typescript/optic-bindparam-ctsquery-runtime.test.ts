/*
 * Copyright (c) 2015-2026 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
 */

/// <reference path="../marklogic.d.ts" />

/**
 * Runtime smoke tests for MLE-29889.
 *
 * Covers plan-construction and export-shape cases from the test plan (cases 0a–10).
 * No MarkLogic server connection required — all tests call plan.export() only.
 *
 * Run with: npm run test:compile && npx mocha test-typescript/optic-bindparam-ctsquery-runtime.test.js
 */

import should = require('should');
const marklogic = require('../lib/marklogic.js');

const op = marklogic.planBuilder;

// Recursively find a node with the given ns and fn anywhere in an exported plan tree.
function findNode(obj: any, ns: string, fn: string): any {
  if (obj === null || typeof obj !== 'object') { return null; }
  if (Array.isArray(obj)) {
    for (const item of obj) {
      const found = findNode(item, ns, fn);
      if (found) { return found; }
    }
    return null;
  }
  if (obj.ns === ns && obj.fn === fn) { return obj; }
  for (const key of Object.keys(obj)) {
    const found = findNode(obj[key], ns, fn);
    if (found) { return found; }
  }
  return null;
}

describe('MLE-29889 smoke tests — bindParam/fromSearchDocs/fromSearch/where/composite-CTS (no server)', function() {

  // ─── cts.param() as direct sub-query of composite CTS functions ───────

  describe('cts.param() valid as direct sub-query of composite CTS functions', function() {

    it('op.cts.orQuery([wordQuery, cts.param()]) does not throw', function() {
      should.doesNotThrow(() => {
        op.cts.orQuery([op.cts.wordQuery('dog'), op.cts.param('q')]);
      });
    });

    it('exported plan contains {ns:"cts", fn:"param", args:["q"]} nested inside or-query', function() {
      const plan = op.fromView('s', 'v').where(
        op.cts.orQuery([op.cts.wordQuery('dog'), op.cts.param('q')])
      );
      const exported = plan.export();
      const paramNode = findNode(exported, 'cts', 'param');
      should.exist(paramNode, 'expected a cts.param node in the exported plan');
      paramNode.ns.should.equal('cts');
      paramNode.fn.should.equal('param');
      paramNode.args[0].should.equal('q');
    });

    it('op.cts.andQuery([collectionQuery, cts.param()]) does not throw', function() {
      should.doesNotThrow(() => {
        op.cts.andQuery([op.cts.collectionQuery('/c'), op.cts.param('q')]);
      });
    });

  });

  // ─── Plan#bindParam accepts CtsQuery ─────────────────────────────────

  describe('Plan#bindParam accepts CtsQuery as literal', function() {

    it('bindParam("q", op.cts.wordQuery("cat")) does not throw', function() {
      should.doesNotThrow(() => {
        op.fromView('s', 'v').bindParam('q', op.cts.wordQuery('cat'));
      });
    });

    it('exported bind-param has {ns:"cts", fn:"word-query", args:["cat"]} as literal arg', function() {
      const plan = op.fromView('s', 'v').bindParam('q', op.cts.wordQuery('cat'));
      const exported = plan.export();
      const bindNode = findNode(exported, 'op', 'bind-param');
      should.exist(bindNode, 'expected bind-param node in exported plan');
      const lit = bindNode.args[1];
      lit.ns.should.equal('cts');
      lit.fn.should.equal('word-query');
      lit.args[0].should.equal('cat');
    });

    it('nested andQuery([wordQuery("a"), wordQuery("b")]) as bindParam literal exports correctly', function() {
      const plan = op.fromView('s', 'v').bindParam('q',
        op.cts.andQuery([op.cts.wordQuery('a'), op.cts.wordQuery('b')])
      );
      const exported = plan.export();
      const bindNode = findNode(exported, 'op', 'bind-param');
      should.exist(bindNode, 'expected bind-param node in exported plan');
      const lit = bindNode.args[1];
      lit.ns.should.equal('cts');
      lit.fn.should.equal('and-query');
      // and-query wraps its sub-queries in an outer array; args[0] is that array
      lit.args[0].should.be.an.Array().and.have.length(2);
    });

    it('bindParam("q", op.cts.param("placeholder")) does not throw', function() {
      should.doesNotThrow(() => {
        op.fromView('s', 'v').bindParam('q', op.cts.param('placeholder'));
      });
    });

    it('negative: bindParam with plain object {invalid:true} still throws', function() {
      should.throws(() => {
        op.fromView('s', 'v').bindParam('q', { invalid: true });
      });
    });

    it('negative: bindParam with op.param("x") (PlanParam — a plan placeholder, not a value) still throws', function() {
      // op.param() is a plan-level op placeholder, not a concrete value.
      // It is distinct from op.cts.param() (a CTS-tree placeholder) which case 4 accepts.
      should.throws(() => {
        op.fromView('s', 'v').bindParam('q', op.param('x'));
      });
    });

  });

  // ─── fromSearchDocs / fromSearch / where accept op.param() ──────

  describe('op.param() accepted by fromSearchDocs, fromSearch, where', function() {

    it('op.fromSearchDocs(op.param("inputQuery")) does not throw', function() {
      should.doesNotThrow(() => {
        op.fromSearchDocs(op.param('inputQuery'));
      });
    });

    it('op.fromSearch(op.param("inputQuery")) does not throw', function() {
      should.doesNotThrow(() => {
        op.fromSearch(op.param('inputQuery'));
      });
    });

    it('.where(op.param("whereQuery")) does not throw', function() {
      should.doesNotThrow(() => {
        op.fromView('s', 'v').where(op.param('whereQuery'));
      });
    });

    it('fromSearchDocs(op.param("q")) exports {ns:"op", fn:"param", args:["q"]} at query arg', function() {
      const plan = op.fromSearchDocs(op.param('q')).select(['uri', 'doc']);
      const exported = plan.export();
      const fsNode = findNode(exported, 'op', 'from-search-docs');
      should.exist(fsNode, 'expected from-search-docs node in exported plan');
      const queryArg = fsNode.args[0];
      queryArg.ns.should.equal('op');
      queryArg.fn.should.equal('param');
      queryArg.args[0].should.equal('q');
    });

  });

  // ─── fromSearchDocs / fromSearch / where accept op.cts.param() ───────

  describe('op.cts.param() accepted by fromSearchDocs, fromSearch, where', function() {

    it('op.fromSearchDocs(op.cts.param("inputQuery")) does not throw', function() {
      should.doesNotThrow(() => {
        op.fromSearchDocs(op.cts.param('inputQuery'));
      });
    });

    it('op.fromSearch(op.cts.param("inputQuery")) does not throw', function() {
      should.doesNotThrow(() => {
        op.fromSearch(op.cts.param('inputQuery'));
      });
    });

    it('.where(op.cts.param("whereQuery")) does not throw', function() {
      should.doesNotThrow(() => {
        op.fromView('s', 'v').where(op.cts.param('whereQuery'));
      });
    });

    it('fromSearchDocs(op.cts.param("q")) exports {ns:"cts", fn:"param", args:["q"]} at query arg', function() {
      const plan = op.fromSearchDocs(op.cts.param('q')).select(['uri', 'doc']);
      const exported = plan.export();
      const fsNode = findNode(exported, 'op', 'from-search-docs');
      should.exist(fsNode, 'expected from-search-docs node in exported plan');
      const queryArg = fsNode.args[0];
      queryArg.ns.should.equal('cts');
      queryArg.fn.should.equal('param');
      queryArg.args[0].should.equal('q');
    });

    it('fromSearch(op.cts.param("q")) exports {ns:"cts", fn:"param", args:["q"]} at query arg', function() {
      const plan = op.fromSearch(op.cts.param('q'));
      const exported = plan.export();
      const fsNode = findNode(exported, 'op', 'from-search');
      should.exist(fsNode, 'expected from-search node in exported plan');
      const queryArg = fsNode.args[0];
      queryArg.ns.should.equal('cts');
      queryArg.fn.should.equal('param');
      queryArg.args[0].should.equal('q');
    });

    it('.where(op.cts.param("q")) exports {ns:"cts", fn:"param", args:["q"]} in where clause', function() {
      const plan = op.fromView('s', 'v').where(op.cts.param('q'));
      const exported = plan.export();
      const whereNode = findNode(exported, 'op', 'where');
      should.exist(whereNode, 'expected where node in exported plan');
      const queryArg = whereNode.args[0];
      queryArg.ns.should.equal('cts');
      queryArg.fn.should.equal('param');
      queryArg.args[0].should.equal('q');
    });

  });

});
