# MarkLogic Client for node.js

## Status

### Done for early access (basic support)

* createDatabaseClient() - except HTTPS
* documents.query()
** queryBuilder.where() - except geospatial heatmap
** queryBuilder.orderBy()
** queryBuilder.calculate() - except custom constraint, constraint merge, values()
** queryBuilder.slice() - except iterator / reducer
** queryBuilder.withOptions() - except concurrencyLevel, forestName
** queryBuilder.parsedFrom() - except bindDefault(), bindEmpty(), custom
** queryBuilder.copyFrom()
** QBE - except calculate() and orderBy()
* documents.check() - except version
* documents.remove()
* documents.read()
* documents.write() - except JSON language, XML repair, server-assigned URI
* documents.createWriteStream()
* documents.patch() - except custom apply
* documents.removeAll()
* transactions.open()
* transactions.commit()
* transactions.rollback()


### To do for early access

* transforms on write requests (but not read)
* optimistic locking / conditional content
* fragmentScope() in where() or on range, value, or word including applying parsed query to property fragment
* binary read, read range, query, write, and write stream
* robust error handling, logging, and request tuning
* jsdoc
  