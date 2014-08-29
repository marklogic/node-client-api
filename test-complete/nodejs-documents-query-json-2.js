/*
 * Copyright 2014 MarkLogic Corporation
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

var testconfig = require('../etc/test-config.js');

var marklogic = require('../');
var q = marklogic.queryBuilder;

var db = marklogic.createDatabaseClient(testconfig.restReaderConnection);
var dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);

describe('Document query test', function(){
  before(function(done){
    this.timeout(3000);
    dbWriter.documents.write({
      uri: '/test/query/bbq/bbq1.json',
      collections: ['bbq'],
      contentType: 'application/json',
      content: {
        title: 'Sally\'s Southern BBQ',
        abstract: 'A classic southern recipe',
        flavorDescriptor: ['cayanne', 'molasses', 'smoky'],
        scoville: 800,
        rating: 3.0 
        }
      }, { 
      uri: '/test/query/bbq/bbq2.json',
      collections: ['bbq'],
      contentType: 'application/json',
      content: {
        title: 'Red, Hot, and Blue',
        abstract: 'Texas-style sauce with extra heat',
        flavorDescriptor: ['habanero', 'black pepper', 'smoky'],
        scoville: 72000,
        rating: 4.0 
        }
      }, { 
      uri: '/test/query/bbq/bbq3.json',
      collections: ['bbq'],
      contentType: 'application/json',
      content: {
        title: 'Lousiana Bayou Mild',
        abstract: 'Straight from New Orleans, mild and sweet',
        flavorDescriptor: ['sweet', 'vinegar'],
        scoville: 750,
        rating: 5.0 
        }
      }, { 
      uri: '/test/query/bbq/bbq4.json',
      collections: ['bbq'],
      contentType: 'application/json',
      content: {
        title: 'Four little pigs',
        abstract: 'Southern Texas-style sauce with extreme heat',
        flavorDescriptor: ['habanero', 'black pepper', 'smoky', 'brown sugar'],
        scoville: 88000,
        rating: 5.0 
        }
      }, { 
      uri: '/test/query/bbq/bbq5.json',
      collections: ['bbq'],
      contentType: 'application/json',
      content: {
        title: 'Kansas City Apple Cinnamon',
        abstract: 'Specialty recipe made with real fruit and spices',
        flavorDescriptor: ['apple', 'cinnamon', 'brown sugar'],
        scoville: 1000,
        rating: 2.0 
        }
        }).
    result(function(response){done();}, done);
  });

  it('should do field query', function(done){
    db.query(
      q.where(
        q.range('scoville', 'moderate')
        ).
      calculate(
        q.facet('scoville',
          q.datatype('string'),
          q.bucket('mild', '<', 500),
          q.bucket('moderate', 500, '<', 2500),
          q.bucket('hot', 2500, '<', 8000),
          q.bucket('extraHot', 8000, '<')
        )
      )).result(function(response) {
        //response.length.should.equal(2);
        console.log(JSON.stringify(response, null, 4));
        done();
      }, done);
  });
});
