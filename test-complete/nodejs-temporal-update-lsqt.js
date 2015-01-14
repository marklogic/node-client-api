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

var testlib    = require('../etc/test-lib.js');
var testconfig = require('../etc/test-config-qa.js');

var marklogic = require('../');

testconfig.manageAdminConnection.user     = "admin";
testconfig.manageAdminConnection.password = "admin";
var adminClient = marklogic.createDatabaseClient(testconfig.manageAdminConnection);
var adminManager = testlib.createManager(adminClient);

var db = marklogic.createDatabaseClient(testconfig.restWriterConnection);
var dbAdmin = marklogic.createDatabaseClient(testconfig.restAdminConnection);
var dbReader = marklogic.createDatabaseClient(testconfig.restReaderConnection);
var q = marklogic.queryBuilder;

var temporalCollectionName = 'temporalCollectionLsqt'
var updateCollectionName = 'updateCollection';


function validateData(response) {
  for (var i = 0; i < response.length; ++i) {
  // Make sure that system and valid times are what is expected
    //console.log("---------------------------------");
    //console.log(response[i]);

    systemStartTime = response[i].content.System.systemStartTime;
    systemEndTime = response[i].content.System.systemEndTime;
    //console.log("systemStartTime = " + systemStartTime);
    //console.log("systemEndTime = " + systemEndTime);
    
    validStartTime = response[i].content.Valid.validStartTime;
    validEndTime = response[i].content.Valid.validEndTime;
    //console.log("validStartTime = " + validStartTime);
    //console.log("validEndTime = " + validEndTime);


    var quality = response[i].quality;
    //console.log("Quality: " + quality);

    var permissions = response[i].permissions;
    
    if ((validStartTime.indexOf("2003-01-01T00:00:00") !== -1) && (validEndTime.indexOf("2008-12-31T23:59:59") !== -1)) {
      systemStartTime.should.containEql("2011-01-01T00:00:01");
      systemEndTime.should.containEql("9999-12-31T23:59:59");

      // This is the updated document
      // Permissions
      permissions.forEach(function(permission) {
        switch(permission['role-name']) {
          case 'app-user':
            permission.capabilities.length.should.equal(1);
            permission.capabilities[0].should.equal('read');
            break;
          case 'app-builder':
            permission.capabilities.length.should.equal(3);
            permission.capabilities.should.containEql('read');
            permission.capabilities.should.containEql('update');
            permission.capabilities.should.containEql('execute');
            break;
        }
      });
    }
    else  if ((validStartTime.indexOf("2001-01-01T00:00:00") !== -1) && (validEndTime.indexOf("2003-01-01T00:00:00") !== -1)) {
      systemStartTime.should.containEql("2011-01-01T00:00:01");
      systemEndTime.should.containEql("9999-12-31T23:59:59");

      permissions.forEach(function(permission) {
        switch(permission['role-name']) {
          case 'app-user':
            permission.capabilities.length.should.equal(1);
            permission.capabilities[0].should.equal('read');
            break;
          case 'app-builder':
            permission.capabilities.length.should.equal(2);
            permission.capabilities.should.containEql('read');
            permission.capabilities.should.containEql('update');
            break;
        }
      });
    }

/*****
      Iterator<String>  resCollections = metadataHandle.getCollections().iterator();
      while (resCollections.hasNext()) {
        String collection = resCollections.next();
        System.out.println("Collection = " + collection);
        
        if (!collection.equals(docId) &&
            !collection.equals(updateCollectionName) && 
            !collection.equals(temporalLsqtCollectionName)) {
          assertFalse("Collection not what is expected: " + collection, true);
        }
      }
      
      assertTrue("Properties should be empty", metadataHandle.getProperties().isEmpty());

      assertTrue("Document permissions difference in size value",
          actualPermissions.contains("size:3"));
      
      assertTrue("Document permissions difference in rest-reader permission",
          actualPermissions.contains("rest-reader:[READ]"));
      assertTrue("Document permissions difference in rest-writer permission",
          actualPermissions.contains("rest-writer:[UPDATE]"));
      assertTrue("Document permissions difference in app-user permission",
          (actualPermissions.contains("app-user:[") && actualPermissions.contains("READ") && 
           actualPermissions.contains("UPDATE")));
      assertFalse("Document permissions difference in app-user permission", actualPermissions.contains("EXECUTE"));
      
      assertEquals(quality, 99);
    }           

    if (validStartTime.contains("2001-01-01T00:00:00") && validEndTime.contains("2003-01-01T00:00:00")) {
      assertTrue("System start date check failed", (systemStartTime.contains("2011-01-01T00:00:01")));
      assertTrue("System start date check failed", (systemEndTime.contains("9999-12-31T23:59:59")));
      
      Iterator<String>  resCollections = metadataHandle.getCollections().iterator();
      while (resCollections.hasNext()) {
        String collection = resCollections.next();
        System.out.println("Collection = " + collection);
        
        if (!collection.equals(docId) &&
            !collection.equals(insertCollectionName) && 
            !collection.equals(temporalLsqtCollectionName)) {
          assertFalse("Collection not what is expected: " + collection, true);
        }
      }
      
      assertTrue("Properties should be empty", metadataHandle.getProperties().isEmpty());

      assertTrue("Document permissions difference in size value",
          actualPermissions.contains("size:3"));
      
      assertTrue("Document permissions difference in rest-reader permission",
          actualPermissions.contains("rest-reader:[READ]"));
      assertTrue("Document permissions difference in rest-writer permission",
          actualPermissions.contains("rest-writer:[UPDATE]"));
      assertTrue("Document permissions difference in app-user permission",
          (actualPermissions.contains("app-user:[") && actualPermissions.contains("READ") && 
           actualPermissions.contains("UPDATE") && actualPermissions.contains("EXECUTE")));
      
      assertEquals(quality, 11);
    }  
    
    if (validStartTime.contains("2008-12-31T23:59:59") && validEndTime.contains("2011-12-31T23:59:59")) {         
      // This is the latest document          
      assertTrue("System start date check failed", (systemStartTime.contains("2011-01-01T00:00:01")));
      assertTrue("System start date check failed", (systemEndTime.contains("9999-12-31T23:59:59")));          
      assertTrue("URI should be the doc uri ", record.getUri().equals(docId));

      Iterator<String>  resCollections = metadataHandle.getCollections().iterator();
      while (resCollections.hasNext()) {
        String collection = resCollections.next();
        System.out.println("Collection = " + collection);
        
        if (!collection.equals(docId) &&
            !collection.equals(insertCollectionName) && 
            !collection.equals(temporalLsqtCollectionName) &&
            !collection.equals(latestCollectionName)) {
          assertFalse("Collection not what is expected: " + collection, true);
        }
      }
              
      
      assertTrue("Document permissions difference in size value",
          actualPermissions.contains("size:3"));
      
      assertTrue("Document permissions difference in rest-reader permission",
          actualPermissions.contains("rest-reader:[READ]"));
      assertTrue("Document permissions difference in rest-writer permission",
          actualPermissions.contains("rest-writer:[UPDATE]"));
      assertTrue("Document permissions difference in app-user permission",
          (actualPermissions.contains("app-user:[") && actualPermissions.contains("READ") && 
           actualPermissions.contains("UPDATE") && actualPermissions.contains("EXECUTE")));

      assertEquals(quality, 11);
      
      validateMetadata(metadataHandle);
    }  
    
    if (validStartTime.contains("2001-01-01T00:00:00") && validEndTime.contains("2011-12-31T23:59:59")) {
      assertTrue("System start date check failed", (systemStartTime.contains("2010-01-01T00:00:01")));
      assertTrue("System start date check failed", (systemEndTime.contains("2011-01-01T00:00:01")));

      Iterator<String>  resCollections = metadataHandle.getCollections().iterator();
      while (resCollections.hasNext()) {
        String collection = resCollections.next();
        System.out.println("Collection = " + collection);
        
        if (!collection.equals(docId) &&
            !collection.equals(insertCollectionName) && 
            !collection.equals(temporalLsqtCollectionName)) {
          assertFalse("Collection not what is expected: " + collection, true);
        }
      }         
      
      assertTrue("Properties should be empty", metadataHandle.getProperties().isEmpty());

      assertTrue("Document permissions difference in size value",
          actualPermissions.contains("size:3"));
      
      assertTrue("Document permissions difference in rest-reader permission",
          actualPermissions.contains("rest-reader:[READ]"));
      assertTrue("Document permissions difference in rest-writer permission",
          actualPermissions.contains("rest-writer:[UPDATE]"));
      assertTrue("Document permissions difference in app-user permission",
          (actualPermissions.contains("app-user:[") && actualPermissions.contains("READ") && 
           actualPermissions.contains("UPDATE") && actualPermissions.contains("EXECUTE")));

      assertEquals(quality, 11);
    } 
    ***/  
  }
}








