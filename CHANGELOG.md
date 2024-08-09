# CHANGELOG
## 3.5.0
#### New Functionality

- Can now use BM25 scoring method for searches. (MarkLogic Server version 12.0.0-EA or higher needed).
- Can now use vector functionality including Cosine Similarity and others. (MarkLogic Server version 12.0.0-EA or higher needed).

#### Bug Fix

- Fix for security vulnerabilities - https://nvd.nist.gov/vuln/detail/CVE-2024-4068 and https://github.com/advisories/GHSA-7fh5-64p2-3v2j
- [#669](https://github.com/marklogic/node-client-api/issues/669) - DatabaseClient.eval() always return true when the result is a boolean

## 3.4.0
#### New Functionality

- Can now connect to MarkLogic using OAuth token (MarkLogic Server version 11.2.0 or higher needed).
- Optic Update plans, including DSL queries that perform updates, now require `update: true` to be included in the options sent to the `rows.execute()` function. (MarkLogic Server version 11.2.0 or higher needed).
- Can now perform partial updates on documents via Optic using the new `patchBuilder` operator. (MarkLogic Server version 11.2.0 or higher needed).
- Can now capture errors from executing an Optic plan by including the new `onError` operator. (MarkLogic Server version 11.2.0 or higher needed).

#### Bug Fix

- Can now send bindings to Optic Server functions in the form of text.
- Fix for security vulnerabilities - https://github.com/advisories/GHSA-4gmj-3p3h-gm8h and https://github.com/advisories/GHSA-cgfm-xwp7-2cvr

## 3.3.1
#### Bug Fix

- Fixed a bug where a database property caused a problem when creating a URL path for querying ML.

## 3.3.0
#### New Functionality

- Can now request MarkLogic to compress the response for better performance using enableGzippedResponses (MarkLogic Server version 11.0.0 or higher needed).
- Can now send string input to cts.point and cts.polygon server functions (MarkLogic Server version 11.1.0 or higher needed).

## 3.2.0
#### New Functionality

- Can now set expiration duration for MarkLogic Cloud access-token.

#### Improvements and Bug Fixes

- Fix for security vulnerabilities - 
    https://github.com/advisories/GHSA-4q6p-r6v2-jvc5, 
    https://github.com/advisories/GHSA-c2qf-rxjj-qqgw and
    https://github.com/advisories/GHSA-7fh5-64p2-3v2j


## 3.1.0
#### New Functionality

- Can now perform update operations in Optic.
- Can now submit GraphQL queries.
- Auto-refresh expired token when using MarkLogic Cloud authentication.

#### Improvements and Bug Fixes

- Fix for security vulnerabilities.


## 3.0.0
#### New Functionality

- [#614](https://github.com/marklogic/node-client-api/issues/614) - Exporting Rows - queryAll api.
- [#644](https://github.com/marklogic/node-client-api/issues/644) - Reprocessing documents - transformAll and queryToTransformAll apis.
- [#665](https://github.com/marklogic/node-client-api/issues/665) - Deleting Documents  - removeAllUris and queryToRemoveAll api.
- Connect to MarkLogic Cloud using apiKey.

#### Improvements and Bug Fixes

- Fix for Dicer and other security vulnerabilities.
- [#540](https://github.com/marklogic/node-client-api/issues/540) - Expose total on all responses to documents.query.
- [#592](https://github.com/marklogic/node-client-api/issues/592) - Expose op:sample-by in Node Client API.
- [#694](https://github.com/marklogic/node-client-api/issues/694) - MarkLogic module v 2.9.1 for Node.js at Windows OS does not work.


## 2.9.1

#### Improvements and Bug Fixes

- Fix for security vulnerabilities (except Dicer).

## 2.9.0
#### New Functionality

- [#620](https://github.com/marklogic/node-client-api/issues/620) - Exporting Documents - readAll and queryToReadAll apis.
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
- [#270](https://github.com/marklogic/node-client-api/issues/270) - Calling methods on resources with arg list throws error.
- [#601](https://github.com/marklogic/node-client-api/issues/601) - Regenerate Optic expression functions.


## 2.7.0
#### New Functionality

- [#543](https://github.com/marklogic/node-client-api/issues/543) - Node-client-api now prefers ipv4 over ipv6.
- [#562](https://github.com/marklogic/node-client-api/issues/562) - CtsQueryBuilder is available.
- [#567](https://github.com/marklogic/node-client-api/issues/567) - Dynamic interface to Data Service endpoints.
- [#569](https://github.com/marklogic/node-client-api/issues/569) - Optic enhancements in 10.0-7 - Server release 10.0-7 or above required.

#### Improvements and Bug Fixes
- [#485](https://github.com/marklogic/node-client-api/issues/485) - Throw error when complexValues is set with a chunked stream.
- [#559](https://github.com/marklogic/node-client-api/issues/559) - Throw error on requests with a released client.
- [#565](https://github.com/marklogic/node-client-api/issues/565 ) - Node-client-api now uses Node - 14.
- [#568](https://github.com/marklogic/node-client-api/issues/568) - RejectUnauthorized option ignored in webpacked typescript (impacts mlxprs extension in latest VSCode on Mac).
- [#570](https://github.com/marklogic/node-client-api/issues/570) - (Documentation Fix) - Changed “testConnection” on DatabaseClient to “checkConnection”.
