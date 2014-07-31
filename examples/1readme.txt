Examples for MarkLogic Client for node.js

Prerequisite:

Install MarkLogic Server, Node.js, and the MarkLogic Node.js API and
  its module dependencies.

Steps:

Execute all commands in the parent directory that contains the examples
  and etc subdirectories.

* Set up the REST users:

  node etc/users-setup.js

  The script prompts for the MarkLogic admin user and password specified
  during installation of MarkLogic.  As an alternative, you can provide
  the -u adminUser:adminPassword command-line argument.

  If the users already exist, the script reports that.

* Load the example data into the database:

  node examples/before-load.js

* Run node on any example in any order.
