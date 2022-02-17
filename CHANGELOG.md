# CHANGELOG

## 2.9.0
#### New Functionality

- [#620](https://github.com/marklogic/node-client-api/issues/620) - Exporting Documents - readAll api.
- [#622](https://github.com/marklogic/node-client-api/issues/622) - Collecting Document URIs - queryAll api.
- [#629](https://github.com/marklogic/node-client-api/issues/629) - Add a category option for reading only the contents of document(s).

#### Improvements and Bug Fixes

- [#599](https://github.com/marklogic/node-client-api/issues/599) - Optic fromSPARQL method support options parameter - Server release 10.0-8 or above required.
- [#638](https://github.com/marklogic/node-client-api/issues/638) - (Documentation Fix) - Parameters "start" and "length" for graphs.sparql are renamed to "begin" and "end".
- [#647](https://github.com/marklogic/node-client-api/issues/647) - QueryToReadAll on a Query with no results produces no response.


## 2.8.0
#### New Functionality

- [#621](https://github.com/marklogic/node-client-api/issues/621) - Data Movement in Node.js API - Ingesting Documents using writeAll api.

#### Improvements and Bug Fixes
- [#270](https://github.com/marklogic/node-client-api/issues/270) - Calling methods on resources with arg list throws error
- [#601](https://github.com/marklogic/node-client-api/issues/601) - Regenerate Optic expression functions


## 2.7.0
#### New Functionality

- [#543](https://github.com/marklogic/node-client-api/issues/543) - Node-client-api now prefers ipv4 over ipv6
- [#562](https://github.com/marklogic/node-client-api/issues/562) - CtsQueryBuilder is available
- [#567](https://github.com/marklogic/node-client-api/issues/567) - Dynamic interface to Data Service endpoints
- [#569](https://github.com/marklogic/node-client-api/issues/569) - Optic enhancements in 10.0-7 - Server release 10.0-7 or above required

#### Improvements and Bug Fixes
- [#485](https://github.com/marklogic/node-client-api/issues/485) - Throw error when complexValues is set with a chunked stream
- [#559](https://github.com/marklogic/node-client-api/issues/559) - Throw error on requests with a released client
- [#565](https://github.com/marklogic/node-client-api/issues/565 ) - Node-client-api now uses Node - 14
- [#568](https://github.com/marklogic/node-client-api/issues/568) - RejectUnauthorized option ignored in webpacked typescript (impacts mlxprs extension in latest VSCode on Mac)
- [#570](https://github.com/marklogic/node-client-api/issues/570) - (Documentation Fix) - Changed “testConnection” on DatabaseClient to “checkConnection”