describe('Temporal update lsqt test', function() {
  
  var docuri = 'temporalDoc.json'; 
  var docuri2 = 'nonTemporalDoc.json';
 
  before(function(done) {
   adminManager.put({
      endpoint: '/manage/v2/databases/'+testconfig.testServerName+'/temporal/collections/lsqt/properties?collection=temporalCollectionLsqt',
      body: {
        "lsqt-enabled": true,
        "automation": {
          "enabled": true
        }
      }
    }).result(function(response){done();}, done);
  });

  it('should write the document content name', function(done) {
    db.documents.write({
      uri: docuri,
      collections: ['coll0', 'coll1'],
      temporalCollection: temporalCollectionName,
      contentType: 'application/json',
      quality: 10,
      permissions: [
        {'role-name':'app-user', capabilities:['read']},
        {'role-name':'app-builder', capabilities:['read', 'update']}
      ],
      properties: {prop1:'foo', prop2:25},
      content: {
        'System': {
          'systemStartTime' : "1999-01-01T00:00:00",  // THis value should not matter
          'systemEndTime' : "",
        },
        'Valid': {
          'validStartTime': "2001-01-01T00:00:00",
          'validEndTime': "2011-12-31T23:59:59"
        },
        'Address': "999 Skyway Park",
        'uri': "javaSingleDoc1.json",
        id: 12, 
        name: 'Jason'
      },
      systemTime: '2010-01-01T00:00:00'
    }
    ).result(function(response){done();}, done);
  });


  it('should update the document content name', function(done) {
   db.documents.write({
      uri: docuri,
      collections: [updateCollectionName],
      temporalCollection: temporalCollectionName,
      contentType: 'application/json',
      quality: 10,
      permissions: [
        {'role-name':'app-user', capabilities:['read']},
        {'role-name':'app-builder', capabilities:['read', 'update', 'execute']}
      ],
      properties: {prop1:'foo updated', prop2:50},
      content: {
        'System': {
          'systemStartTime' : "",
          'systemEndTime' : "",
        },
        'Valid': {
          'validStartTime': "2003-01-01T00:00:00",
          'validEndTime': "2008-12-31T23:59:59"
        },
        'Address': "888 Skyway Park",
        'uri': "javaSingleDoc1.json",
        id: 12, 
        name: 'Bourne'
      },
      systemTime: '2011-01-01T00:00:01'
    }).result(function(response){done();}, done);
  });


  it('should read the document content name', function(done) {
    db.documents.read({uris: docuri}).result(function(documents) {
      var document = documents[0];
      document.content.Address.should.equal('999 Skyway Park');
      done();
    }, done);
  });

  it('should read the document content id', function(done) {
    db.documents.read({uris: docuri, categories:['content']}).result(function(documents) {
      var document = documents[0];
      document.content.Valid.validStartTime.should.equal("2008-12-31T23:59:59");
      done();
    }, done);
  });

  it('should read the document quality (metadata) and content', function(done) {
    db.documents.read({uris: docuri, categories:['metadata', 'content']})
    .result(function(documents) {
      var document = documents[0];
      document.quality.should.equal(10);
      document.properties.prop1.should.equal('foo updated');  // properties do not travel with splits
      done();
    }, done);
  });

  it('should read the document collections', function(done) {
    db.documents.read({uris: docuri, categories:['metadata']}).result(function(documents) {
      var document = documents[0];
      var collCount = document.collections.length;
      collCount.should.equal(5);  // Should be coll0, coll1, temporalCollection, docUri and latest
      for (var i=0; i < collCount; i++) {
        var coll = document.collections[i];

        if (document.collections[i] !== temporalCollectionName && document.collections[i] !== 'coll0' &&
            document.collections[i] !== 'coll1' && document.collections[i] !== 'latest' &&
            document.collections[i] !== docuri) {
          //console.log("Invalid Collection: " + coll);
          should.equal(false, true);
        }
      }           
      done();
    }, done);
  });

  it('should read the document permissions', function(done) {
    db.documents.read({uris: docuri, categories:['metadata']}).result(function(documents) {
      var document = documents[0];
      var permissionsCount = 0;
      document.permissions.forEach(function(permission) {
        switch(permission['role-name']) {
          case 'app-user':
            permissionsCount++;
            permission.capabilities.length.should.equal(1);
            permission.capabilities[0].should.equal('read');
            break;
          case 'app-builder':
            permissionsCount++;
            permission.capabilities.length.should.equal(2);
            permission.capabilities.should.containEql('read');
            permission.capabilities.should.containEql('update');
            break;
        }
      });
      permissionsCount.should.equal(2);
      done();
    }, done);
  });

  it('should read multiple documents', function(done) {
    db.documents.read({uris: [docuri], categories:['content']}).result(function(documents) {
      documents[0].content.id.should.equal(12);
      done();
    }, done);
  });

  it('should read multiple documents with an invalid one', function(done) {
    db.documents.read({uris: [docuri, '/not/here/blah.json'], categories:['content']}).result(function(documents) {
      documents[0].content.id.should.equal(12);
      done();
    }, done);
  });


  it('should do collection query: col0', function(done) {
    db.documents.query(
      q.where(
        q.collection('coll0')
        )
      ).result(function(response) {
        response.length.should.equal(3);
        // response[0].content.id.should.equal('0026');
        // response[1].content.id.should.equal('0012');
        done();
      }, done);
  });

  it('should do collection query: col1', function(done) {
    db.documents.query(
      q.where(
        q.collection('coll1')
        )
      ).result(function(response) {
        response.length.should.equal(3);
        // response[0].content.id.should.equal('0026');
        // response[1].content.id.should.equal('0012');
        done();
      }, done);
  });

  it('should do collection query: updateCollection', function(done) {
    db.documents.query(
      q.where(
        q.collection(updateCollectionName)
        )
      ).result(function(response) {
        response.length.should.equal(1);
        // response[0].content.id.should.equal('0026');
        // response[1].content.id.should.equal('0012');
        done();
      }, done);
  });

  it('should do collection query: temporalCollectioLsqt', function(done) {
    db.documents.query(
      q.where(
        q.collection(temporalCollectionName)
        )
      ).result(function(response) {
        response.length.should.equal(4);
        // response[0].content.id.should.equal('0026');
        // response[1].content.id.should.equal('0012');
        done();
      }, done);
  });


  it(('should do collection query: ' + docuri), function(done) {
    db.documents.query(
      q.where(
        q.collection(docuri)
        )
      ).result(function(response) {
        response.length.should.equal(4);
        // response[0].content.id.should.equal('0026');
        // response[1].content.id.should.equal('0012');
        done();
      }, done);
  });

  it('should do collection query: latest', function(done) {
    db.documents.query(
      q.where(
        q.collection('latest')
        )
      ).result(function(response) {
        response.length.should.equal(1);
        // response[0].content.id.should.equal('0026');
        // response[1].content.id.should.equal('0012');
        done();
      }, done);
  });

  it('should do validate data', function(done) {
    db.documents.query(
      q.where(
        q.collection(docuri)
        ).withOptions({categories:['content', 'metadata']})
      ).result(function(response) {
        validateData(response);
        done();
      }, done);
  });

  it('should delete the document', function(done) {
    db.documents.remove({
      uri: docuri,
      temporalCollection: temporalCollectionName
    }).result(function(document) {

      done();
    }, done);
  });

  it('should read document by uri after delete', function(done) {
    db.documents.read({uris: [docuri], categories:['content']}).result(function(documents) {
      documents[0].content.id.should.equal(12);
      done();
    }, done);
  });

  /*after(function(done) {
   return adminManager.post({
      endpoint: '/manage/v2/databases/' + testconfig.testServerName,
      contentType: 'application/json',
      accept: 'application/json',
      body:   {'operation': 'clear-database'}
    }).result().then(function(response) {
      if (response >= 400) {
        console.log(response);
      } 
      done();
    }, function(err) {
      console.log(err); done();
    },
    done);
  });*/

  after(function(done) {
    dbAdmin.documents.removeAll({
      all: true
    }).
    result(function(response) {
      done();
    }, done);
  });

  /***
  after(function(done) {
   return adminManager.post({
      endpoint: '/manage/v2/databases/' + testconfig.testServerName,
      contentType: 'application/json',
      accept: 'application/json',
      body:   {'operation': 'clear-database'}
    }).result(function(response) {
      return adminManager.put({
        endpoint: '/manage/v2/databases/'+testconfig.testServerName+'/temporal/collections/lsqt/properties?collection=temporalCollectionLsqt',
        body: {
          "lsqt-enabled": true
        }
      }).result();
      done();
    }, done);
  });
***/

/***
  it('should delete the document', function(done) {
    db.documents.remove({
      uri: docuri,
      temporalCollection: temporalCollectionName
    }).result(function(document) {
      // Document by the docUri should exist
      document.exists.should.eql(true);
      done();
    }, done);
  });
***/
});
