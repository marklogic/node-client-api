Examples for MarkLogic Client for node.js

Prerequisite:

Install MarkLogic Server, Node.js, and the MarkLogic Node.js API and its
dependencies.

The directory structure should be

      YOUR_PROJECT_DIRECTORY
          node_modules
              marklogic <--- current directory
                  doc
                  etc
                  examples
                  lib
                  node_modules
                  test-basic
                  test-complete

You setup the examples in the marklogic directory that contains the etc and
examples subdirectories.

Steps:

* If you want to use user names or passwords other than the default, edit

      etc/test-config.js

  Be careful not to change only the user names and passwords.

* Execute

      node examples/setup.js

  The script prompts for the MarkLogic admin user and password specified
  during installation of MarkLogic.

  The script creates the users if they don't exist yet, loads the sample data
  into the Documents database, and copies the example scripts into your
  project directory (the directory that contains node_modules/marklogic/examples).

* Change directories to your project directory.

* Run node on any example in any order.  For instance:

      node query-by-example.js

As an alternative, you can also run the examples from the marklogic directory
including executing all of the examples with examples/all.js; you can also
reload the sample data with examples/before-load.js
