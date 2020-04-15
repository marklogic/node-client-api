/*
 * Copyright (c) 2020 MarkLogic Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const expect = require('chai').expect;

const testutil = require('../testutil');

const Sessions = require("./sessions.js");

describe('session service', function() {
  const service = Sessions.on(testutil.makeAdminClient());

  it('field', function(done) {
    const timestampField = "timestamped";
    const fieldSession = service.createSession();
    let timestampValue = null;
    service.setSessionField(fieldSession, timestampField)
        .then(output => {
          timestampValue = output;
          return service.getSessionField(fieldSession, timestampField, timestampValue);
          })
        .then(output => {
          expect(output).to.equal(true);
          const otherSession = service.createSession();
          return service.getSessionField(otherSession, timestampField, timestampValue);
          })
        .then(output => {
          expect(output).to.equal(false);
          done();
          })
        .catch(err => {
          expect.fail(err.toString());
          done();
        });
  });
  it('transaction', function(done) {
    const docUri = '/test/session/transaction/doc1.txt';
    const transactionSession = service.createSession();
    let hasRolledBack = false;
    const sessionId = transactionSession.sessionId();
    const docText = `Transaction for session: ${sessionId}`;
    service.checkTransaction(null, docUri)
        .then(output => {
          expect(output).to.equal(false);
          return service.checkTransaction(transactionSession, docUri);
          })
        .then(output => {
          expect(output).to.equal(false);
          return service.beginTransaction(transactionSession, docUri, docText);
          })
        .then(output => {
          return service.checkTransaction(transactionSession, docUri);
          })
        .then(output => {
          expect(output).to.equal(true);
          return service.checkTransaction(null, docUri);
          })
        .then(output => {
          expect(output).to.equal(false);
          hasRolledBack = true;
          return service.rollbackTransaction(transactionSession);
          })
        .then(output => {
          return service.checkTransaction(null, docUri);
          })
        .then(output => {
          expect(output).to.equal(false);
          return service.checkTransaction(transactionSession, docUri);
          })
        .then(output => {
          expect(output).to.equal(false);
          done();
          })
        .catch(err => {
          if (!hasRolledBack) {
            service.rollbackTransaction(transactionSession);
          }
          expect.fail(err.toString());
          done();
        });
  });
  it('concurrent', function(done) {
    this.timeout(3000);
    const concurrentMax = 3;
    const sleeptime = 750;
    let running = concurrentMax;
    for (let i=0; i < concurrentMax; i++) {
      const session = service.createSession();
      service.sleepify(session, sleeptime)
          .then(output => {
            expect(output).to.equal(true);
            if (--running === 0) {
              done();
            }})
          .catch(err => {
            expect.fail(err.toString());
            done();
            });
    }
  });
  describe('negative', function() {
    it('null', function(done) {
      try {
        service.setSessionField(null, 'unused')
            .then(output => {
              expect.fail(err.toString());
              done();
              })
            .catch(err => {
              expect.fail(err.toString());
              done();
              });
        expect.fail('error not thrown');
      } catch(err) {
        expect(err.toString()).to.equal('Error: missing required session parameter: timestamper');
        done();
      }
    });
    it('transaction without session', function(done) {
      service.beginTransactionNoSession('/test/session/transaction/negative1.txt', 'should never succeed')
          .then(output => {
            expect.fail(err.toString());
            done();
            })
          .catch(err => {
            expect(err.toString()).to.equal(
                'Error: call to /dbf/test/sessions/beginTransactionNoSession.sjs: cannot process response with 500 status'
            );
            done();
            });
    });
    it('field without session', function(done) {
      service.setSessionFieldNoSession('shouldNeverSucceed')
          .then(output => {
            expect.fail(err.toString());
            done();
            })
          .catch(err => {
            expect(err.toString()).to.equal(
                'Error: call to /dbf/test/sessions/setSessionFieldNoSession.sjs: cannot process response with 500 status'
            );
            done();
            });
    });
  });
});
