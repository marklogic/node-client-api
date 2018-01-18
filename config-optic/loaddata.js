'use strict';

var fs = require('fs');

var moduleFiles = [
    {
      uri:'/optic/view/test/masterDetail.tdex',
      collections:['http://marklogic.com/xdmp/tde'],
      contentType:'application/vnd.marklogic-tde+xml',
      content:fs.createReadStream('./config-optic/qa-data/masterDetail.tdex')
    },
    {
      uri:'/optic/view/test/masterDetail2.tdej',
      collections:['http://marklogic.com/xdmp/tde'],
      contentType:'application/vnd.marklogic-tde+json',
      content:fs.createReadStream('./config-optic/qa-data/masterDetail2.tdej')
    },
    {
      uri:'/optic/view/test/masterDetail3.tdej',
      collections:['http://marklogic.com/xdmp/tde'],
      contentType:'application/vnd.marklogic-tde+json',
      content:fs.createReadStream('./config-optic/qa-data/masterDetail3.tdej')
    },
    {
      uri:'/optic/view/test/masterDetail4.tdej',
      collections:['http://marklogic.com/xdmp/tde'],
      contentType:'application/vnd.marklogic-tde+json',
      content:fs.createReadStream('./config-optic/qa-data/masterDetail4.tdej')
    },
    {
      uri:'/optic/test/mapperReducer.sjs',
      contentType:'application/vnd.marklogic-javascript',
      content:fs.createReadStream('./config-optic/qa-data/mapperReducer.sjs')
    }
];

var dataFiles = [
    {
      uri:'/optic/view/test/masterDetail.xml',
      collections:['/optic/view/test'],
      content:fs.createReadStream('./config-optic/qa-data/masterDetail.xml')
    },{
      uri:'/optic/view/test/masterDetail2.json',
      collections:['/optic/view/test'],
      content:fs.createReadStream('./config-optic/qa-data/masterDetail2.json')
    },{
      uri:'/optic/view/test/masterDetail3.json',
      collections:['/optic/view/test'],
      content:fs.createReadStream('./config-optic/qa-data/masterDetail3.json')
    },{
      uri:'/optic/view/test/masterDetail4.json',
      collections:['/optic/view/test'],
      content:fs.createReadStream('./config-optic/qa-data/masterDetail4.json')
    },{
      uri:'/optic/view/test/masterDetail5.json',
      collections:['/optic/view/test'],
      content:fs.createReadStream('./config-optic/qa-data/masterDetail5.json')
    },{
      uri:'/optic/triple/test/playerTripleSet.xml',
      collections:['/optic/player/triple/test'],
      content:fs.createReadStream('./config-optic/qa-data/playerTripleSet.xml')
    },{
      uri:'/optic/triple/test/teamTripleSet.xml',
      collections:['/optic/team/triple/test'],
      content:fs.createReadStream('./config-optic/qa-data/teamTripleSet.xml')
    },{
      uri:'/optic/triple/test/duplicatePlayerTripleSet.xml',
      collections:['/optic/player/triple/test'],
      content:fs.createReadStream('./config-optic/qa-data/playerTripleSet.xml')
    },{
      uri:'/optic/triple/test/duplicateTeamTripleSet.xml',
      collections:['/optic/team/triple/test'],
      content:fs.createReadStream('./config-optic/qa-data/teamTripleSet.xml')
    },{
      uri:'/optic/triple/test/otherPlayerTripleSet.xml',
      collections:['/optic/other/player/triple/test'],
      content:fs.createReadStream('./config-optic/qa-data/otherPlayerTripleSet.xml')
    },{
      uri:'/optic/lexicon/test/doc1.json',
      collections:['/optic/lexicon/test', '/other/coll1', '/other/coll2'],
      content:fs.createReadStream('./config-optic/qa-data/doc1.json') 
    },{
      uri:'/optic/lexicon/test/doc2.json',
      collections:['/optic/lexicon/test'],
      content:fs.createReadStream('./config-optic/qa-data/doc2.json') 
    },{
      uri:'/optic/lexicon/test/doc3.json',
      collections:['/optic/lexicon/test'],
      content:fs.createReadStream('./config-optic/qa-data/doc3.json') 
    },{
      uri:'/optic/lexicon/test/doc4.xml',
      collections:['/optic/lexicon/test'],
      content:fs.createReadStream('./config-optic/qa-data/doc4.xml') 
    },{
      uri:'/optic/lexicon/test/doc5.xml',
      collections:['/optic/lexicon/test'],
      content:fs.createReadStream('./config-optic/qa-data/doc5.xml') 
    },{
      uri:'/optic/lexicon/test/city1.json',
      collections:['/optic/lexicon/test'],
      content:fs.createReadStream('./config-optic/qa-data/city1.json') 
    },{
      uri:'/optic/lexicon/test/city2.json',
      collections:['/optic/lexicon/test'],
      content:fs.createReadStream('./config-optic/qa-data/city2.json') 
    },{
      uri:'/optic/lexicon/test/city3.json',
      collections:['/optic/lexicon/test'],
      content:fs.createReadStream('./config-optic/qa-data/city3.json') 
    },{
      uri:'/optic/lexicon/test/city4.json',
      collections:['/optic/lexicon/test'],
      content:fs.createReadStream('./config-optic/qa-data/city4.json') 
    },{
      uri:'/optic/lexicon/test/city5.json',
      collections:['/optic/lexicon/test'],
      content:fs.createReadStream('./config-optic/qa-data/city5.json') 
    },{
      uri:'/optic/plan/test/planViews.json',
      collections:['/optic/plan/test'],
      content:fs.createReadStream('./config-optic/qa-data/planViews.json') 
    },{
      uri:'/optic/plan/test/planLexicons.json',
      collections:['/optic/plan/test'],
      content:fs.createReadStream('./config-optic/qa-data/planLexicons.json') 
    },{
      uri:'/optic/plan/test/planTriples.json',
      collections:['/optic/plan/test'],
      content:fs.createReadStream('./config-optic/qa-data/planTriples.json') 
    }];

var graphFiles1 = [
  { 
    uri: '/optic/sparql/test/people.ttl',
    contentType: 'text/turtle',
    data: fs.createReadStream('./config-optic/qa-data/people.ttl')
  }
];

var graphFiles2 = [
  { 
    uri: '/optic/sparql/test/companies.ttl',
    contentType: 'text/turtle',
    data: fs.createReadStream('./config-optic/qa-data/companies_100.ttl')
  }
];

function writeDocuments(db) {
  return db.documents.write(dataFiles);  	
}

function writeDocumentsToMod(db) {
  return db.documents.write(moduleFiles);  	
}

function writeGraphs1(db) {
  return db.graphs.write(graphFiles1);  	
}

function writeGraphs2(db) {
  return db.graphs.write(graphFiles2);  	
}

module.exports = {
  writeDocuments: writeDocuments,
  writeDocumentsToMod: writeDocumentsToMod,
  writeGraphs1: writeGraphs1,
  writeGraphs2: writeGraphs2
};
