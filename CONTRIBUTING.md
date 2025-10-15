# Contributing to the MarkLogic Node.js Client

This guide describes how to develop and test the Node.js Client. For questions about how to use the Node.js Client API,
please see the README file.


## Initial Setup

To run any of the steps below, first verify that you have the following available;
[sdkman](https://sdkman.io/) is recommended for installing and maintaining versions of Java:
* Java 17.x

You will also need to clone this repository locally and open a CLI in the root directory of the cloned project.

[Docker Desktop](https://www.docker.com/products/docker-desktop/) is recommended for automating and simplifying the setup for developing and testing the connector.
Without it, you can still deploy the test app to your local MarkLogic instance and run the tests, but it could cause
conflicts with other MarkLogic AppServers and/or databases.

If you are not using Docker, you can skip to the next section, the assumption being that you have a MarkLogic
instance available for testing.

If you are able to use Docker, run the following:

    docker-compose up -d --build

This will create a container with the MarkLogic service. The MarkLogic service will take a minute or two to initialize.
Point your browser to http://localhost:8001 to verify that the service is running and has been initialized. The default
username and password are in the docker-compose.yaml file in the /test-app directory.

Once the container is finished initializing, you need to deploy the test application to the MarkLogic service.
While still in the test-app directory run the following gradle command.

    cd test-app
    ./gradlew -i mlDeploy

Once the deploy has completed successfully, use "cd .." to return to the root directory of the project.


## Running the test suite

To run the tests contained in the project, you will need to install Mocha globally. This only needs to be done once.

    npm install mocha -g

Once Mocha has been installed, you can run the entire test suite with this command. This will take several minutes to complete.

    mocha test-basic -timeout 0

Alternatively, to run a single test or a single "describe" group of tests, use this command with the description text
contained in either the "it" function or the "describe" function, respectively.

    mocha test-basic -timeout 0 -g 'optic-update fromParam tests'
or

    mocha test-basic -timeout 0 -g 'test bindParam with qualifier'

There are also tests in the `test-complete` folder. The setup for these is more complicated and can 
be found in the `Jenkinsfile` file in this repository in the `runE2ETests` function.

## Notes on dependencies in package.json 

We are using @fastify/busboy because it has a forked copy of dicer that apparently does not 
have the same high security vulnerability that the 0.3.1 release of dicer has. 

