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

## Explanation of overrides in package.json

Each override is being documented here so we have some ability in the future to remove an override as needed. 
These explanations have been copied from a Copilot analysis. 

braces: "3.0.3"
- Purpose: Fixes ReDoS vulnerability in brace expansion
- Affects: mocha, gulp, and test infrastructure
- Why needed: Older braces versions vulnerable to regex attacks
- CVE/Issue: CVE-2024-4068 - ReDoS vulnerability

brace-expansion: "2.0.2"
- Purpose: Fixes ReDoS in brace expansion patterns
- Affects: minimatch → brace-expansion
- Why needed: Prevents regex denial of service attacks
- CVE/Issue: Related to minimatch vulnerabilities

glob: "10.3.11"
- Purpose: Fixes ReDoS and security issues in file globbing
- Affects: mocha, gulp-mocha build tooling
- Why needed: Older glob versions have pattern matching vulnerabilities
- CVE/Issue: Multiple vulnerabilities in older glob versions

glob-parent: "6.0.2"
- Purpose: Fixes ReDoS in path parsing
- Affects: Transitive dependency through glob
- Why needed: Older versions vulnerable to regex attacks
- CVE/Issue: CVE-2020-28469 - ReDoS vulnerability

jsdoc: "4.0.0"
- Purpose: Fixes high-severity data access vulnerability in older jsdoc versions
- Affects: gulp-jsdoc3 → jsdoc
- Why needed: gulp-jsdoc3@3.0.0 uses older jsdoc with known vulnerabilities
- CVE/Issue: High severity vulnerability in taffydb (jsdoc dependency)

markdown-it: "14.1.0"
- Purpose: Use latest markdown parser for JSDoc
- Affects: gulp-jsdoc3 → jsdoc → markdown-it
- Why needed: Latest version (no vulnerabilities), handles RFC 7464 parsing
- Note: No newer version available, ensures consistency

minimatch: "5.1.0"
- Purpose: Fixes ReDoS (Regular Expression Denial of Service) vulnerability
- Affects: mocha, gulp-mocha, and other build tools
- Why needed: Older minimatch versions have catastrophic backtracking vulnerability
- CVE/Issue: CVE-2022-3517 - ReDoS vulnerability

sanitize-html: "2.17.0"
- Purpose: Ensure JSDoc template uses non-vulnerable HTML sanitizer
- Affects: gulp-jsdoc3 → ink-docstrap → sanitize-html
- Why needed: Older versions have XSS vulnerabilities
- Note: Also in devDependencies, override ensures transitive deps use safe version

semver: "7.5.3"
- Purpose: Fixes ReDoS in version parsing
- Affects: Multiple packages across dependency tree
- Why needed: Older semver versions have regex vulnerabilities
- CVE/Issue: CVE-2022-25883 - ReDoS vulnerability

tar-fs: "2.1.4"
- Purpose: Fixes directory traversal vulnerability
- Affects: kerberos → prebuild-install → tar-fs
- Why needed: Older tar-fs allows extracting files outside intended directory
- CVE/Issue: CVE-2024-28861 - Path traversal

tmp: "0.2.4"
- Purpose: Fixes arbitrary file write vulnerability
- Affects: gulp-jsdoc3 → jsdoc → tmp
- Why needed: Older tmp versions have file system security issues
- CVE/Issue: CVE-2024-28858 - Arbitrary file write

The following are related to this npm supply chain attack - https://orca.security/resources/blog/qix-npm-attack/ . 

ansi-styles: "4.3.0"
- Purpose: Protect against supply chain attack variants
- Affects: chalk → ansi-styles, eslint toolchain

ansi-regex: "5.0.1"
- Purpose: Protect against supply chain attack variants
- Affects: strip-ansi → ansi-regex

chalk: "4.1.2"
- Purpose: Avoid compromised chalk 5.6.1, maintain ESLint compatibility
- Affects: eslint, mocha, gulp-mocha
- Why needed: Chalk 5.6.1 was compromised in supply chain attack. ESLint 9.x requires chalk 4.x (incompatible with chalk 5.x API)

color-convert: "3.1.0"
- Purpose: Protect against supply chain attack variants
- Affects: ansi-styles → color-convert

color-name: "2.0.0"
- Purpose: Protect against supply chain attack variants
- Affects: color-convert → color-name

cross-spawn: "7.0.6"
- Purpose: Protect against supply chain attack variants
- Affects: eslint → cross-spawn

debug: "4.3.6"
- Purpose: Protect against supply chain attack variants
- Affects: eslint, mocha, multiple packages

supports-color: "7.2.0"
- Purpose: Protect against supply chain attack variants
- Affects: mocha, chalk

strip-ansi: "6.0.0"
- Purpose: Protect against supply chain attack variants
- Affects: mocha, cliui in test infrastructure

wrap-ansi: "6.2.0"
- Purpose: Protect against supply chain attack variants
- Affects: mocha → cliui → wrap-ansi

Also, we are using @fastify/busboy because it has a forked copy of dicer that apparently does not 
have the same high security vulnerability that the 0.3.1 release of dicer has. 

