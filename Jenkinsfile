@Library('shared-libraries') _

def runTests() {
  sh label: 'deploy-test-app-and-run-tests', script: '''
		export JAVA_HOME=$JAVA_HOME_DIR
		export GRADLE_USER_HOME=$WORKSPACE/$GRADLE_DIR
		export PATH=$JAVA_HOME/bin:${NODE_HOME_DIR}/bin:$PATH
		cd node-client-api
		node --version
		npm --version
		npm ci

		cd test-app
		./gradlew -i mlTestConnections
		./gradlew -i mlDeploy

		cd ..
		rm -rf $WORKSPACE/*.xml || true
		./node_modules/.bin/mocha --timeout 10000 -R xunit test-basic/ --reporter mocha-junit-reporter --reporter-options mochaFile=$WORKSPACE/test-basic-reports.xml || true
		./node_modules/.bin/gulp setupProxyTests || true
		./node_modules/.bin/mocha --timeout 10000 -R xunit test-basic-proxy/lib/**/*.js --reporter mocha-junit-reporter --reporter-options mochaFile=$WORKSPACE/test-basic-proxy-reports.xml || true
	'''
	junit '**/*.xml'
}

def runDockerCompose(String markLogicDockerImage) {
  cleanupDocker()
  sh label: 'run-docker-compose', script: '''#!/bin/bash
    echo "Removing any running MarkLogic server and clean up MarkLogic data directory"
    sudo /usr/local/sbin/mladmin remove
    docker-compose down -v || true
    sudo /usr/local/sbin/mladmin cleandata
    cd node-client-api
    echo "Running docker compose with MarkLogic image: ''' + markLogicDockerImage + '''"
    MARKLOGIC_LOGS_VOLUME=/tmp MARKLOGIC_IMAGE=''' + markLogicDockerImage + ''' docker-compose up -d --build
    echo "Waiting 90s for MarkLogic to be ready to accept connections"
    sleep 90s;
	'''
}

def teardownAfterTests() {
  updateWorkspacePermissions()
  sh label: 'teardown-docker', script: '''#!/bin/bash
    cd node-client-api
    docker-compose down -v || true
    '''
  cleanupDocker()
}

def runAuditReport() {
  sh label: 'run-audit-report', script: '''
		export PATH=${NODE_HOME_DIR}/bin:$PATH
		cd node-client-api
		npm ci
		rm -rf $WORKSPACE/npm-audit-report.json || true
		npm audit --audit-level=low --json > $WORKSPACE/npm-audit-report.json
	'''
}

def runE2ETests() {
  sh label: 'run-e2e-tests', script: '''
    export JAVA_HOME=$JAVA_HOME_DIR
    export GRADLE_USER_HOME=$WORKSPACE/$GRADLE_DIR
    export PATH=$JAVA_HOME/bin:${NODE_HOME_DIR}/bin:$PATH
		cd node-client-api
		node --version
		npm --version
		npm ci
		node etc/test-setup-qa.js
		node etc/test-setup-dmsdk-qa.js
		node config-optic/setupqa.js
		cd test-complete-app
		./gradlew -i mlDeploy -g $PWD
		cd ..
		./node_modules/.bin/mocha --no-parallel -R xunit --timeout 60000  test-complete/ --reporter mocha-junit-reporter --reporter-options mochaFile=$WORKSPACE/test-complete-results.xml  || true
		cd test-complete-proxy
		npm install gulp-cli
		gulp loadToModulesDB
		gulp generateFnClasses
		gulp copyFnClasses
		# Adding sleep for the gulp commands to complete.
		sleep 30
		cp *.js ../test-complete/
		cp -R ml-modules/ ../test-complete
		cd ../test-complete
		../node_modules/.bin/mocha -R xunit --timeout 60000 nodejs-ds-setup-docs.js
		../node_modules/.bin/mocha -R xunit --timeout 60000 "nodejs-ds-required-params.js"  --reporter mocha-junit-reporter --reporter-options mochaFile=$WORKSPACE/ds-required-params-results.xml || true
		../node_modules/.bin/mocha -R xunit --timeout 60000 "nodejs-ds-error-map.js" --reporter mocha-junit-reporter --reporter-options mochaFile=$WORKSPACE/ds-multipleWorker-results.xml || true
		../node_modules/.bin/mocha -R xunit --timeout 60000 -R xunit "nodejs-ds-multipleWorker.js" --reporter mocha-junit-reporter --reporter-options mochaFile=$WORKSPACE/ds-multipleWorker-results.xml || true
		../node_modules/.bin/mocha -R xunit --timeout 60000 -R xunit "nodejs-ds-transactions.js" --reporter mocha-junit-reporter --reporter-options mochaFile=$WORKSPACE/ds-transactions-results.js.xml || true
		../node_modules/.bin/mocha -R xunit --timeout 60000 -R xunit "nodejs-ds-dynamic.js" --reporter mocha-junit-reporter --reporter-options mochaFile=$WORKSPACE/ds-dynamic-results.xml || true
	'''
  junit '**/*.xml'
}

