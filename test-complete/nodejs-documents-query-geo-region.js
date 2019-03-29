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

var fs = require('fs');

var testconfig = require('../etc/test-config-qa.js');

var marklogic = require('../');
var q = marklogic.queryBuilder;

var db = marklogic.createDatabaseClient(testconfig.restReaderConnection);
var dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var dbAdmin = marklogic.createDatabaseClient(testconfig.restAdminConnection);

var geoDataFiles = [
  {
    uri:'/geo/region/test/Equator-json.json',
    collections:['/geo/region/test'],
    content:fs.createReadStream(__dirname + '/data/geo/Equator-json.json')
  },{
    uri:'/geo/region/test/North-Pole-json.json',
    collections:['/geo/region/test'],
    content:fs.createReadStream(__dirname + '/data/geo/North-Pole-json.json')
  },{
    uri:'/geo/region/test/Prime-Meridian-json.json',
    collections:['/geo/region/test'],
    content:fs.createReadStream(__dirname + '/data/geo/Prime-Meridian-json.json')
  },{
    uri:'/geo/region/test/South-More-json.json',
    collections:['/geo/region/test'],
    content:fs.createReadStream(__dirname + '/data/geo/South-More-json.json')
  },{
    uri:'/geo/region/test/Tropic-of-Cancer-json.json',
    collections:['/geo/region/test'],
    content:fs.createReadStream(__dirname + '/data/geo/Tropic-of-Cancer-json.json')
  },{
    uri:'/geo/region/test/International-Date-Line-json.json',
    collections:['/geo/region/test'],
    content:fs.createReadStream(__dirname + '/data/geo/International-Date-Line-json.json')
  },{
    uri:'/geo/region/test/North-West-json.json',
    collections:['/geo/region/test'],
    content:fs.createReadStream(__dirname + '/data/geo/North-West-json.json')
  },{
    uri:'/geo/region/test/South-East-json.json',
    collections:['/geo/region/test'],
    content:fs.createReadStream(__dirname + '/data/geo/South-East-json.json')
  },{
    uri:'/geo/region/test/South-Pole-json.json',
    collections:['/geo/region/test'],
    content:fs.createReadStream(__dirname + '/data/geo/South-Pole-json.json')
  },{
    uri:'/geo/region/test/Tropic-of-Capricorn-json.json',
    collections:['/geo/region/test'],
    content:fs.createReadStream(__dirname + '/data/geo/Tropic-of-Capricorn-json.json')
  },{
    uri:'/geo/region/test/Equator.xml',
    collections:['/geo/region/test'],
    content:fs.createReadStream(__dirname + '/data/geo/Equator.xml')
  },{
    uri:'/geo/region/test/North-Pole.xml',
    collections:['/geo/region/test'],
    content:fs.createReadStream(__dirname + '/data/geo/North-Pole.xml')
  },{
    uri:'/geo/region/test/Prime-Meridian.xml',
    collections:['/geo/region/test'],
    content:fs.createReadStream(__dirname + '/data/geo/Prime-Meridian.xml')
  },{
    uri:'/geo/region/test/South-More.xml',
    collections:['/geo/region/test'],
    content:fs.createReadStream(__dirname + '/data/geo/South-More.xml')
  },{
    uri:'/geo/region/test/Tropic-of-Cancer.xml',
    collections:['/geo/region/test'],
    content:fs.createReadStream(__dirname + '/data/geo/Tropic-of-Cancer.xml')
  },{
    uri:'/geo/region/test/International-Date-Line.xml',
    collections:['/geo/region/test'],
    content:fs.createReadStream(__dirname + '/data/geo/International-Date-Line.xml')
  },{
    uri:'/geo/region/test/North-West.xml',
    collections:['/geo/region/test'],
    content:fs.createReadStream(__dirname + '/data/geo/North-West.xml')
  },{
    uri:'/geo/region/test/South-East.xml',
    collections:['/geo/region/test'],
    content:fs.createReadStream(__dirname + '/data/geo/South-East.xml')
  },{
    uri:'/geo/region/test/South-Pole.xml',
    collections:['/geo/region/test'],
    content:fs.createReadStream(__dirname + '/data/geo/South-Pole.xml')
  },{
    uri:'/geo/region/test/Tropic-of-Capricorn.xml',
    collections:['/geo/region/test'],
    content:fs.createReadStream(__dirname + '/data/geo/Tropic-of-Capricorn.xml')
  }
];


