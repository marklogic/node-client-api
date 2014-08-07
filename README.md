# MarkLogic Client API for node.js

The MarkLogic Client API for node.js provides access to the MarkLogic database
from node.js.

## Status

The MarkLogic node.js API is currently in Early Access Release 2.

### Getting started

Please see the instructions on the MarkLogic Early Access website:

http://ea.marklogic.com/features/node/

The instructions describe:

* installing the MarkLogic database and setting up an admin user
* cloning this repository to set up the API
* working through some initial examples to get familiar with the API

For more detail about the API, see the reference documentation:

http://docs-ea.marklogic.com:8011/jsdoc/index.html

### Example setup

To set up the REST users for the examples, execute the following
command in the root directory for the marklogic package:

    node etc/users-setup.js

Then, load the sample data:

    node examples/before-load.js

You can then execute any of the examples in the examples
subdirectory from the root directory for the marklogic package.

### Test setup and teardown

To set up the test database and REST server, execute the following
command in the root directory for the marklogic package:

    node etc/test-setup.js

To tear down the test database and REST server, execute

    node etc/test-teardown.js

### Capabilities of the node.js Client API in Early Access 2

* createDatabaseClient() including HTTPS
* documents.query()
    * queryBuilder.where() including structured query builder
    * queryBuilder.byExample() for QBE (Query By Example)
    * queryBuilder.parsedFrom() for string query
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

### Limitations in Early Access 2

The MarkLogic node.js Client API has not yet undergone performance or
stress testing.  The API should not be used in production in EA2.

### Candidate Features for Early Access 3

* projection from result documents
* values and tuples lists
* resource service CRUD and invocation
* server-side eval
* graph CRUD
* aggregates on facets
* specifying the database when creating a database client
* pluggable XML conversion
