/*
 * Copyright 2014-2015 MarkLogic Corporation
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
      uri: '/test/query/geo/doc1.json',
      collections: ['geoCollection'],
      contentType: 'application/json',
      content: {
        title: 'karl_kara',
        gElemPoint: '12,5',
        gElemChildParent: {
          gElemChildPoint: '12,5'
        },
        gElemPair: {
          latitude: 12,
          longitude: 5
        }
      } 
    },
    {
      uri: '/test/query/geo/doc2.json',
      collections: ['geoCollection'],
      contentType: 'application/json',
      content: {
        title: 'bob_long',
        gElemPoint: '34,88',
        gElemChildParent: {
          gElemChildPoint: '34,88'
        },
        gElemPair: {
          latitude: 34,
          longitude: 88
        }
      } 
    },
    {
      uri: '/test/query/geo/doc3.json',
      collections: ['geoCollection'],
      contentType: 'application/json',
      content: {
        title: 'sam_sung',
        gElemPoint: '101,4',
        gElemChildParent: {
          gElemChildPoint: '101,4'
        },
        gElemPair: {
          latitude: 101,
          longitude: 4
        }
      } 
    },
    {
      uri: '/test/query/geo/doc4.xml',
      collections: ['geoCollection'],
      contentType: 'application/xml',
      content: 
        '<root>' + 
        '  <title>ben_red</title>' +
        '  <gElemPoint>50,44</gElemPoint>' +
        '  <gElemChildParent>' +
        '    <gElemChildPoint>50,44</gElemChildPoint>' +
        '  </gElemChildParent>' +
        '  <gElemPair>' +
        '    <latitude>50</latitude>' +
        '    <longitude>44</longitude>' +
        '  </gElemPair>' +
        '</root>'
    },
    {
      uri: '/test/query/geo/doc5.xml',
      collections: ['geoCollection'],
      contentType: 'application/xml',
      content: 
        '<root>' + 
        '  <title>george_blue</title>' +
        '  <gElemPoint>250,144</gElemPoint>' +
        '  <gElemChildParent>' +
        '    <gElemChildPoint>250,144</gElemChildPoint>' +
        '  </gElemChildParent>' +
        '  <gElemPair>' +
        '    <latitude>250</latitude>' +
        '    <longitude>144</longitude>' +
        '  </gElemPair>' +
        '  <gAttrPair latitude="250" longitude="144"/>' + 
        '</root>'
    },
    {
      uri: '/test/query/geo/doc6.json',
      collections: ['geoCollection'],
      contentType: 'application/json',
      content: {
        title: 'cross_pole',
        gElemPoint: '37.2768,-77.4008',
        gElemChildParent: {
          gElemChildPoint: '37.2768,-77.4008'
        },
        gElemPair: {
          latitude: 37.2768,
          longitude: -77.4008
        }
      } 
    }
    ).
    result(function(response){done();}, done);
  });

  it('should do geo property pair query in json doc', function(done){
    dbWriter.documents.query(
      q.where(
        q.geospatial(
            q.geoPropertyPair('gElemPair', 'latitude', 'longitude'), 
            q.latlon(12, 5)
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

  it('should do geo property pair query in json doc', function(done){
    dbWriter.documents.query(
      q.where(
        q.geospatial(
          q.geoPropertyPair('gElemPair', 'latitude', 'longitude'), 
          q.latlon(12, 5),
          q.geoOptions('boundaries-latitude-excluded')
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

  it('should do geo property point query in json doc', function(done){
    dbWriter.documents.query(
      q.where(
        q.geospatial(
          q.geoProperty('gElemPoint'), 
          q.point(34, 88)
        )
      )
    ).
    result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response.length.should.equal(1);
      response[0].content.title.should.equal('bob_long');
      done();
    }, done);
  });

  it('should do geo property child point query in json doc', function(done){
    dbWriter.documents.query(
      q.where(
        q.geospatial(
          q.geoProperty(
            q.property('gElemChildParent'), 
            q.property('gElemChildPoint')
          ), 
          q.latlon(34, 88)     
        ) 
      )
    ).
    result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response.length.should.equal(1);
      response[0].content.title.should.equal('bob_long');
      done();
    }, done);
  });

  it('should do combination geo and word query in json doc', function(done){
    dbWriter.documents.query(
      q.where(
        q.or(
          q.geospatial(
            q.geoProperty(
              q.property('gElemChildParent'), 
              q.property('gElemChildPoint')
            ), 
            q.latlon(34, 88)
          ),
          q.word('title', 'karl_kara')
        )
      )
    ).
    result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response.length.should.equal(2);
      //response[0].content.title.should.equal('bob_long');
      done();
    }, done);
  });

  it('should do geo property pair query with circle in json doc', function(done){
    dbWriter.documents.query(
      q.where(
        q.geospatial(
          q.geoPropertyPair('gElemPair', 'latitude', 'longitude'), 
          q.circle(100, 11, 5)
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

  it('should do geo property pair query with circle in crossed pole', function(done){
    dbWriter.documents.query(
      q.where(
        q.geospatial(
          q.geoPropertyPair('gElemPair', 'latitude', 'longitude'), 
          q.circle(2000, 32.2768, -62.4008)
        )
      )
    ).
    result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response.length.should.equal(1);
      response[0].content.title.should.equal('cross_pole');
      done();
    }, done);
  });

  it('should do geo property pair query with box in json doc', function(done){
    dbWriter.documents.query(
      q.where(
        q.geospatial(
          q.geoPropertyPair('gElemPair', 'latitude', 'longitude'), 
          q.box(11, 4, 20, 10),
          q.geoOptions('boundaries-included')
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

  it('should do geo property pair query with box boundaries included in json doc', function(done){
    dbWriter.documents.query(
      q.where(
        q.geospatial(
          q.geoPropertyPair('gElemPair', 'latitude', 'longitude'), 
          q.box(12, 5, 20, 10),
          q.geoOptions('boundaries-included')
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

  it('should do geo property pair query with box boundaries excluded in json doc', function(done){
    dbWriter.documents.query(
      q.where(
        q.geospatial(
          q.geoPropertyPair('gElemPair', 'latitude', 'longitude'), 
          q.box(12, 5, 20, 10),
          q.geoOptions('boundaries-excluded')
        )
      )
    ).
    result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response.length.should.equal(0);
      done();
    }, done);
  });

  it('should do geo property pair query with polygon in json doc', function(done){
    dbWriter.documents.query(
      q.where(
        q.geospatial(
          q.geoPropertyPair('gElemPair', 'latitude', 'longitude'), 
          q.polygon([12, 5], [20, 10], [34, 22])
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

  it('should do geo path query in json doc', function(done){
    dbWriter.documents.query(
      q.where(
        q.geospatial(
          q.geoPath('gElemChildParent/gElemChildPoint'), 
          q.latlon(12, 5)
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

  it('should do geo path query with pathIndex in json doc', function(done){
    dbWriter.documents.query(
      q.where(
        q.geospatial(
          q.geoPath(q.pathIndex('gElemChildParent/gElemChildPoint')), 
          q.point(12, 5)
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

  it('should do geo element pair query in xml doc', function(done){
    dbWriter.documents.query(
      q.where(
        q.geospatial(
          q.geoElementPair('gElemPair', 'latitude', 'longitude'), 
          q.latlon(50, 44)
        )
      )
    ).
    result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response.length.should.equal(1);
      response[0].uri.should.equal('/test/query/geo/doc4.xml');
      done();
    }, done);
  });

  it('should do geo element query in xml doc', function(done){
    dbWriter.documents.query(
      q.where(
        q.geospatial(
          q.geoElement('gElemPoint'), 
          q.latlon(50, 44)
        )
      )
    ).
    result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response.length.should.equal(1);
      response[0].uri.should.equal('/test/query/geo/doc4.xml');
      done();
    }, done);
  });

  it('should do geo attribute pair query in xml doc', function(done){
    dbWriter.documents.query(
      q.where(
        q.geospatial(
          q.geoAttributePair('gAttrPair', 'latitude', 'longitude'), 
          q.circle(100, 240, 144)
        )
      )
    ).
    result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response.length.should.equal(1);
      response[0].uri.should.equal('/test/query/geo/doc5.xml');
      done();
    }, done);
  });

  it('should delete all documents', function(done){
    dbAdmin.documents.removeAll({
      all: true
    }).
    result(function(response) {
      done();
    }, done);
  });

});
