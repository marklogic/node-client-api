/*
 * Copyright 2017-2019 MarkLogic Corporation
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

describe('nodes', function() {
  const literals = [
      {row:1, gp:1, nm:'alpha', str:'a', num:10, bool:true},
      {row:2, gp:1, nm:'beta',  str:'b', num:20, bool:false},
      {row:3, gp:2, nm:'gamma', str:'c', num:30, bool:true},
      {row:4, gp:2, nm:'delta', str:'d', num:40, bool:false}
      ];
  // Note: roundtripped
  const exportedJson =
      {$optic:{ns:'op', fn:'operators', args:[
        {ns:'op', fn:'from-literals', args:[[{s:'a', n:1}]]},
        {ns:'op', fn:'select', args:[
          {ns:'op', fn:'as', args:['o',
            {ns:'op', fn:'json-document', args:[
              {ns:'op', fn:'json-object', args:[[
                {ns:'op', fn:'prop', args:['p1',
                  {ns:'op', fn:'json-string', args:[
                    {ns:'op', fn:'col', args:['s']}
                    ]}
                  ]},
                {ns:'op', fn:'prop', args:['p2',
                  {ns:'op', fn:'json-array', args:[
                    {ns:'op', fn:'json-number', args:[
                      {ns:'op', fn:'col', args:['n']}
                      ]}
                    ]}
                  ]}
                ]]}
              ]}
            ]}
          ]}
        ]}};
  const exportedXml =
      {$optic:{ns:'op', fn:'operators', args:[
        {ns:'op', fn:'from-literals', args:[[{s:'a', n:1}]]},
        {ns:'op', fn:'select', args:[
          {ns:'op', fn:'as', args:['c',
            {ns:'op', fn:'xml-document', args:[
              {ns:'op', fn:'xml-element', args:['e',
                {ns:'op', fn:'xml-attribute', args:['a',
                  {ns:'op', fn:'col', args:['s']}
                  ]},
                {ns:'op', fn:'xml-text', args:[
                  {ns:'op', fn:'col', args:['n']}
                  ]}
                ]}
              ]}
            ]}
          ]}
        ]}};
  describe('JSON', function() {
    it('string', function(done) {
      execPlan(
          p.fromLiterals(literals)
            .where(p.eq(p.col('gp'), 1))
            .select(['row', p.as('node', p.jsonString(p.col('str'))), p.as('kind', p.xdmp.nodeKind(p.col('node')))])
            .orderBy('row')
          )
        .then(function(response) {
          const output = getResults(response);
          should(output.length).equal(2);
          should(output[0].row.value).equal(1);
          should(output[0].node.value).equal('a');
          should(output[0].kind.value).equal('text');
          should(output[1].row.value).equal(2);
          should(output[1].node.value).equal('b');
          should(output[1].kind.value).equal('text');
          done();
        })
      .catch(done);
    });
    it('number', function(done) {
      execPlan(
          p.fromLiterals(literals)
            .where(p.eq(p.col('gp'), 1))
            .select(['row', p.as('node', p.jsonNumber(p.col('num'))), p.as('kind', p.xdmp.nodeKind(p.col('node')))])
            .orderBy('row')
          )
        .then(function(response) {
          const output = getResults(response);
          should(output.length).equal(2);
          should(output[0].row.value).equal(1);
          should(output[0].node.value).equal(10);
          should(output[0].kind.value).equal('number');
          should(output[1].row.value).equal(2);
          should(output[1].node.value).equal(20);
          should(output[1].kind.value).equal('number');
          done();
        })
      .catch(done);
    });
    it('boolean', function(done) {
      execPlan(
          p.fromLiterals(literals)
            .where(p.eq(p.col('gp'), 1))
            .select(['row', p.as('node', p.jsonBoolean(p.col('bool'))), p.as('kind', p.xdmp.nodeKind(p.col('node')))])
            .orderBy('row')
          )
        .then(function(response) {
          const output = getResults(response);
          should(output.length).equal(2);
          should(output[0].row.value).equal(1);
          should(output[0].node.value).equal(true);
          should(output[0].kind.value).equal('boolean');
          should(output[1].row.value).equal(2);
          should(output[1].node.value).equal(false);
          should(output[1].kind.value).equal('boolean');
          done();
        })
      .catch(done);
    });
    it('null', function(done) {
      execPlan(
          p.fromLiterals(literals)
            .where(p.eq(p.col('gp'), 1))
            .select(['row', p.as('node', p.jsonNull()), p.as('kind', p.xdmp.nodeKind(p.col('node')))])
            .orderBy('row')
          )
        .then(function(response) {
          const output = getResults(response);
          should(output.length).equal(2);
          should(output[0].row.value).equal(1);
          should(output[0].node.value).equal(null);
          should(output[0].kind.value).equal('null');
          should(output[1].row.value).equal(2);
          should(output[1].node.value).equal(null);
          should(output[1].kind.value).equal('null');
          done();
        })
      .catch(done);
    });
    it('array', function(done) {
      execPlan(
          p.fromLiterals(literals)
            .where(p.eq(p.col('gp'), 1))
            .select(['row',
                p.as('node', p.jsonArray([
                    p.jsonString(p.col('str')),
                    p.jsonNumber(p.col('num')),
                    p.jsonBoolean(p.col('bool')),
                    p.jsonNull(),
                    p.xs.string(p.col('str')),
                    p.xs.int(p.col('num')),
                    p.xs.boolean(p.col('bool')),
                    'string',
                    5,
                    true
                    ])),
                p.as('kind', p.xdmp.nodeKind(p.col('node')))
                ])
            .orderBy('row')
          )
        .then(function(response) {
          const output = getResults(response);
          should(output.length).equal(2);
          should(output[0].row.value).equal(1);
          should(output[0].node.value.length).equal(10);
          should(output[0].node.value[0]).equal('a');
          should(output[0].node.value[1]).equal(10);
          should(output[0].node.value[2]).equal(true);
          should(output[0].node.value[3]).equal(null);
          should(output[0].node.value[4]).equal('a');
          should(output[0].node.value[5]).equal(10);
          should(output[0].node.value[6]).equal(true);
          should(output[0].node.value[7]).equal('string');
          should(output[0].node.value[8]).equal(5);
          should(output[0].node.value[9]).equal(true);
          should(output[0].kind.value).equal('array');
          should(output[1].row.value).equal(2);
          should(output[1].node.value.length).equal(10);
          should(output[1].node.value[0]).equal('b');
          should(output[1].node.value[1]).equal(20);
          should(output[1].node.value[2]).equal(false);
          should(output[1].node.value[3]).equal(null);
          should(output[1].node.value[4]).equal('b');
          should(output[1].node.value[5]).equal(20);
          should(output[1].node.value[6]).equal(false);
          should(output[1].node.value[7]).equal('string');
          should(output[1].node.value[8]).equal(5);
          should(output[1].node.value[9]).equal(true);
          should(output[1].kind.value).equal('array');
          done();
        })
      .catch(done);
    });
    it('object', function(done) {
      execPlan(
          p.fromLiterals(literals)
            .where(p.eq(p.col('gp'), 1))
            .select(['row',
                p.as('node', p.jsonObject([
                    p.prop(p.col('str'), p.col('num')),
                    p.prop('k2', p.col('bool')),
                    p.prop('k3', p.jsonNull()),
                    p.prop('k4', p.jsonArray([p.col('row')]))
                    ])),
                p.as('kind', p.xdmp.nodeKind(p.col('node')))
                ])
            .orderBy('row')
          )
        .then(function(response) {
          const output = getResults(response);
          should(output.length).equal(2);
          should(output[0].row.value).equal(1);
          should(output[0].node.value.a).equal(10);
          should(output[0].node.value.k2).equal(true);
          should(output[0].node.value.k3).equal(null);
          should(output[0].node.value.k4.length).equal(1);
          should(output[0].node.value.k4[0]).equal(1);
          should(output[0].kind.value).equal('object');
          should(output[1].row.value).equal(2);
          should(output[1].node.value.b).equal(20);
          should(output[1].node.value.k2).equal(false);
          should(output[1].node.value.k3).equal(null);
          should(output[1].node.value.k4[0]).equal(2);
          should(output[1].kind.value).equal('object');
          done();
        })
      .catch(done);
    });
    it('document', function(done) {
      execPlan(
          p.fromLiterals(literals)
            .where(p.eq(p.col('gp'), 1))
            .select(['row',
                p.as('node', p.jsonDocument(p.jsonObject([
                    p.prop('k1', p.col('str')),
                    p.prop('k2', p.jsonArray([
                        p.col('num'),
                        p.jsonObject([
                            p.prop('k3', p.col('bool')),
                            p.prop('k4', p.jsonNull())
                            ])
                        ]))
                    ]))),
                p.as('kind', p.xdmp.nodeKind(p.col('node')))
                ])
            .orderBy('row')
          )
        .then(function(response) {
          const output = getResults(response);
          should(output.length).equal(2);
          should(output[0].row.value).equal(1);
          should(output[0].node.value.k1).equal('a');
          should(output[0].node.value.k2.length).equal(2);
          should(output[0].node.value.k2[0]).equal(10);
          should(output[0].node.value.k2[1].k3).equal(true);
          should(output[0].node.value.k2[1].k4).equal(null);
          should(output[0].kind.value).equal('document');
          should(output[1].row.value).equal(2);
          should(output[1].node.value.k1).equal('b');
          should(output[1].node.value.k2.length).equal(2);
          should(output[1].node.value.k2[0]).equal(20);
          should(output[1].node.value.k2[1].k3).equal(false);
          should(output[1].node.value.k2[1].k4).equal(null);
          should(output[1].kind.value).equal('document');
          done();
        })
      .catch(done);
    });
    it('expression', function(done) {
      execPlan(
          p.fromLiterals(literals)
            .where(p.eq(p.col('gp'), 1))
            .select(['row',
                p.as('node', p.jsonObject([
                    p.prop('k1', 'first'),
                    p.prop(p.fn.concat('key',p.col('row')), p.fn.concat(p.col('str'),' value')),
                    p.prop('k3', p.jsonArray([
                        0,
                        p.col('num'),
                        'end'
                        ]))
                    ])),
                p.as('kind', p.xdmp.nodeKind(p.col('node')))
                ])
            .orderBy('row')
          )
        .then(function(response) {
          const output = getResults(response);
          should(output.length).equal(2);
          should(output[0].row.value).equal(1);
          should(output[0].node.value.k1).equal('first');
          should(output[0].node.value.key1).equal('a value');
          should(output[0].node.value.k3.length).equal(3);
          should(output[0].node.value.k3[0]).equal(0);
          should(output[0].node.value.k3[1]).equal(10);
          should(output[0].node.value.k3[2]).equal('end');
          should(output[0].kind.value).equal('object');
          should(output[1].row.value).equal(2);
          should(output[1].node.value.k1).equal('first');
          should(output[1].node.value.key2).equal('b value');
          should(output[1].node.value.k3.length).equal(3);
          should(output[1].node.value.k3[0]).equal(0);
          should(output[1].node.value.k3[1]).equal(20);
          should(output[1].node.value.k3[2]).equal('end');
          should(output[1].kind.value).equal('object');
          done();
        })
      .catch(done);
    });
    it('array aggregate', function(done) {
      execPlan(
          p.fromLiterals(literals)
            .select(['gp',
                p.as('ro', p.jsonObject([
                    p.prop('row', p.col('row')),
                    p.prop('nm',  p.col('nm')),
                    p.prop('num', p.col('num'))
                    ]))
                ])
            .groupBy('gp', p.arrayAggregate('ra', 'ro'))
            .orderBy('gp')
            .select(p.as('container', p.jsonObject([
                    p.prop('group', p.col('gp')),
                    p.prop('rows',  p.col('ra'))
                    ]))
                )
          )
        .then(function(response) {
          const output = getResults(response);
          should(output.length).equal(2);
          should(output[0].container.value.group).equal(1);
          should(output[0].container.value.rows.length).equal(2);
          should(output[0].container.value.rows[0].row).equal(1);
          should(output[0].container.value.rows[0].nm).equal('alpha');
          should(output[0].container.value.rows[0].num).equal(10);
          should(output[0].container.value.rows[1].row).equal(2);
          should(output[0].container.value.rows[1].nm).equal('beta');
          should(output[0].container.value.rows[1].num).equal(20);
          should(output[1].container.value.group).equal(2);
          should(output[1].container.value.rows.length).equal(2);
          should(output[1].container.value.rows[0].row).equal(3);
          should(output[1].container.value.rows[0].nm).equal('gamma');
          should(output[1].container.value.rows[0].num).equal(30);
          should(output[1].container.value.rows[1].row).equal(4);
          should(output[1].container.value.rows[1].nm).equal('delta');
          should(output[1].container.value.rows[1].num).equal(40);
          done();
        })
      .catch(done);
    });
  });
  describe('XML', function() {
    it('text', function(done) {
      execPlan(
          p.fromLiterals(literals)
            .where(p.eq(p.col('gp'), 1))
            .select(['row', p.as('node', p.xmlText(p.col('str'))), p.as('kind', p.xdmp.nodeKind(p.col('node')))])
            .orderBy('row')
          )
        .then(function(response) {
          const output = getResults(response);
          should(output.length).equal(2);
          should(output[0].row.value).equal(1);
          should(output[0].node.value).equal('a');
          should(output[0].kind.value).equal('text');
          should(output[1].row.value).equal(2);
          should(output[1].node.value).equal('b');
          should(output[1].kind.value).equal('text');
          done();
        })
      .catch(done);
    });
    it('comment', function(done) {
      execPlan(
          p.fromLiterals(literals)
            .where(p.eq(p.col('gp'), 1))
            .select(['row', p.as('node', p.xmlComment(p.col('str'))), p.as('kind', p.xdmp.nodeKind(p.col('node')))])
            .orderBy('row')
          )
        .then(function(response) {
          const output = getResults(response);
          should(output.length).equal(2);
          should(output[0].row.value).equal(1);
          should(output[0].node.value).equal('<!--a-->');
          should(output[0].kind.value).equal('comment');
          should(output[1].row.value).equal(2);
          should(output[1].node.value).equal('<!--b-->');
          should(output[1].kind.value).equal('comment');
          done();
        })
      .catch(done);
    });
    it('processing instruction', function(done) {
      execPlan(
          p.fromLiterals(literals)
            .where(p.eq(p.col('gp'), 1))
            .select(['row', p.as('node', p.xmlPi(p.col('str'), p.col('num'))), p.as('kind', p.xdmp.nodeKind(p.col('node')))])
            .orderBy('row')
          )
        .then(function(response) {
          const output = getResults(response);
          should(output.length).equal(2);
          should(output[0].row.value).equal(1);
          should(output[0].node.value).equal('<?a 10?>');
          should(output[0].kind.value).equal('processing-instruction');
          should(output[1].row.value).equal(2);
          should(output[1].node.value).equal('<?b 20?>');
          should(output[1].kind.value).equal('processing-instruction');
          done();
          })
        .catch(done);
    });
    it('element empty', function(done) {
      execPlan(
          p.fromLiterals(literals)
            .where(p.eq(p.col('gp'), 1))
            .select(['row', p.as('node', p.xmlElement(p.col('str'))), p.as('kind', p.xdmp.nodeKind(p.col('node')))])
            .orderBy('row')
          )
        .then(function(response) {
          const output = getResults(response);
          should(output.length).equal(2);
          should(output[0].row.value).equal(1);
          should(output[0].node.value).equal('<a/>');
          should(output[0].kind.value).equal('element');
          should(output[1].row.value).equal(2);
          should(output[1].node.value).equal('<b/>');
          should(output[1].kind.value).equal('element');
          done();
        })
      .catch(done);
    });
    it('element attribute', function(done) {
      execPlan(
          p.fromLiterals(literals)
            .where(p.eq(p.col('gp'), 1))
            .select(['row',
                p.as('node', p.xmlElement(p.col('nm'), p.xmlAttribute(p.col('str'), p.col('num')))),
                p.as('kind', p.xdmp.nodeKind(p.col('node')))
                ])
            .orderBy('row')
          )
        .then(function(response) {
          const output = getResults(response);
          should(output.length).equal(2);
          should(output[0].row.value).equal(1);
          should(output[0].node.value).equal('<alpha a="10"/>');
          should(output[0].kind.value).equal('element');
          should(output[1].row.value).equal(2);
          should(output[1].node.value).equal('<beta b="20"/>');
          should(output[1].kind.value).equal('element');
          done();
        })
      .catch(done);
    });
    it('element content', function(done) {
      execPlan(
          p.fromLiterals(literals)
            .where(p.eq(p.col('gp'), 1))
            .select(['row',
                p.as('node', p.xmlElement(p.col('nm'), null, [
                  p.xmlText(p.col('str')),
                  p.xs.string(p.col('str')),
                  p.col('str'),
                  'string'
                  ])),
                p.as('kind', p.xdmp.nodeKind(p.col('node')))
                ])
            .orderBy('row')
          )
        .then(function(response) {
          const output = getResults(response);
          should(output.length).equal(2);
          should(output[0].row.value).equal(1);
          should(output[0].node.value).equal('<alpha>aa a string</alpha>');
          should(output[0].kind.value).equal('element');
          should(output[1].row.value).equal(2);
          should(output[1].node.value).equal('<beta>bb b string</beta>');
          should(output[1].kind.value).equal('element');
          done();
        })
      .catch(done);
    });
    it('element attribute content', function(done) {
      execPlan(
          p.fromLiterals(literals)
            .where(p.eq(p.col('gp'), 1))
            .select(['row',
                p.as('node', p.xmlElement(p.col('nm'), p.xmlAttribute(p.col('str'), p.col('num')), p.xmlText(p.col('bool')))),
                p.as('kind', p.xdmp.nodeKind(p.col('node')))
                ])
            .orderBy('row')
          )
        .then(function(response) {
          const output = getResults(response);
          should(output.length).equal(2);
          should(output[0].row.value).equal(1);
          should(output[0].node.value).equal('<alpha a="10">true</alpha>');
          should(output[0].kind.value).equal('element');
          should(output[1].row.value).equal(2);
          should(output[1].node.value).equal('<beta b="20">false</beta>');
          should(output[1].kind.value).equal('element');
          done();
        })
      .catch(done);
    });
    it('document', function(done) {
      execPlan(
          p.fromLiterals(literals)
            .where(p.eq(p.col('gp'), 1))
            .select(['row',
                p.as('node', p.xmlDocument(
                    p.xmlElement(p.col('nm'), null,
                        p.xmlElement(p.col('str'), null, p.xmlText(p.col('bool')))
                        )
                    )),
                p.as('kind', p.xdmp.nodeKind(p.col('node')))
                ])
            .orderBy('row')
          )
        .then(function(response) {
          const output = getResults(response);
          should(output.length).equal(2);
          should(output[0].row.value).equal(1);
          should(output[0].node.value).equal('<alpha><a>true</a></alpha>');
          should(output[0].kind.value).equal('document');
          should(output[1].row.value).equal(2);
          should(output[1].node.value).equal('<beta><b>false</b></beta>');
          should(output[1].kind.value).equal('document');
          done();
        })
      .catch(done);
    });
    it('expression', function(done) {
      execPlan(
        p.fromLiterals(literals)
            .where(p.eq(p.col('gp'), 1))
            .select(['row',
              p.as('node', p.xmlElement(p.fn.concat(p.col('nm'), 'Name'), [
                          p.xmlAttribute(p.fn.concat('key', p.col('row')), 'value'),
                          p.xmlAttribute('key', p.fn.concat(p.col('str'), ' value'))
                      ], [
                          p.xmlText(p.fn.concat(p.col('num'), ' text')),
                          p.xmlElement('separator'),
                          'end'
                      ])
                  ),
              p.as('kind', p.xdmp.nodeKind(p.col('node')))
              ])
            .orderBy('row')
          )
        .then(function(response) {
          const output = getResults(response);
        should(output.length).equal(2);
        should(output[0].row.value).equal(1);
        should(output[0].node.value).equal('<alphaName key1="value" key="a value">10 text<separator/>end</alphaName>');
        should(output[0].kind.value).equal('element');
        should(output[1].row.value).equal(2);
        should(output[1].node.value).equal('<betaName key2="value" key="b value">20 text<separator/>end</betaName>');
        should(output[1].kind.value).equal('element');
        done();
      })
    .catch(done);
    });
    it('sequence aggregate', function(done) {
      execPlan(
          p.fromLiterals(literals)
            .select(['gp',
                p.as('re', p.xmlElement('relem', [
                    p.xmlAttribute('row', p.col('row')),
                    p.xmlAttribute('nm',  p.col('nm')),
                    p.xmlAttribute('num', p.col('num'))
                    ]))
                ])
            .groupBy('gp', p.sequenceAggregate('rs', 're'))
            .orderBy('gp')
            .select(p.as('container', p.xmlElement('gelem',
                    p.xmlAttribute('group', p.col('gp')),
                    p.xmlElement('rows',    p.col('rs'))
                    ))
                )
          )
        .then(function(response) {
          const output = getResults(response);
          should(output.length).equal(2);
          should(output[0].container.value).equal(
              '<gelem group="1"><rows><relem row="1" nm="alpha" num="10"/><relem row="2" nm="beta" num="20"/></rows></gelem>'
              );
          should(output[1].container.value).equal(
              '<gelem group="2"><rows><relem row="3" nm="gamma" num="30"/><relem row="4" nm="delta" num="40"/></rows></gelem>'
              );
          done();
        })
      .catch(done);
    });
  });
  describe('serialization', function() {
    it('JSON export', function(done) {
      const value =
          p.fromLiterals([{s:'a', n:1}])
            .select(p.as('o',p.jsonDocument(
                p.jsonObject([
                    p.prop('p1', p.jsonString(p.col('s'))),
                    p.prop('p2', p.jsonArray([
                        p.jsonNumber(p.col('n'))
                        ]))
                    ])
                )))
            .export();
      should(value).deepEqual(exportedJson);
      done();
    });
    it('XML export', function(done) {
      const value =
          p.fromLiterals([{s:'a', n:1}])
            .select(p.as('c', p.xmlDocument(
                p.xmlElement('e', p.xmlAttribute('a', p.col('s')),
                    p.xmlText(p.col('n'))
                    )
                )))
            .export();
      should(value).deepEqual(exportedXml);
      done();
    });
  });
});
