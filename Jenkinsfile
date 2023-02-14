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
        rm -rf $WORKSPACE/test-*.xml || true
        ./node_modules/.bin/mocha --timeout 10000 -R xunit test-basic/ -g \'logging|archivePath\' --invert >> $WORKSPACE/test-basic-reports.xml || true
        ./node_modules/.bin/gulp setupProxyTests || true
        ./node_modules/.bin/mocha --timeout 10000 -R xunit test-basic-proxy/lib/**/*.js -g \'logging|archivePath\' --invert >> $WORKSPACE/test-basic-proxy-reports.xml || true
        sed -n \'/^<testsuite/, $p\' test-basic-reports.xml > test-basic-reports-filtered.xml || true
        sed -n \'/^<testsuite/, $p\' test-basic-proxy-reports.xml >> test-basic-proxy-reports-filtered.xml || true
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
        stage('runtests-11.0.0'){
            steps{
                runTests('Release','11.0.0')
            }
        }
        stage('runtests-11.0-nightly'){
            when{
                allOf{
                    branch 'develop'
                    expression {return params.regressions}
                }
            }
            steps{
                runTests('Latest','11.0')
            }
        }
        stage('runtests-12.0-nightly'){
            when{
                allOf{
                    branch 'develop'
                    expression {return params.regressions}
                }
            }
            steps{
                runTests('Latest','12.0')
            }
        }
        stage('runtests-10.0-nightly'){
            when{
                allOf{
                    branch 'develop'
                    expression {return params.regressions}
                }
            }
            steps{
                runTests('Latest','10.0')
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
            }
        }
    }
}