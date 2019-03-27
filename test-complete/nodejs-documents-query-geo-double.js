/*
 * Copyright 2014-2019 MarkLogic Corporation
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
var should = require('should');

var testconfig = require('../etc/test-config-qa.js');

var marklogic = require('../');
var q = marklogic.queryBuilder;

var db = marklogic.createDatabaseClient(testconfig.restReaderConnection);
var dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var dbAdmin = marklogic.createDatabaseClient(testconfig.restAdminConnection);

describe('Document geo query test', function(){
  before(function(done){
    this.timeout(10000);
    dbWriter.documents.write({
      uri: '/test/double/geo/doc1.json',
      collections: ['geoDoubleCollection'],
      contentType: 'application/json',
      content: {
        title: 'karl_kara',
        gElemPointWgs84Double: '12.34,5.48',
        gElemChildParentEtrs89Double: {
          gElemChildPointEtrs89Double: '12.3467,5.4843'
        },
        gElemPairRawDouble: {
          latitudeRawDouble: 12.34,
          longitudeRawDouble: 5.48
        }
      }
    },
    {
      uri: '/test/double/geo/doc2.json',
      collections: ['geoDoubleCollection'],
      contentType: 'application/json',
      content: {
        title: 'bob_long',
        gElemPointWgs84Double: '34.89,88.27',
        gElemChildParentEtrs89Double: {
          gElemChildPointEtrs89Double: '34.89,88.27'
        },
        gElemPairRawDouble: {
          latitudeRawDouble: 34.89,
          longitudeRawDouble: 88.27
        }
      }
    },
    {
      uri: '/test/double/geo/doc3.json',
      collections: ['geoDoubleCollection'],
      contentType: 'application/json',
      content: {
        title: 'sam_sung',
        gElemPointWgs84Double: '101.09,4.99',
        gElemChildParentEtrs89Double: {
          gElemChildPointEtrs89Double: '101.09,4.99'
        },
        gElemPairRawDouble: {
          latitudeRawDouble: 101.09,
          longitudeRawDouble: 4.99
        }
      }
    },
    {
      uri: '/test/double/geo/doc4.xml',
      collections: ['geoDoubleCollection'],
      contentType: 'application/xml',
      content:
        '<root>' +
        '  <title>ben_red</title>' +
        '  <gElemPointWgs84Double>50.75,44.78</gElemPointWgs84Double>' +
        '  <gElemChildParentEtrs89Double>' +
        '    <gElemChildPointEtrs89Double>50.75,44.78</gElemChildPointEtrs89Double>' +
        '  </gElemChildParentEtrs89Double>' +
        '  <gElemPairRawDouble>' +
        '    <latitudeRawDouble>50.75</latitudeRawDouble>' +
        '    <longitudeRawDouble>44.78</longitudeRawDouble>' +
        '  </gElemPairRawDouble>' +
        '</root>'
    },
    {
      uri: '/test/double/geo/doc5.xml',
      collections: ['geoDoubleCollection'],
      contentType: 'application/xml',
      content:
        '<root>' +
        '  <title>george_blue</title>' +
        '  <gElemPointWgs84Double>250.35,144.77</gElemPointWgs84Double>' +
        '  <gElemChildParentEtrs89Double>' +
        '    <gElemChildPointEtrs89Double>250.35,144.77</gElemChildPointEtrs89Double>' +
        '  </gElemChildParentEtrs89Double>' +
        '  <gElemPairRawDouble>' +
        '    <latitudeRawDouble>250.35</latitudeRawDouble>' +
        '    <longitudeRawDouble>144.77</longitudeRawDouble>' +
        '  </gElemPairRawDouble>' +
        '  <gAttrPair latitudeRawDouble="250.35" longitudeRawDouble="144.77"/>' +
        '</root>'
    },
    {
      uri: '/test/double/geo/doc6.json',
      collections: ['geoDoubleCollection'],
      contentType: 'application/json',
      content: {
        title: 'cross_pole',
        gElemPointWgs84Double: '37.2768,-77.4008',
        gElemChildParentEtrs89Double: {
          gElemChildPointEtrs89Double: '37.2768,-77.4008'
        },
        gElemPairRawDouble: {
          latitudeRawDouble: 37.2768,
          longitudeRawDouble: -77.4008
        }
      }
    }
    ).
    result(function(response){done();}, done);
  });

  it('TEST 1 - should do geo elem query on wgs84 double', function(done){
    dbWriter.documents.query(
      q.where(
        q.geospatial(
            q.geoProperty('gElemPointWgs84Double'),
            q.geoOptions('coordinate-system=wgs84/double'),
            q.point(12.34, 5.48)
        )
      )
    ).
    result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response.length.should.equal(1);
      response[0].content.title.should.equal('karl_kara');
      done();
    }, done);
  });

  it('TEST 2 - should do geo elem child query on etrs89 double', function(done){
    dbWriter.documents.query(
      q.where(
        q.geospatial(
          q.geoProperty(
            q.property('gElemChildParentEtrs89Double'),
            q.property('gElemChildPointEtrs89Double')
          ),
          q.geoOptions('coordinate-system=etrs89/double'),
          q.latlon(12.3467, 5.4843)
        )
      )
    ).
    result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response.length.should.equal(1);
      response[0].content.title.should.equal('karl_kara');
      done();
    }, done);
  });

  it('TEST 3 - should do geo elem pair query on raw double', function(done){
    dbWriter.documents.query(
      q.where(
        q.geospatial(
          q.geoPropertyPair('gElemPairRawDouble', 'latitudeRawDouble', 'longitudeRawDouble'),
          q.geoOptions('coordinate-system=raw/double'),
          q.latlon(12.34, 5.48)
        )
      )
    ).
    result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response.length.should.equal(1);
      response[0].content.title.should.equal('karl_kara');
      done();
    }, done);
  });

  it('TEST 4 - should do geo elem pair query with circle on raw double', function(done){
    dbWriter.documents.query(
      q.where(
        q.geospatial(
          q.geoPropertyPair('gElemPairRawDouble', 'latitudeRawDouble', 'longitudeRawDouble'),
          q.geoOptions('coordinate-system=raw/double'),
          q.circle(10, 11.24, 5.67)
        )
      )
    ).
    result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response.length.should.equal(1);
      response[0].content.title.should.equal('karl_kara');
      done();
    }, done);
  });

  it('TEST 5 - should do geo elem pair query with box in raw double and included boundaries', function(done){
    dbWriter.documents.query(
      q.where(
        q.geospatial(
          q.geoPropertyPair('gElemPairRawDouble', 'latitudeRawDouble', 'longitudeRawDouble'),
          q.geoOptions('boundaries-included', 'coordinate-system=raw/double'),
          q.box(11.45, 4.43, 20.09, 10.38)
        )
      )
    ).
    result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response.length.should.equal(1);
      response[0].content.title.should.equal('karl_kara');
      done();
    }, done);
  });

  it('TEST 6 - should do geo element pair query in xml doc', function(done){
    dbWriter.documents.query(
      q.where(
        q.geospatial(
          q.geoElementPair('gElemPairRawDouble', 'latitudeRawDouble', 'longitudeRawDouble'),
          q.geoOptions('coordinate-system=raw/double'),
          q.latlon(50.75, 44.78)
        )
      )
    ).
    result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response.length.should.equal(1);
      response[0].uri.should.equal('/test/double/geo/doc4.xml');
      done();
    }, done);
  });

  it('TEST 7 - should not return any result with wgs84 double', function(done){
    dbWriter.documents.query(
      q.where(
        q.geospatial(
            q.geoProperty('gElemPointWgs84Double'),
            q.geoOptions('coordinate-system=wgs84/double'),
            q.point(12, 5)
        )
      )
    ).
    result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response.length.should.equal(0);
      done();
    }, done);
  });

  it('TEST 8 - should not return any result on etrs89 double', function(done){
    dbWriter.documents.query(
      q.where(
        q.geospatial(
          q.geoProperty(
            q.property('gElemChildParentEtrs89Double'),
            q.property('gElemChildPointEtrs89Double')
          ),
          q.geoOptions('coordinate-system=etrs89/double'),
          q.latlon(12, 5)
        )
      )
    ).
    result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response.length.should.equal(0);
      done();
    }, done);
  });

  it('TEST 9 - should not return any result on raw double', function(done){
    dbWriter.documents.query(
      q.where(
        q.geospatial(
          q.geoPropertyPair('gElemPairRawDouble', 'latitudeRawDouble', 'longitudeRawDouble'),
          q.geoOptions('coordinate-system=raw/double'),
          q.latlon(12, 5)
        )
      )
    ).
    result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response.length.should.equal(0);
      done();
    }, done);
  });

  it('TEST 10 - should do geo elem pair query with box in raw double and excluded boundaries', function(done){
    dbWriter.documents.query(
      q.where(
        q.geospatial(
          q.geoPropertyPair('gElemPairRawDouble', 'latitudeRawDouble', 'longitudeRawDouble'),
          q.geoOptions('boundaries-excluded', 'coordinate-system=raw/double'),
          q.box(12, 5, 20, 10)
        )
      )
    ).
    result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response.length.should.equal(1);
      response[0].content.title.should.equal('karl_kara');
      done();
    }, done);
  });

  it('should delete all documents', function(done){
    dbAdmin.documents.removeAll({
      collection: 'geoDoubleCollection'
    }).
    result(function(response) {
      done();
    }, done);
  });

});
