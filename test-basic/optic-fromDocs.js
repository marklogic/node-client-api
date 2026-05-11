/*
* Copyright (c) 2015-2026 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
'use strict';

const should = require('should');

const marklogic = require('../');
const op = marklogic.planBuilder;

const pbb = require('./plan-builder-base');
var testconfig = require('../etc/test-config.js');
const execPlan = pbb.execPlan;
const getResults = pbb.getResults;
var db = marklogic.createDatabaseClient(testconfig.restWriterConnection);
const Stream = require('stream');
const testlib = require("../etc/test-lib");
let result = new Set();
let uris = [];
let serverConfiguration = {};

describe('optic-update fromDocs tests', function() {
    // NOTE: op.fromDocs() with op.columnBuilder() is only supported in MarkLogic 12.1.0 and later.
    // Tests in this suite are skipped automatically on earlier versions.

    this.timeout(15000);
    before(function (done) {
        try {
            testlib.findServerConfiguration(serverConfiguration);
            setTimeout(()=>{done();}, 3000);
        } catch(error){
            done(error);
        }
    });

    describe('fromDocs', function () {

        before(function (done) {
            if (serverConfiguration.serverVersion < 12.1) {
                this.skip();
                return;
            }
            // Insert test documents
            const testDocs = [
                {
                    uri: '/test/fromDocs/artist-incomplete.json',
                    contentType: 'application/json',
                    content: {
                        artist: {
                            firstName: "Charlie",
                            lastName: "Parker",
                            // birthDate is missing - will test default value
                            instrument: "saxophone"
                            // genre is missing - will test default value
                        }
                    }
                },
                {
                    uri: '/test/fromDocs/product-widget.json',
                    contentType: 'application/json',
                    content: {
                        product: {
                            name: "Widget",
                            price: 25.50,
                            quantity: 100
                        }
                    }
                },
                {
                    uri: '/test/fromDocs/location-seattle.json',
                    contentType: 'application/json',
                    collections: ['fromDocs'],
                    content: {
                        location: {
                            city: "Seattle",
                            point: "47.61, -122.33",
                            description: "Emerald City"
                        }
                    }
                },
                {
                    // we already have a geospatial element index for 'point' in wgs84
                    // in the test-app ml-gradle project. Use that.  Use 'point' to indicate location.
                    uri: '/test/fromDocs/location-portland.json',
                    contentType: 'application/json',
                    collections: ['fromDocs'],
                    content: {
                        location: {
                            city: "Portland",
                            point: "45.52, -122.68",
                            description: "City of Roses"
                        }
                    }
                },
                {
                    uri: '/test/fromDocs/location-san-francisco.json',
                    contentType: 'application/json',
                    collections: ['fromDocs'],
                    content: {
                        location: {
                            city: "San Francisco",
                            point: "37.77, -122.42",
                            description: "City by the Bay"
                        }
                    }
                },
                {
                    uri: '/test/fromDocs/location-new-york.json',
                    contentType: 'application/json',
                    collections: ['fromDocs'],
                    content: {
                        location: {
                            city: "New York",
                            point: "40.71, -74.01",
                            description: "The Big Apple"
                        }
                    }
                },
                {
                    // Bob and Alice are already loaded by ml-gradle test app
                    uri: '/test/fromDocs/person-donald.json',
                    contentType: 'application/json',
                    content: {
                        person: {
                            name: "Donald",
                            summary: "Bad Donald",
                            embedding: [
                                -1.1,
                                -2.2,
                                -3.3
                            ]
                        }
                    }
                }
            ];

            let readable = new Stream.Readable({objectMode: true});
            testDocs.forEach(doc => {
                readable.push(doc);
                uris.push(doc.uri);
            });
            readable.push(null);

            db.documents.writeAll(readable, {
                onCompletion: () => done()
            });
        });

        after(function (done) {
            if (uris.length > 0) {
                db.documents.remove(uris)
                    .result(() => done())
                    .catch(done);
            } else {
                done();
            }
        });

        it('fromDocs basic', function (done) {
            const plan = op.fromDocs(
                    op.cts.wordQuery('Coltrane'),
                    '/musician',
                    op.columnBuilder()
                        .addColumn('lastName').xpath('./lastName').type('string')
                        .addColumn('firstName').xpath('./firstName').type('string')
                        .addColumn('dob').xpath('./dob').type('string')
                        .addColumn('instrument').xpath('./instrument').type('string'),
                    "MyView"
                );
            execPlan(plan).then(function (response) {
                const output = getResults(response);
                output.length.should.equal(1);
                output[0]['MyView.lastName'].value.should.equal('Coltrane');
                output[0]['MyView.firstName'].value.should.equal('John');
                output[0]['MyView.dob'].value.should.equal('1926-09-23');
                output[0]['MyView.instrument'].value.should.equal('saxophone');
                done();
            }).catch(done);
        });

        it('fromDocs with default', function (done) {
            const plan = op.fromDocs(
                    op.cts.wordQuery('Parker'),
                    '/artist',
                    op.columnBuilder()
                        .addColumn('lastName').xpath('./lastName').type('string').collation('http://marklogic.com/collation/')
                        .addColumn('firstName').xpath('./firstName').type('string').collation('http://marklogic.com/collation/')
                        .addColumn('birthDate').xpath('./birthDate').type('string').default('Unknown')
                        .addColumn('instrument').xpath('./instrument').type('string')
                        .addColumn('genre').xpath('./genre').type('string').default('Jazz'),
                    "ArtistView"
                );
            execPlan(plan).then(function (response) {
                const output = getResults(response);
                output.length.should.equal(1);
                output[0]['ArtistView.lastName'].value.should.equal('Parker');
                output[0]['ArtistView.firstName'].value.should.equal('Charlie');
                output[0]['ArtistView.birthDate'].value.should.equal('Unknown');
                output[0]['ArtistView.instrument'].value.should.equal('saxophone');
                output[0]['ArtistView.genre'].value.should.equal('Jazz');
                done();
            }).catch(done);
        });

        it('fromDocs with expr', function (done) {
            const plan = op.fromDocs(
                    op.cts.wordQuery('Widget'),
                    '/product',
                    op.columnBuilder()
                        .addColumn('name').xpath('./name').type('string')
                        .addColumn('price').xpath('./price').type('decimal')
                        .addColumn('quantity').xpath('./quantity').type('integer')
                        .addColumn('twoToTheThirdPower').nullable(true)
                            .expr(op.math.pow(2, 3))
                            .type('integer'),
                    "ProductView"
                );
            execPlan(plan).then(function (response) {
                const output = getResults(response);
                output.length.should.equal(1);
                output[0]['ProductView.name'].value.should.equal('Widget');
                output[0]['ProductView.price'].value.should.equal(25.50);
                output[0]['ProductView.quantity'].value.should.equal(100);
                output[0]['ProductView.twoToTheThirdPower'].value.should.equal(8);
                done();
            }).catch(done);
        });

        it('fromDocs with op.context() and op.xpath()', function (done) {
            const plan = op.fromDocs(
                    op.cts.wordQuery('Widget'),
                    '/product',
                    op.columnBuilder()
                        .addColumn('name').xpath('./name').type('string')
                        .addColumn('quantity').xpath('./quantity').type('integer')
                        .addColumn('price').xpath('./price').type('decimal')
                        .addColumn('totalCost').nullable(true)
                            .expr(op.multiply(
                                    op.xs.decimal(op.xpath(op.context(), './price')),
                                    op.xs.integer(op.xpath(op.context(), './quantity'))
                                )
                            )
                            .type('decimal'),
                    "ProductView"
                );
            execPlan(plan).then(function (response) {
                const output = getResults(response);
                output.length.should.equal(1);
                output[0]['ProductView.name'].value.should.equal('Widget');
                output[0]['ProductView.price'].value.should.equal(25.50);
                output[0]['ProductView.quantity'].value.should.equal(100);
                output[0]['ProductView.totalCost'].value.should.equal(2550);
                done();
            }).catch(done);
        });

        it('fromDocs with geospatial query', function (done) {

            const portlandPoint = op.cts.point(45.52, -122.68);
            const searchRadius = 650; // miles
            // geospatial element index is defined for 'point' in wgs84
            const plan = op.fromDocs(
                    op.cts.collectionQuery('fromDocs'),
                    '/location',
                    op.columnBuilder()
                        .addColumn('city').xpath('./city').type('string')
                        .addColumn('location-wgs84').xpath('./point').type('point').coordinateSystem('wgs84')
                        .addColumn('description').xpath('./description').type('string'),
                    "LocationView"
                )
                .where(
                    op.cts.jsonPropertyGeospatialQuery
                    (
                        'point',
                        op.cts.circle(searchRadius, portlandPoint),
                        ['coordinate-system=wgs84']
                    )
                );

            execPlan(plan).then(function (response) {
                const output = getResults(response);
                output.length.should.be.equal(3);
                const cities = output.map(row => row['LocationView.city'].value);
                cities.should.containEql('Portland');
                cities.should.containEql('Seattle');
                cities.should.containEql('San Francisco');
                cities.should.not.containEql('New York');
                done();
            }).catch(done);
        });

        it('fromDocs with vector and dimension', function (done) {

            const testVector = op.vec.vector([1,2,3]);
            const plan = op.fromDocs(
                    op.cts.wordQuery('*'),
                    '/person',
                    op.columnBuilder()
                        .addColumn('name').xpath('./name').type('string')
                        .addColumn('summary').xpath('./summary').type('string')
                        .addColumn('embedding').xpath('vec:vector(./embedding)').type('vector').dimension(3)
                        .addColumn('cosineDistance').nullable(true).expr(
                            op.vec.cosineDistance
                            (
                                op.vec.vector(testVector),
                                op.vec.vector(op.xpath(op.context(), './embedding'))
                            )
                        ).type('double')
                        .addColumn('euclideanDistance').nullable(true).expr(
                            op.math.trunc(
                                op.vec.euclideanDistance
                                (
                                    op.vec.vector(testVector),
                                    op.vec.vector(op.xpath(op.context(), './embedding'))
                                )
                            , 4)
                        ).type('double')
                        ,
                    "PersonView"
                ).where(
                    op.lt(
                        op.vec.cosineDistance
                        (
                            op.vec.vector(testVector),
                            op.viewCol('PersonView', 'embedding')
                        )
                        ,
                        op.xs.double(0.5)
                    )
                )
                .orderBy(op.viewCol('PersonView', 'euclideanDistance'));

            execPlan(plan).then(function (response) {
                const output = getResults(response);
                output.length.should.be.equal(2);
                const distances = output.map(row => row['PersonView.euclideanDistance'].value);
                distances[0].should.be.approximately(0.3741, 0.0001); // Alice is .3741 from testVector
                distances[1].should.be.approximately(12.1466, 0.0001); // Bob is 12.1466 from testVector
                const names = output.map(row => row['PersonView.name'].value);
                names.should.containEql('Alice');
                names.should.containEql('Bob');
                names.should.not.containEql('Donald');
                done();
            }).catch(done);
        });


    });
});
