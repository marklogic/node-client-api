# MarkLogic Client for node.js

## Status

### Done for early access (basic support)

* createDatabaseClient() - except HTTPS
* documents.query()
    * queryBuilder.where() - except geospatial heatmap
    * queryBuilder.orderBy()
    * queryBuilder.calculate() - except custom constraint, constraint merge, values()
    * queryBuilder.slice() - except iterator / reducer
    * queryBuilder.withOptions() - except concurrencyLevel, forestName
    * queryBuilder.parsedFrom() - except bindDefault(), bindEmpty(), custom
    * queryBuilder.copyFrom()
* documents.check() - except version
* documents.remove()
* documents.read()
* documents.createReadStream() - including binary
* documents.write() - except JSON language, XML repair, server-assigned URI
* documents.createWriteStream() - including binary
* documents.patch() - except custom apply
* documents.removeAll()
* transactions.open()
* transactions.commit()
* transactions.rollback()

### To do for early access

* QBE - working prior to native JSON cut-over except calculate() and orderBy()
* optimistic locking / conditional content
* fragmentScope() in where() or on range, value, or word including applying parsed query to property fragment
* binary read, read range, query, and write
* robust error handling, logging, and request tuning
* jsdoc
