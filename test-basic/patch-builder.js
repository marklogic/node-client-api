/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

var assert = require('assert');
var should = require('should');
var p = require('../lib/patch-builder.js');

describe('patch-builder', function() {
  it('should create an insert operation', function(){
    assert.deepEqual(
        p.insert('/the/context', 'last-child', 'the content'),
        {insert:{
          context:  '/the/context',
          position: 'last-child',
          content:  'the content'
          }}
        );
    assert.deepEqual(
        p.insert('/the/context', 'before', 'the content'),
        {insert:{
          context:  '/the/context',
          position: 'before',
          content:  'the content'
          }}
        );
    assert.deepEqual(
        p.insert('/the/context', 'after', 'the content'),
        {insert:{
          context:  '/the/context',
          position: 'after',
          content:  'the content'
          }}
        );
    assert.deepEqual(
        p.insert('/the/context', 'last-child', 'the content', '?'),
        {insert:{
          context:     '/the/context',
          position:    'last-child',
          content:     'the content',
          cardinality: '?'
          }}
        );
    assert.deepEqual(
        p.insert('/the/context', 'last-child', {key:'the value'}),
        {insert:{
          context:  '/the/context',
          position: 'last-child',
          content:  {key:'the value'}
          }}
        );
  });
  it('should create a replace operation', function(){
    assert.deepEqual(
        p.replace('/the/select', 'the content'),
        {replace:{
          select:  '/the/select',
          content: 'the content'
          }}
        );
    assert.deepEqual(
        p.replace('/the/select', 'the content', '?'),
        {replace:{
          select:      '/the/select',
          content:     'the content',
          cardinality: '?'
          }}
        );
    assert.deepEqual(
        p.replace('/the/select', {key:'the value'}),
        {replace:{
          select:  '/the/select',
          content:  {key:'the value'}
          }}
        );
    assert.deepEqual(
        p.replace('/the/select', p.multiplyBy(7)),
        {replace:{
          select:  '/the/select',
          content: [{"$value":7}],
          apply:   'ml.multiply'
          }}
        );
    assert.deepEqual(
        p.replace('/the/select', p.apply('functionName', 'the content')),
        {replace:{
          select:  '/the/select',
          content: [{"$value":"the content"}],
          apply:   'functionName'
          }}
        );
    assert.deepEqual(
        p.replace('/the/select', p.apply('functionName', new Date('2014-09-05T00:00:00.000Z'))),
        {replace:{
          select:  '/the/select',
          content: [{"$value":"2014-09-05T00:00:00.000Z", "$datatype":"xs:datetime"}],
          apply:   'functionName'
          }}
        );
    assert.deepEqual(
        p.replace('/the/select', p.apply('functionName', p.datatype('long'), '9223372036854775807')),
        {replace:{
          select:  '/the/select',
          content: [{"$value":"9223372036854775807", "$datatype":"xs:long"}],
          apply:   'functionName'
          }}
        );
    assert.deepEqual(
        p.replace('/the/select', p.concatBefore('the content')),
        {replace:{
          select:  '/the/select',
          content: [{"$value":"the content"}],
          apply:   'ml.concat-before'
          }}
        );
  });
  it('should create a replace-insert operation', function(){
    assert.deepEqual(
        p.replaceInsert('/the/select', '/the/context', 'last-child', 'the content'),
        {'replace-insert':{
          select:   '/the/select',
          context:  '/the/context',
          position: 'last-child',
          content:  'the content'
          }}
        );
    assert.deepEqual(
        p.replaceInsert('/the/select', '/the/context', 'before', 'the content'),
        {'replace-insert':{
          select:   '/the/select',
          context:  '/the/context',
          position: 'before',
          content:  'the content'
          }}
        );
    assert.deepEqual(
        p.replaceInsert('/the/select', '/the/context', 'after', 'the content'),
        {'replace-insert':{
          select:   '/the/select',
          context:  '/the/context',
          position: 'after',
          content:  'the content'
          }}
        );
    assert.deepEqual(
        p.replaceInsert('/the/select', '/the/context', 'last-child', 'the content', '?'),
        {'replace-insert':{
          select:      '/the/select',
          context:     '/the/context',
          position:    'last-child',
          content:     'the content',
          cardinality: '?'
          }}
        );
    assert.deepEqual(
        p.replaceInsert('/the/select', '/the/context', 'last-child', {key:'the value'}),
        {'replace-insert':{
          select:   '/the/select',
          context:  '/the/context',
          position: 'last-child',
          content:  {key:'the value'}
          }}
        );
    assert.deepEqual(
        p.replaceInsert('/the/select', '/the/context', 'last-child',
            p.apply('functionName', 'the content')),
        {'replace-insert':{
          select:   '/the/select',
          context:  '/the/context',
          position: 'last-child',
          content:  [{"$value":"the content"}],
          apply:    'functionName'
          }}
        );
  });
  it('should create a delete operation', function(){
    assert.deepEqual(
        p.remove('/the/select'),
        {'delete':{
          select: '/the/select'
          }}
        );
    assert.deepEqual(
        p.remove('/the/select', '?'),
        {'delete':{
          select:      '/the/select',
          cardinality: '?'
          }}
        );
  });
  it('should declare a library', function(){
    assert.deepEqual(
        p.library('replaceLib.xqy'),
        {'replace-library':{
          ns: 'http://marklogic.com/patch/apply/replaceLib',
          at: '/ext/marklogic/patch/apply/replaceLib.xqy'
          }}
        );
  });
  it('should declare an sjs library', function(){
    assert.deepEqual(
        p.library('replaceLib.sjs'),
        {'replace-library':{
          at: '/ext/marklogic/patch/apply/replaceLib.sjs'
          }}
        );
  });
});
