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
* documents.createReadStream()
* documents.write() - except JSON language, XML repair, binary metadata, binary range, server-assigned URI
* documents.createWriteStream()
* documents.removeAll()
* transactions.open()
* transactions.commit()
* transactions.rollback()
* config.transforms.list()
* config.transforms.read()
* config.transforms.remove()
* config.transforms.write()

### To do for early access

* optimistic locking / conditional content
* documents.patch() - working prior to native JSON cut-over except custom apply
* QBE - working prior to native JSON cut-over except calculate() and orderBy()
* fragmentScope() in where() or on range, value, or word including applying parsed query to property fragment
* robust error handling, logging, and request tuning
* jsdoc