pipeline {
  agent none

  triggers {
    parameterizedCron(env.BRANCH_NAME == "develop" ? "00 02 * * * % regressions=true" : "")
  }

  parameters {
    booleanParam(name: 'regressions', defaultValue: false, description: 'indicator if build is for regressions')
  }

  options {
    checkoutToSubdirectory 'node-client-api'
    buildDiscarder logRotator(artifactDaysToKeepStr: '7', artifactNumToKeepStr: '', daysToKeepStr: '7', numToKeepStr: '10')
  }

  environment {
    NODE_HOME_DIR = "/users/ml/builder/nodeJs/node-v22.20.0-linux-x64"
    DMC_USER = credentials('MLBUILD_USER')
    DMC_PASSWORD = credentials('MLBUILD_PASSWORD')
    GRADLE_DIR = ".gradle"
    JAVA_HOME_DIR = "/home/builder/java/jdk-17.0.2"
  }

  stages {

    stage('pull-request-tests') {
      agent { label 'nodeclientpool' }
      steps {
        runAuditReport()
        runDockerCompose('ml-docker-db-dev-tierpoint.bed-artifactory.bedford.progress.com/marklogic/marklogic-server-ubi:latest-12')
        runTests()
        runE2ETests()
      }
      post {
        always {
          teardownAfterTests()
        }
      }
    }

    stage('regressions') {
      parallel {

        stage('runtests-11-nightly') {
          when {
            allOf {
              branch 'develop'
              expression { return params.regressions }
            }
          }
          agent { label 'nodeclientpool' }
          steps {
            runDockerCompose('ml-docker-db-dev-tierpoint.bed-artifactory.bedford.progress.com/marklogic/marklogic-server-ubi:latest-11')
            runTests()
            runE2ETests()
          }
          post {
            always {
              teardownAfterTests()
            }
          }
        }

        stage('runtests-12-nightly') {
          when {
            allOf {
              branch 'develop'
              expression { return params.regressions }
            }
          }
          agent { label 'nodeclientpool' }
          steps {
            runDockerCompose('ml-docker-db-dev-tierpoint.bed-artifactory.bedford.progress.com/marklogic/marklogic-server-ubi:latest-12')
            runTests()
            runE2ETests()
          }
          post {
            always {
              teardownAfterTests()
            }
          }
        }

        stage('runtests-10-nightly') {
          when {
            allOf {
              branch 'develop'
              expression { return params.regressions }
            }
          }
          agent { label 'nodeclientpool' }
          steps {
            runDockerCompose('ml-docker-db-dev-tierpoint.bed-artifactory.bedford.progress.com/marklogic/marklogic-server-ubi:latest-10')
            runTests()
            runE2ETests()
          }
          post {
            always {
              teardownAfterTests()
            }
          }
        }
      }
    }
  }
}
