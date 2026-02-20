@Library('shared-libraries') _

def runTests(excludeFragileTests) {
  def excludeFlag = excludeFragileTests ? '--exclude "test-basic/documents-data-movement-*.js"' : ''

  sh label: 'deploy-test-app-and-run-tests', script: """
		export JAVA_HOME=\$JAVA_HOME_DIR
		export GRADLE_USER_HOME=\$WORKSPACE/\$GRADLE_DIR
		export PATH=\$JAVA_HOME/bin:\${NODE_HOME_DIR}/bin:\$PATH
		cd node-client-api
		node --version
		npm --version
		npm ci

    cd test-app
    ./gradlew -i mlWaitTillReady
    ./gradlew -i mlTestConnections
    ./gradlew -i mlDeploy
    ./gradlew -i -Penv=e2e mlLoadData mlLoadModules

		cd ..
		rm -rf \$WORKSPACE/*.xml || true
		./node_modules/.bin/mocha --timeout 10000 -R xunit test-basic/ ${excludeFlag} --reporter mocha-junit-reporter --reporter-options mochaFile=\$WORKSPACE/test-basic-reports.xml || true
		./node_modules/.bin/gulp setupProxyTests || true
		./node_modules/.bin/mocha --timeout 10000 -R xunit test-basic-proxy/lib/**/*.js --reporter mocha-junit-reporter --reporter-options mochaFile=\$WORKSPACE/test-basic-proxy-reports.xml || true
	"""
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
		npm audit --audit-level=moderate --json > $WORKSPACE/npm-audit-report.json
	'''
}

// For now, only failing on errors. See eslint.config.js for the lint configuration.
def runLint() {
  sh label: 'run-lint', script: '''
    export PATH=${NODE_HOME_DIR}/bin:$PATH
    cd node-client-api
    npm ci
    npm run lint -- --quiet
	'''
}

def runTypeCheck() {
  sh label: 'run-type-check', script: '''
    export PATH=${NODE_HOME_DIR}/bin:$PATH
    cd node-client-api
    npm ci
    npm run test:types
	'''
}

def runTypeScriptTests() {
  sh label: 'run-typescript-tests', script: '''
    export PATH=${NODE_HOME_DIR}/bin:$PATH
    cd node-client-api
    npm ci
    npm run test:compile
    ./node_modules/.bin/mocha --timeout 10000 test-typescript/*.js --reporter mocha-junit-reporter --reporter-options mochaFile=$WORKSPACE/test-typescript-reports.xml || true
	'''
  junit '**/*test-typescript-reports.xml'
}

def runE2ETests(excludeFragileTests) {
  def excludeFlag = excludeFragileTests ? '--exclude "test-complete/nodejs-dmsdk*.js"' : ''

  sh label: 'run-e2e-tests', script: """
    export PATH=\${NODE_HOME_DIR}/bin:\$PATH
		cd node-client-api
		node --version
		npm --version
		npm ci

    echo "Running test-complete tests"
    ./node_modules/.bin/mocha --no-parallel -R xunit --timeout 60000  test-complete/ ${excludeFlag} --reporter mocha-junit-reporter --reporter-options mochaFile=\$WORKSPACE/test-complete-results.xml  || true
    echo "Done with test-complete tests"

    cd test-complete-proxy
		npm install gulp-cli
		gulp loadToModulesDB
		gulp generateFnClasses
		gulp copyFnClasses
		cp *.js ../test-complete/
		cp -R ml-modules/ ../test-complete
		cd ../test-complete
		../node_modules/.bin/mocha -R xunit --timeout 20000 nodejs-ds-setup-docs.js
		../node_modules/.bin/mocha -R xunit --timeout 20000 "nodejs-ds-required-params.js"  --reporter mocha-junit-reporter --reporter-options mochaFile=\$WORKSPACE/ds-required-params-results.xml || true
		../node_modules/.bin/mocha -R xunit --timeout 20000 "nodejs-ds-error-map.js" --reporter mocha-junit-reporter --reporter-options mochaFile=\$WORKSPACE/ds-multipleWorker-results.xml || true
		../node_modules/.bin/mocha -R xunit --timeout 20000 "nodejs-ds-multipleWorker.js" --reporter mocha-junit-reporter --reporter-options mochaFile=\$WORKSPACE/ds-multipleWorker-results.xml || true
		../node_modules/.bin/mocha -R xunit --timeout 20000 "nodejs-ds-transactions.js" --reporter mocha-junit-reporter --reporter-options mochaFile=\$WORKSPACE/ds-transactions-results.js.xml || true
		../node_modules/.bin/mocha -R xunit --timeout 20000 "nodejs-ds-dynamic.js" --reporter mocha-junit-reporter --reporter-options mochaFile=\$WORKSPACE/ds-dynamic-results.xml || true
	"""
  junit '**/*.xml'
}

pipeline {
  agent none

  triggers {
    parameterizedCron(env.BRANCH_NAME == "develop" ? "00 02 * * * % regressions=true" : "")
  }

  parameters {
    booleanParam(name: 'regressions', defaultValue: false, description: 'indicator if build is for regressions')
    string(name: 'MARKLOGIC_IMAGE_TAGS', defaultValue: 'marklogic-server-ubi:latest-11,marklogic-server-ubi:latest-12', description: 'Comma-delimited list of MarkLogic image tags including variant (e.g., marklogic-server-ubi:latest-11,marklogic-server-ubi-rootless:11.3.2). The registry/org (ml-docker-db-dev-tierpoint.bed-artifactory.bedford.progress.com/marklogic) path will be prepended automatically.')
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
        runLint()
        runTypeCheck()
        runDockerCompose('ml-docker-db-dev-tierpoint.bed-artifactory.bedford.progress.com/marklogic/marklogic-server-ubi:latest-12')
        runTests(true)
        runTypeScriptTests()
        runE2ETests(true)
      }
      post {
        always {
          teardownAfterTests()
        }
      }
    }

    stage('regressions') {
      agent { label 'nodeclientpool' }
      when {
        allOf {
          branch 'develop'
          expression { return params.regressions }
        }
      }
      steps {
        script {
          def imageTags = params.MARKLOGIC_IMAGE_TAGS.split(',')
          def imagePrefix = 'ml-docker-db-dev-tierpoint.bed-artifactory.bedford.progress.com/marklogic/'

          imageTags.each { tag ->
            def fullImage = imagePrefix + tag.trim()

            try {
              runDockerCompose(fullImage)
              runTests(false)
              runTypeScriptTests()
              runE2ETests(false)
            } finally {
              teardownAfterTests()
            }
          }
        }
      }
    }
  }
}
