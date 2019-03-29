/*
 * Copyright 2016-2019 MarkLogic Corporation
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

describe('triples', function() {
  const datastore     = p.col('datastore');
  const master        = p.col('master');
  const masterId      = p.col('masterId');
  const titleCol      = p.col('title');
  const datastoreType = p.sem.iri('http://purl.org/dc/dcmitype/Dataset');
  const dc            = p.prefixer('http://purl.org/dc/terms/');
  const typeProp      = dc('type');
  const titleProp     = dc('title');
  const sourceProp    = dc('source');
  const idProp        = dc('identifier');
  const descProp      = dc('description');
  const altProp       = dc('alternative');
  const exportedTriplesBarePatterns =
    {$optic:{ns:'op', fn:'operators', args:[
      {ns:'op', fn:'from-triples', args:[[
        {ns:'op', fn:'pattern', args:[
          {ns:'op', fn:'col', args:['datastore']},
          {ns:'sem', fn:'iri', args:['http://purl.org/dc/terms/type']},
          {ns:'sem', fn:'iri', args:['http://purl.org/dc/dcmitype/Dataset']}
          ]},
        {ns:'op', fn:'pattern', args:[
          {ns:'op', fn:'col', args:['datastore']},
          {ns:'sem', fn:'iri', args:['http://purl.org/dc/terms/title']},
          {ns:'op', fn:'col', args:['title']}
          ]}]
        ]}
      ]}};
  const exportedTriplesGraphColumn =
  {$optic:{ns:'op', fn:'operators', args:[
    {ns:'op', fn:'from-triples', args:[[
        {ns:'op', fn:'pattern', args:[
          {ns:'op',  fn:'col',       args:['datastore']},
          {ns:'sem', fn:'iri',       args:['http://purl.org/dc/terms/type']},
          {ns:'sem', fn:'iri',       args:['http://purl.org/dc/dcmitype/Dataset']},
          {ns:'op',  fn:'graph-col', args:['sourceGraph']}
          ]},
        {ns:'op', fn:'pattern', args:[
          {ns:'op',  fn:'col', args:['datastore']},
          {ns:'sem', fn:'iri', args:['http://purl.org/dc/terms/title']},
          {ns:'op',  fn:'col', args:['title']}
          ]}]
      ]},
    {ns:'op', fn:'order-by', args:[['sourceGraph','title']]}
    ]}};
  const exportedFromSPARQL =
    {$optic:{ns:'op', fn:'operators', args:[
      {ns:'op', fn:'from-sparql', args:[
        'PREFIX dc: <http://purl.org/dc/terms/> '+
        'SELECT ?datastore ?title '+
        'WHERE {?datastore dc:type <http://purl.org/dc/dcmitype/Dataset> ; dc:title ?title .}'
      ]}
    ]}};
  describe('accessors', function() {
    it('with bare patterns', function(done) {
      execPlan(
        p.fromTriples([
                  p.pattern(datastore, typeProp,  datastoreType),
                  p.pattern(datastore, titleProp, titleCol),
                  p.pattern(datastore, descProp,  p.col('desc'))
              ],
              'tripview')
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(2);
        should(output[0]['tripview.datastore'].value).equal('/datastore/id#A');
        should(output[0]['tripview.title'].value).equal('The A datastore');
        should(output[0]['tripview.desc'].value).equal('Describing A');
        should(output[1]['tripview.datastore'].value).equal('/datastore/id#B');
        should(output[1]['tripview.title'].value).equal('The B datastore');
        should(output[1]['tripview.desc'].value).equal('Describing B');
        done();
        })
      .catch(done);
    });
    it('with multiple literals', function(done) {
      execPlan(
        p.fromTriples(
              p.pattern(
                  p.col('identified'),
                  idProp,
                  [1, 2]
                  ))
              .orderBy('identified')
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(2);
        should(output[0].identified.value).equal('/master/id#1');
        should(output[1].identified.value).equal('/master/id#2');
        done();
        })
      .catch(done);
    });
    it('with required column', function(done) {
      execPlan(
        p.fromTriples([
                  p.pattern(datastore, typeProp,  datastoreType),
                  p.pattern(datastore, titleProp, titleCol),
                  p.pattern(datastore, altProp,   p.col('alternative'))
              ])
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(1);
        should(output[0].datastore.value).equal('/datastore/id#A');
        should(output[0].title.value).equal('The A datastore');
        should(output[0].alternative.value).equal('The Awesome datastore');
        done();
        })
      .catch(done);
    });
    it('with optional column', function(done) {
      execPlan(
        p.fromTriples([
                  p.pattern(datastore, typeProp,  datastoreType),
                  p.pattern(datastore, titleProp, titleCol)
              ])
              .joinLeftOuter(p.fromTriples(
                  p.pattern(datastore, altProp, p.col('alternative'))
                  ))
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(2);
        should(output[0].datastore.value).equal('/datastore/id#A');
        should(output[0].title.value).equal('The A datastore');
        should(output[0].alternative.value).equal('The Awesome datastore');
        should(output[1].datastore.value).equal('/datastore/id#B');
        should(output[1].title.value).equal('The B datastore');
        should(output[1].alternative.value).equal(null);
        done();
        })
      .catch(done);
    });
    it('with fragment id column', function(done) {
      execPlan(
        p.fromTriples([
                  p.pattern(datastore, typeProp,  datastoreType, p.fragmentIdCol('sourceDocId')),
                  p.pattern(datastore, titleProp, titleCol)
              ])
              .select(['datastore','title','sourceDocId',
                  p.as('sourceDocCheck',p.isDefined(p.fragmentIdCol('sourceDocId')))])
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(2);
        should(output[0].datastore.value).equal('/datastore/id#A');
        should(output[0].title.value).equal('The A datastore');
        should(output[0].sourceDocCheck.value).equal(true);
        should.not.exist(output[0].sourceDocId);
        should(output[1].datastore.value).equal('/datastore/id#B');
        should(output[1].title.value).equal('The B datastore');
        should(output[1].sourceDocCheck.value).equal(true);
        should.not.exist(output[1].sourceDocId);
        done();
        })
      .catch(done);
    });
    it('having col method', function(done) {
      const accessor = p.fromTriples([
          p.pattern(datastore, typeProp,  datastoreType, p.fragmentIdCol('sourceDoc')),
          p.pattern(datastore, titleProp, titleCol)
        ],
        'tripview');
      const colPlan = accessor.select(accessor.col('title'));
      const value = colPlan.export();
      should(value.$optic.args.length).equal(2);
      should(value.$optic.args[1].args.length).equal(1);
      should(value.$optic.args[1].args[0]).deepEqual(
        {ns:'op', fn:'view-col', args:['tripview', 'title']}
      );
      execPlan(
        colPlan
          .orderBy(accessor.col('title'))
          .limit(2)
      )
        .then(function(response) {
          const output = getResults(response);
          should(output.length).equal(2);
          should(output[0]['tripview.title'].value).equal('The A datastore');
          should(output[1]['tripview.title'].value).equal('The B datastore');
          done();
        })
        .catch(done);
    });
    it('with graph iri', function(done) {
      execPlan(
        p.fromTriples(
            p.pattern(p.col('albumId'), p.sem.iri('/optic/test/albumName'),  p.col('albumName')),
            null,
            '/optic/music'
            )
          .where(p.cts.jsonPropertyWordQuery('style', 'avantgarde'))
          .orderBy('albumName')
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(4);
        should(output[0].albumName.value).equal('A Ballad For Many');
        should(output[1].albumName.value).equal('Crescent');
        should(output[2].albumName.value).equal('Four Thoughts on Marvin Gaye');
        should(output[3].albumName.value).equal('Impressions');
        done();
        })
      .catch(done);
    });
    it('with param', function(done) {
      execPlan(
        p.fromTriples(
          p.pattern(p.col('albumId'), p.sem.iri('/optic/test/albumName'),  p.param('albumName'))
          ),
        {albumName:'Crescent'}
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(1);
        should(output[0].albumId.value).equal('/optic/test/albums3_2');
        done();
        })
      .catch(done);
    });
    it('with query', function(done) {
      execPlan(
        p.fromTriples(
            p.pattern(p.col('albumId'), p.sem.iri('/optic/test/albumName'),  p.col('albumName'))
            )
          .where(p.cts.jsonPropertyWordQuery('style', 'avantgarde'))
          .orderBy('albumName')
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(4);
        should(output[0].albumName.value).equal('A Ballad For Many');
        should(output[1].albumName.value).equal('Crescent');
        should(output[2].albumName.value).equal('Four Thoughts on Marvin Gaye');
        should(output[3].albumName.value).equal('Impressions');
        done();
        })
      .catch(done);
    });
    it('with store', function(done) {
      execPlan(
        p.fromTriples(
            p.pattern(p.col('albumId'), p.sem.iri('/optic/test/albumName'),  p.col('albumName'))
            )
          .where(p.sem.store("document", p.cts.jsonPropertyWordQuery('style', 'avantgarde')))
          .orderBy('albumName')
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(4);
        should(output[0].albumName.value).equal('A Ballad For Many');
        should(output[1].albumName.value).equal('Crescent');
        should(output[2].albumName.value).equal('Four Thoughts on Marvin Gaye');
        should(output[3].albumName.value).equal('Impressions');
        done();
        })
      .catch(done);
    });
    it('with graph column', function(done) {
      execPlan(
        p.fromTriples([
           p.pattern(datastore, typeProp,  datastoreType, p.graphCol('sourceGraph')),
           p.pattern(datastore, titleProp, titleCol)
           ])
         .where(p.eq(p.col('sourceGraph'), '/graphs/inventory'))
         .orderBy(['sourceGraph', 'title'])
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(2);
        should(output[0].sourceGraph.value).equal('/graphs/inventory');
        should(output[0].title.value).equal('The A datastore');
        should(output[1].sourceGraph.value).equal('/graphs/inventory');
        should(output[1].title.value).equal('The B datastore');
        done();
        })
      .catch(done);
    });
  });
  describe('from SPARQL', function() {
    it('basic', function(done) {
      execPlan(
        p.fromSPARQL('PREFIX dc: <http://purl.org/dc/terms/> '+
          'SELECT ?datastore ?title '+
          'WHERE {?datastore dc:type <http://purl.org/dc/dcmitype/Dataset> ; dc:title ?title .}')
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(2);
        should(output[0]['datastore'].value).equal('/datastore/id#A');
        should(output[0]['title'].value).equal('The A datastore');
        should(output[1]['datastore'].value).equal('/datastore/id#B');
        should(output[1]['title'].value).equal('The B datastore');
        done();
      })
        .catch(done);
    });
    it('with qualifier', function(done) {
      execPlan(
        p.fromSPARQL('PREFIX dc: <http://purl.org/dc/terms/> '+
          'SELECT ?datastore ?title '+
          'WHERE {?datastore dc:type <http://purl.org/dc/dcmitype/Dataset> ; dc:title ?title .}',
          'sparqlsel')
        )
      .then(function(response) {
        const output = getResults(response);
        should(output.length).equal(2);
        should(output[0]['sparqlsel.datastore'].value).equal('/datastore/id#A');
        should(output[0]['sparqlsel.title'].value).equal('The A datastore');
        should(output[1]['sparqlsel.datastore'].value).equal('/datastore/id#B');
        should(output[1]['sparqlsel.title'].value).equal('The B datastore');
        done();
      })
        .catch(done);
    });
  });
  describe('serialize', function() {
    describe('export', function() {
      it('with bare patterns', function(done) {
        const value =
          p.fromTriples([
                    p.pattern(datastore, typeProp,  datastoreType),
                    p.pattern(datastore, titleProp, titleCol)
                ])
            .export();
        should(value).deepEqual(exportedTriplesBarePatterns);
        done();
      });
      it('with graph column', function(done) {
        const value =
          p.fromTriples([
                  p.pattern(datastore, typeProp,  datastoreType, p.graphCol('sourceGraph')),
                  p.pattern(datastore, titleProp, titleCol)
                  ])
              .orderBy(['sourceGraph', 'title'])
            .export();
        should(value).deepEqual(exportedTriplesGraphColumn);
        done();
      });
      it('from SPARQL', function(done) {
        const value =
          p.fromSPARQL('PREFIX dc: <http://purl.org/dc/terms/> '+
              'SELECT ?datastore ?title '+
              'WHERE {?datastore dc:type <http://purl.org/dc/dcmitype/Dataset> ; dc:title ?title .}')
            .export();
        should(value).deepEqual(exportedFromSPARQL);
        done();
      });
    });
  });
});