describe('Document geo query test', function(){
  before(function(done){
    this.timeout(30000);
    dbWriter.documents.write(geoDataFiles).
    result(function(response){done();})
    .catch(done);
  });

  it('TEST 1 - geospatial region point contains point', function(done){
    dbWriter.documents.query(
      q.where(
        q.geospatialRegion(
          q.geoPath('/root/item/point'),
          'contains',
          //q.geoOptions('coordinate-system=wgs84'),
          q.point(0, -66.09375)
        )
      )
    ).
    result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response.length.should.equal(2);
      response[0].uri.should.equal('/geo/region/test/Equator.xml');
      response[1].uri.should.equal('/geo/region/test/Equator-json.json');
      done();
    }, done);
  });

  it('TEST 2 - geospatial region circle contains circle', function(done){
    dbWriter.documents.query(
      q.where(
        q.geospatialRegion(
          q.geoPath('/root/item/circle'),
          'contains',
          //q.geoOptions('coordinate-system=wgs84/double'),
          q.circle(6.897, q.point(0,-66.09375))
        )
      )
    ).
    result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response.length.should.equal(2);
      response[0].uri.should.equal('/geo/region/test/Equator.xml');
      response[1].uri.should.equal('/geo/region/test/Equator-json.json');
      //response[2].uri.should.equal('/geo/region/test/Prime-Meridian.xml');
      //response[3].uri.should.equal('/geo/region/test/Prime-Meridian-json.json');
      done();
    }, done);
  });

  it('TEST 3 - geospatial region box contains polygon', function(done){
    dbWriter.documents.query(
      q.where(
        q.geospatialRegion(
          q.geoPath('/root/item/box', q.coordSystem('wgs84/double')),
          'contains',
          q.polygon(q.point(-5, -70), q.point(4, -70), q.point(3, -60), q.point(-3, -65), q.point(-5, -70))
        )
      )
    ).
    result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response.length.should.equal(2);
      response[0].uri.should.equal('/geo/region/test/Equator.xml');
      response[1].uri.should.equal('/geo/region/test/Equator-json.json');
      done();
    }, done);
  });

  it('TEST 4 - geospatial region point intersects points', function(done){
    dbWriter.documents.query(
      q.where(
        q.geospatialRegion(
          q.geoPath('/root/item/point'),
          'intersects',
          q.point(83.229523, -34.453123)
        )
      )
    ).
    result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response.length.should.equal(2);
      response[0].uri.should.equal('/geo/region/test/North-Pole.xml');
      response[1].uri.should.equal('/geo/region/test/North-Pole-json.json');
      done();
    }, done);
  });

  it('TEST 5 - geospatial region polygon intersects box', function(done){
    dbWriter.documents.query(
      q.where(
        q.geospatialRegion(
          q.geoPath('/root/item/polygon'),
          'intersects',
          q.box(-5.45, -76.35643, 5.35, -54.636)
        )
      )
    ).
    result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response.length.should.equal(2);
      response[0].uri.should.equal('/geo/region/test/Equator.xml');
      response[1].uri.should.equal('/geo/region/test/Equator-json.json');
      done();
    }, done);
  });

  it('TEST 6 - geospatial region polygon intersects polygon', function(done){
    dbWriter.documents.query(
      q.where(
        q.geospatialRegion(
          q.geoPath('/root/item/polygon'),
          'intersects',
          q.polygon(
            [44.65, 88.64],
            [39.87, 97.74],
            [30.18, 101.1],
            [20.55, 102.32],
            [8.04, 104.9],
            [5.24, 91.9],
            [2.22, 83.42],
            [-5.91, 72.86],
            [5.98, 66.63],
            [8.21, 53.38],
            [20.14, 51.78],
            [29.88, 57.83],
            [41.82, 58.1],
            [43.27, 69.97],
            [47.15, 79.0],
            [44.65, 88.64]
          )
        )
      )
    ).
    result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response.length.should.equal(2);
      response[0].uri.should.equal('/geo/region/test/Tropic-of-Cancer-json.json');
      response[1].uri.should.equal('/geo/region/test/Tropic-of-Cancer.xml');
      done();
    }, done);
  });

  it('TEST 7 - geospatial region complex polygon intersects polygon', function(done){
    dbWriter.documents.query(
      q.where(
        q.geospatialRegion(
          q.geoPath('/root/item/complex-polygon'),
          'intersects',
          q.polygon(
            q.point(84, -37),
            q.point(83, -36.5),
            q.point(82, -36),
            q.point(84, -37)
          )
        )
      )
    ).
    result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response.length.should.equal(2);
      response[0].uri.should.equal('/geo/region/test/North-Pole.xml');
      response[1].uri.should.equal('/geo/region/test/North-Pole-json.json');
      //response[2].uri.should.equal('/geo/region/test/Prime-Meridian.xml');
      //response[3].uri.should.equal('/geo/region/test/Prime-Meridian-json.json');
      done();
    }, done);
  });

  it('TEST 8 - geospatial region point within polygon', function(done){
    dbWriter.documents.query(
      q.where(
        q.geospatialRegion(
          q.geoPath('/root/item/point'),
          'within',
          q.polygon(
            [40.13, -52.96],
            [40.45, -36.61],
            [38.16, -13.48],
            [21.09, -1.1],
            [0.0, -17.46],
            [-17.38, -12.52],
            [-33.08, -20.47],
            [-51.46, -28.61],
            [-65.33, -44.77],
            [-66.8, -66.0],
            [-53.99, -83.54],
            [-54.35, -105.49],
            [-24.59, -99.85],
            [-14.58, -110.86],
            [-0.0, -127.42],
            [13.44, -107.37],
            [35.78, -115.25],
            [53.21, -104.66],
            [48.69, -81.82],
            [55.37, -66.0],
            [40.13, -52.96]
          )
        )
      )
    ).
    result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response.length.should.equal(2);
      response[0].uri.should.equal('/geo/region/test/Equator.xml');
      response[1].uri.should.equal('/geo/region/test/Equator-json.json');
      done();
    }, done);
  });

  it('TEST 9 - geospatial region polygon covered by circle', function(done){
    dbWriter.documents.query(
      q.where(
        q.geospatialRegion(
          q.geoPath('/root/item/polygon'),
          'covered-by',
          q.circle(1200, q.point(83,-29.87))
        )
      )
    ).
    result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response.length.should.equal(2);
      response[0].uri.should.equal('/geo/region/test/North-Pole.xml');
      response[1].uri.should.equal('/geo/region/test/North-Pole-json.json');
      done();
    }, done);
  });

  it('TEST 10 - geospatial region polygon covers box', function(done){
    dbWriter.documents.query(
      q.where(
        q.geospatialRegion(
          q.geoPath('/root/item/polygon'),
          'covers',
          q.box(-5.45, -76.35643, 5.35, -54.636)
        )
      )
    ).
    result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response.length.should.equal(2);
      response[0].uri.should.equal('/geo/region/test/Equator.xml');
      response[1].uri.should.equal('/geo/region/test/Equator-json.json');
      done();
    }, done);
  });

  it('TEST 11 - geospatial region polygon overlaps box', function(done){
    dbWriter.documents.query(
      q.where(
        q.geospatialRegion(
          q.geoPath('/root/item/polygon'),
          'overlaps',
          q.box(80, -30, 88, -28)
        )
      )
    ).
    result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response.length.should.equal(2);
      response[0].uri.should.equal('/geo/region/test/North-Pole.xml');
      response[1].uri.should.equal('/geo/region/test/North-Pole-json.json');
      done();
    }, done);
  });

  it('TEST 12 - geospatial region point touches box', function(done){
    dbWriter.documents.query(
      q.where(
        q.geospatialRegion(
          q.geoPath('/root/item/point'),
          'touches',
          q.box(37.463235, 0, 40, 5)
        )
      )
    ).
    result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response.length.should.equal(2);
      response[0].uri.should.equal('/geo/region/test/Prime-Meridian.xml');
      response[1].uri.should.equal('/geo/region/test/Prime-Meridian-json.json');
      done();
    }, done);
  });

  it('TEST 13 - geospatial region point disjoint circle', function(done){
    dbWriter.documents.query(
      q.where(
        q.geospatialRegion(
          q.geoPath('/root/item/point', q.geoOptions(['coordinate-system=wgs84'])),
          'disjoint',
          q.circle(120.5, q.point(-26.797920, 136.406250))
        )
      )
    ).
    result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response.length.should.equal(10);
      done();
    }, done);
  });

  it('TEST 14 - geospatial region point equals point with options and fragment scope', function(done){
    dbWriter.documents.query(
      q.where(
        q.geospatialRegion(
          q.geoPath('/root/item/point', q.geoOptions(['coordinate-system=wgs84'])),
          'equals',
          q.point(0, -66.09374),
          q.geoOptions(['slope-factor=1']),
          q.fragmentScope(['documents'])
        )
      )
    ).
    result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response.length.should.equal(2);
      done();
    }, done);
  });

  it('TEST 15 - geospatial region circle within box', function(done){
    dbWriter.documents.query(
      q.where(
        q.geospatialRegion(
          q.geoPath('/root/item/circle', q.coordSystem('wgs84/double')),
          'within',
          q.box(-6, 30, 100, 150)
        )
      )
    ).
    result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response.length.should.equal(2);
      response[0].uri.should.equal('/geo/region/test/Tropic-of-Cancer-json.json');
      response[1].uri.should.equal('/geo/region/test/Tropic-of-Cancer.xml');
      done();
    }, done);
  });

  it('TEST 16 - geospatial region box covered-by polygon', function(done){
    dbWriter.documents.query(
      q.where(
        q.geospatialRegion(
          q.geoPath('/root/item/box', q.coordSystem('wgs84/double')),
          'covered-by',
          q.polygon(q.point(70, -50), q.point(90, 120), q.point(-10, 100), q.point(-20, -60), q.point(70,-50))
        )
      )
    ).
    result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response.length.should.equal(6);
      response[0].uri.should.equal('/geo/region/test/Tropic-of-Cancer-json.json');
      response[5].uri.should.equal('/geo/region/test/Prime-Meridian-json.json');
      done();
    }, done);
  });


  it('TEST 17 - geospatial region with properties fragment scope', function(done){
    dbWriter.documents.query(
      q.where(
        q.geospatialRegion(
          q.geoPath('/root/item/point', q.geoOptions(['coordinate-system=wgs84'])),
          'equals',
          q.point(0, -66.09374),
          q.geoOptions(['slope-factor=1']),
          q.fragmentScope('properties')
        )
      )
    ).
    result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response.length.should.equal(0);
      done();
    }, done);
  });

  it('TEST 18 - negative: invalid coordinate system', function(done){
    dbWriter.documents.query(
      q.where(
        q.geospatialRegion(
          q.geoPath('/root/item/box', q.coordSystem('invCoordSys')),
          'covered-by',
          q.polygon(q.point(70, -50), q.point(90, 120), q.point(-10, 100), q.point(-20, -60), q.point(70,-50))
        )
      )
    ).
    result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error) {
      //console.log(JSON.stringify(error, null, 2));
      error.body.errorResponse.message.should.containEql('Invalid coordinate system invCoordSys');
      done();
    });
  });

  it('TEST 19 - negative: invalid path', function(done){
    dbWriter.documents.query(
      q.where(
        q.geospatialRegion(
          q.geoPath('/root/item/inv', q.coordSystem('wgs84/double')),
          'covered-by',
          q.polygon(q.point(70, -50), q.point(90, 120), q.point(-10, 100), q.point(-20, -60), q.point(70,-50))
        )
      )
    ).
    result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error) {
      //console.log(JSON.stringify(error, null, 2));
      error.body.errorResponse.message.should.containEql('XDMP-GEOREGIONIDX-NOTFOUND');
      done();
    });
  });

  it('TEST 20 - negative: invalid operator', function(done){
    dbWriter.documents.query(
      q.where(
        q.geospatialRegion(
          q.geoPath('/root/item/box', q.coordSystem('wgs84/double')),
          'invalid',
          q.polygon(q.point(70, -50), q.point(90, 120), q.point(-10, 100), q.point(-20, -60), q.point(70,-50))
        )
      )
    ).
    result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error) {
      //console.log(JSON.stringify(error, null, 2));
      error.body.errorResponse.message.should.containEql('XDMP-INVGEOOP');
      done();
    });
  });

  it('TEST 21 - negative: invalid options', function(done){
    dbWriter.documents.query(
      q.where(
        q.geospatialRegion(
          q.geoPath('/root/item/box', q.coordSystem('wgs84/double')),
          'covered-by',
          q.polygon(q.point(70, -50), q.point(90, 120), q.point(-10, 100), q.point(-20, -60), q.point(70,-50)),
          q.geoOptions(['invalid-opt'])
        )
      )
    ).
    result(function(response) {
      //console.log(JSON.stringify(response, null, 2));
      response.should.equal('SHOULD HAVE FAILED');
      done();
    }, function(error) {
      //console.log(JSON.stringify(error, null, 2));
      error.body.errorResponse.message.should.containEql('Invalid option');
      done();
    });
  });

  it('TEST 22 - negative: invalid scope', function(done){
    try {
      dbWriter.documents.query(
        q.where(
          q.geospatialRegion(
            q.geoPath('/root/item/box', q.coordSystem('wgs84/double')),
            'covered-by',
            q.polygon(q.point(70, -50), q.point(90, 120), q.point(-10, 100), q.point(-20, -60), q.point(70,-50)),
            q.fragmentScope('invalidScope')
          )
        )
      )
      .should.equal('SHOULD HAVE FAILED');
      done();
    } catch(error) {
        //console.log(error.toString());
        var strErr = error.toString();
        strErr.should.equal('Error: invalid scope for fragment scope: string invalidScope');
        done();
    }
  });

  it('should delete all documents', function(done){
    this.timeout(5000);
    dbAdmin.documents.removeAll({
      collection: '/geo/region/test'
    }).
    result(function(response) {
      done();
    })
    .catch(done);
  });

});
