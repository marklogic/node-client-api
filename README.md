# MarkLogic Client for node.js

## Status

### Current basic support

* createDatabaseClient() - except HTTPS
* documents.query()
** queryBuilder.where() - except geospatial heatmap
** queryBuilder.orderBy()
** queryBuilder.calculate() - except custom constraint, constraint merge, values()
** queryBuilder.slice() - except iterator / reducer
** queryBuilder.withOptions() - except concurrencyLevel, forestName
** queryBuilder.parsedFrom() - except bindDefault(), bindEmpty(), custom
** QBE - except calculate() and orderBy()
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

* documents.check()
* queryBuilder.copyFrom()
* transforms on write requests (but not read)
* optimistic locking / conditional content
* fragmentScope() in where() or on range, value, or word including applying parsed query to property fragment
* binary read, read range, query, write, and write stream
* more robust error handling, logging, request tuning, and so on
* jsdoc
  