@Library('shared-libraries') _

def runTests() {
	sh label: 'deploy-test-app-and-run-tests', script: '''
		export JAVA_HOME=$JAVA_HOME_DIR
		export GRADLE_USER_HOME=$WORKSPACE/$GRADLE_DIR
		export PATH=$JAVA_HOME/bin:$GRADLE_USER_HOME:${NODE_HOME_DIR}/bin:$PATH
		cd node-client-api
		node --version
		npm --version
		npm ci

		cd test-app
		./gradlew -i mlTestConnections
		./gradlew -i mlDeploy

		cd ..
		rm -rf $WORKSPACE/*.xml || true
		./node_modules/.bin/mocha --timeout 10000 -R xunit test-basic --reporter mocha-junit-reporter --reporter-options mochaFile=$WORKSPACE/test-basic-reports.xml -g \'logging\' --invert || true

		# Turning these off temporarily
		# ./node_modules/.bin/gulp setupProxyTests || true
		# ./node_modules/.bin/mocha --timeout 10000 -R xunit test-basic-proxy/lib/**/*.js --reporter mocha-junit-reporter --reporter-options mochaFile=$WORKSPACE/test-basic-proxy-reports.xml -g \'logging\' --invert  || true
	'''
}

def runDockerCompose(String markLogicDockerImage) {
	cleanupDocker()
	sh label: 'run-docker-compose', script: '''#!/bin/bash
    echo "Removing any running MarkLogic server and clean up MarkLogic data directory"
    sudo /usr/local/sbin/mladmin remove
    docker-compose down -v || true
    sudo /usr/local/sbin/mladmin cleandata
    cd node-client-api
    MARKLOGIC_LOGS_VOLUME=/tmp MARKLOGIC_IMAGE=''' + markLogicDockerImage + ''' docker-compose up -d --build
    sleep 60s;
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
		npm audit -json || true > $WORKSPACE/npm-audit-report.json
	'''
}

def runE2ETests() {
	sh label: 'run-e2e-tests', script: '''
		export PATH=${NODE_HOME_DIR}/bin:$PATH
		cd node-client-api
		node --version
		npm --version
		npm ci
		node etc/test-setup-qa.js
		# Adding sleep for the setups to complete before running test-complete
		sleep 10
		node etc/test-setup-dmsdk-qa.js
		sleep 10
		node config-optic/setupqa.js
		sleep 30
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
				runDockerCompose('progressofficial/marklogic-db:latest-11')
				runTests()
				// Turning these off while debugging
				// runE2ETests()
			}
			post {
				always {
					junit '**/*.xml'
					teardownAfterTests()
				}
			}
		}

		stage('regressions') {
			parallel {

				// stage('runtests-11-nightly') {
				// 	when {
				// 		allOf {
				// 			branch 'develop'
				// 			expression { return params.regressions }
				// 		}
				// 	}
				// 	agent { label 'nodeclientpool' }
				// 	steps {
				// 		runDockerCompose('ml-docker-db-dev-tierpoint.bed-artifactory.bedford.progress.com/marklogic/marklogic-server-ubi:latest-11')
				// 		runTests()
				// 		runE2ETests()
				// 	}
				// 	post {
				// 		always {
				// 			teardownAfterTests()
				// 			junit '**/*.xml'
				// 		}
				// 	}
				// }

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
							junit '**/*.xml'
							teardownAfterTests()
						}
					}
				}

				// stage('runtests-10-nightly') {
				// 	when {
				// 		allOf {
				// 			branch 'develop'
				// 			expression { return params.regressions }
				// 		}
				// 	}
				// 	agent { label 'nodeclientpool' }
				// 	steps {
				// 		runDockerCompose('ml-docker-db-dev-tierpoint.bed-artifactory.bedford.progress.com/marklogic/marklogic-server-ubi:latest-10')
				// 		runTests()
				// 		runE2ETests()
				// 	}
				// 	post {
				// 		always {
				// 			junit '**/*.xml'
				// 			teardownAfterTests()
				// 		}
				// 	}
				// }
			}
		}
	}
}
