# MarkLogic Client for node.js

## Status

### Done for early access 2 (basic support)

* createDatabaseClient() including HTTPS
* documents.query()
    * queryBuilder.where()
    * queryBuilder.orderBy()
    * queryBuilder.calculate() - except constraint merge and optional datatypes
    * queryBuilder.slice()
    * queryBuilder.withOptions()
    * queryBuilder.parsedFrom()
    * queryBuilder.copyFrom()
    * QBE - except calculate() and orderBy()
* documents.check()
* documents.remove()
* documents.read()
* documents.createReadStream()
* documents.write()
* documents.createWriteStream()
* documents.removeAll()
* transactions.open()
* transactions.read()
* transactions.commit()
* transactions.rollback()
* config.transforms.list()
* config.transforms.read()
* config.transforms.remove()
* config.transforms.write()
* config.properties.read()
* config.properties.write()
* config.extlibs.list()
* config.extlibs.read()
* config.extlibs.remove()
* config.extlibs.write()
* optimistic locking

### To do for early access 2

* documents.patch() - working prior to native JSON cut-over except custom apply
* robust error handling, logging, and request tuning
* jsdoc

### Deferred to early access 3

* bulk conditional content
* queryBuilder.calculate() - values()
* queryBuilder.slice() - iterator (aka reducer)
