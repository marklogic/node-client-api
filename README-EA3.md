#Capabilities added to the Node.js Client API in version 2.0 Early Access 3

##Geospatial Region Search

Early Access 3 supports new types of geospatial search based on a new region index. Users can load documents that include region definitions and define region indexes for those documents. Users can then perform searches for the regions in those documents based on relationships to other points and regions. For example:

- Give me all the documents with regions that contain a specific point.
- Give me all the documents with regions that overlap another region.

The API support 10 types of spatial relationships among points and regions:

- equals
- disjoint
- touches
- contains
- covers
- intersects
- within
- covered-by
- crosses
- overlaps

When building a query for geospatial region searches, use the following method:

- queryBuilder.geospatialRegion()

##Double Precision Values For Geospatial Queries

Early Access 3 improves the precision of geospatial queries by supporting double-precision floating point values in geospatial indexes. You can specify whether to use the double (or single) precision version of an index when performing a geospatial query by specifying a coordinate-system value as a geospatial option. For example:
```
q.geospatial(
 q.geoPropertyPair('point', 'latitude', 'longitude'),
 q.geoOptions('coordinate-system=wgs84/double'),
 q.point(q.latlon(lat, lon))
)
```
Supported coordinate-system values:
- wgs84
- wgs84/double
- etrs89
- etrs89/double
- raw
- raw/double

##Kerberos Authentication

The Node.js Client API can now access Kerberos-secured MarkLogic application servers. Kerberos provides single sign-on access to network resources based on time-sensitive tickets issued via a trusted third-party Key Distribution Center.

To specify that a Node.js Client database connection use Kerberos authentication, you set the authType property to "kerberos", for example:
```
marklogic.createDatabaseClient({
  database: "MyDatabase",
  host: "myhost.example.com",
  port: 8010,
  authType: "kerberos"
});
```
The Node.js Client API uses the [kerberos](https://www.npmjs.com/package/kerberos) module to support authentication and requires (on Linux/OS X):

- [MIT Kerberos](http://web.mit.edu/kerberos/dist/) (for communicating with the Key Distribution Center)
- gcc and g++
- Python 2.7
- [node-gyp](https://github.com/nodejs/node-gyp)

Windows requires additional libraries. See the [kerberos documentation](https://www.npmjs.com/package/kerberos) for details.

##Metadata Values

Metadata values are a new type of document metadata, joining collections, properties, permissions, and quality. A metadata value consists of a string key and a string value. Metadata values are similar to metadata properties, with some important differences:

- Metadata values are stored in the same document as the content, not as a separate document
- Metadata values cannot have a complex, nested structure (strings only)

Write a document that includes metadata values:
```
db.documents.write({
  uri: 'lincoln.json',
  contentType: 'application/json',
  collections: ['president'],
  metadataValues: {
    'birth': '1809-02-12',
    'death': '1865-04-15',
    'birthplace': 'Kentucky'
    },
  content: {
    'first': 'Abraham',
    'last': 'Lincoln'
  }
})
```
Read a document's metadata values:
```
db.documents.read({
  uris:uri,
  categories:['metadataValues']
})
```
You can also patch a document to update its metadata values with the following methods:

- patchBuilder.metadataValues.add()
- patchBuilder.metadataValues.replace()
- patchBuilder.metadataValues.remove()
