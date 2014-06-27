# MarkLogic Client for node.js

## Status

### Done for early access 2 (basic document CRUD and query support)

* createDatabaseClient() including HTTPS
* documents.query()
    * queryBuilder.where() including built query, QBE, and parsedFrom() string query
    * queryBuilder.orderBy()
    * queryBuilder.calculate()
    * queryBuilder.slice()
    * queryBuilder.withOptions()
    * queryBuilder.parsedFrom()
    * queryBuilder.copyFrom()
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

* documents.patch() - including custom apply
* optional datatypes for queries and facets
* HTTP errors as instance of Error
* robust error handling, logging, and request tuning
* jsdoc
* examples

### Deferred to early access 3

* calculate and and orderBy clauses with QBE for where clause
* bulk conditional content
* queryBuilder.calculate() - values()
* queryBuilder.slice() - iterator (aka reducer)
