@Library('shared-libraries') _

def runTests(String type,String version){
    copyRPM type,version
    setUpML '$WORKSPACE/xdmp/src/Mark*.rpm'
    sh '''
        export PATH=${NODE_HOME_DIR}/bin:$PATH
        cd node-client-api
        node --version
        npm --version
        npm install
        node etc/test-setup.js -u admin:admin
        rm -rf $WORKSPACE/*.xml || true
        ./node_modules/.bin/mocha --timeout 10000 -R xunit test-basic/ --reporter mocha-junit-reporter --reporter-options mochaFile=$WORKSPACE/test-basic-reports.xml -g \'logging|archivePath\' --invert  || true
        ./node_modules/.bin/gulp setupProxyTests || true
        ./node_modules/.bin/mocha --timeout 10000 -R xunit test-basic-proxy/lib/**/*.js --reporter mocha-junit-reporter --reporter-options mochaFile=$WORKSPACE/test-basic-proxy-reports.xml -g \'logging|archivePath\' --invert  || true
    '''

}
def runAuditReport(){
    sh '''
        export PATH=${NODE_HOME_DIR}/bin:$PATH
        cd node-client-api
        npm install
        rm -rf $WORKSPACE/npm-audit-report.json || true
        npm audit -json > $WORKSPACE/npm-audit-report.json
    '''
}

def runE2ETests(String type,String version){
    copyRPM type,version
    setUpML '$WORKSPACE/xdmp/src/Mark*.rpm'
    sh '''
        export PATH=${NODE_HOME_DIR}/bin:$PATH
        cd node-client-api
        node --version
        npm --version
        npm install
        node etc/test-setup-qa.js
        node etc/test-setup-dmsdk-qa.js
        node config-optic/setupqa.js
        ./node_modules/.bin/mocha -R xunit --timeout 60000  test-complete/ --reporter mocha-junit-reporter --reporter-options mochaFile=$WORKSPACE/test-complete-results.xml  || true
        cd test-complete-proxy
        npm install --global gulp-cli
        gulp loadToModulesDB
        gulp generateFnClasses
        gulp copyFnClasses
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
pipeline{
    agent {label 'nodeclientpool'}
    triggers{
        parameterizedCron(env.BRANCH_NAME == "develop" ? "00 02 * * * % regressions=true" : "")
    }
    parameters{
          booleanParam(name: 'regressions', defaultValue: false, description: 'indicator if build is for regressions')
    }
    options {
        checkoutToSubdirectory 'node-client-api'
        buildDiscarder logRotator(artifactDaysToKeepStr: '7', artifactNumToKeepStr: '', daysToKeepStr: '7', numToKeepStr: '10')
      }
    environment{
          NODE_HOME_DIR= "/home/builder/nodeJs/node-v18.14.0-linux-x64"
          DMC_USER     = credentials('MLBUILD_USER')
          DMC_PASSWORD = credentials('MLBUILD_PASSWORD')
    }
    stages{
        stage('runtests-11.0.2'){
            steps{
                runAuditReport()
                runTests('Release','11.0.2')
                runE2ETests('Release','11.0.2')
            }
        }
        stage('regressions'){
            parallel{
                stage('runtests-11-nightly'){
                    when{
                        allOf{
                            branch 'develop'
                                expression {return params.regressions}
                            }
                        }
                    steps{
                        runTests('Latest','11')
                        runE2ETests('Latest','11')
                    }
                }
                stage('runtests-12-nightly'){
                    when{
                        allOf{
                            branch 'develop'
                                expression {return params.regressions}
                            }
                        }
                    steps{
                        runTests('Latest','12.0')
                        runE2ETests('Latest','12.0')
                    }
                }
                stage('runtests-10-nightly'){
                    when{
                        allOf{
                            branch 'develop'
                                expression {return params.regressions}
                            }
                        }
                    steps{
                        runTests('Latest','10.0')
                        runE2ETests('Latest','10.0')
                    }
                }
                stage('runtests-10.0-9.5'){
                    when{
                        allOf{
                            branch 'develop'
                                expression {return params.regressions}
                            }
                        }
                    steps{
                        runTests('Release','10.0-9.5')
                        runE2ETests('Release','10.0-9.5')
                    }
                }
            }
        }
    }
}