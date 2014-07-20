# MarkLogic Client for node.js

## Status

### Test and example setup and teardown

To set up the test and example database and REST server, execute
the following command in the root directory for the marklogic package:

    node etc/test-setup.js

To load the sample data before running the examples, execute

    node examples/before-load.js

To tear down the test and example database and REST server, execute

    node etc/test-teardown.js

### Done for early access 2 (basic document CRUD and query support)

* createDatabaseClient() including HTTPS
* documents.query()
    * queryBuilder.where() including builder structured query,
      queryBuilder.byExample() QBE (Query By Example), and
      queryBuilder.parsedFrom() string query
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
* documents.patch()
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

### Deferred to early access 3

* document.write() with Buffer or ReadableStream content in document descriptors 
* control over JSON conversion
* XML conversion
* optional datatypes for queries and facets
* robust error handling, logging, and request tuning
* bulk conditional content
* queryBuilder.calculate() - values()
* queryBuilder.slice() - iterator (aka reducer)
