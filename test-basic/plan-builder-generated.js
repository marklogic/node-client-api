/*
 * Copyright 2017-2019 MarkLogic Corporation
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

/* IMPORTANT: Do not edit. This file is generated. */
const should = require('should');

const marklogic = require('../');
const p = marklogic.planBuilder;

const pbb = require('./plan-builder-base');
const testPlan = pbb.testPlan;
const getResult = pbb.getResult;

describe('plan builder', function() {
  describe('expression functions', function() {
    it('cts.stem#1', function(done) {
        testPlan([p.xs.string("ran")], p.cts.stem(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('run');
            done();
        }).catch(done);
    });
    it('cts.stem#2', function(done) {
        testPlan([p.xs.string("ran"), p.xs.string("en")], p.cts.stem(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('run');
            done();
        }).catch(done);
    });
    it('cts.tokenize#1', function(done) {
        testPlan([p.xs.string("a-b c")], p.cts.tokenize(p.col("1")))
          .then(function(response) {
            should(getResult(response).value).eql(["a", "-", "b", " ", "c"]);
            done();
        }).catch(done);
    });
    it('cts.tokenize#2', function(done) {
        testPlan([p.xs.string("a-b c"), p.xs.string("en")], p.cts.tokenize(p.col("1"), p.col("2")))
          .then(function(response) {
            should(getResult(response).value).eql(["a", "-", "b", " ", "c"]);
            done();
        }).catch(done);
    });
    it('fn.abs#1', function(done) {
        testPlan([p.xs.double(-11)], p.fn.abs(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('11');
            done();
        }).catch(done);
    });
    it('fn.analyzeString#2', function(done) {
        testPlan([p.xs.string("aXbyc"), p.xs.string("[xy]")], p.fn.analyzeString(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('<s:analyze-string-result xmlns:s="http://www.w3.org/2005/xpath-functions"><s:non-match>aXb</s:non-match><s:match>y</s:match><s:non-match>c</s:non-match></s:analyze-string-result>');
            done();
        }).catch(done);
    });
    it('fn.analyzeString#3', function(done) {
        testPlan([p.xs.string("aXbyc"), p.xs.string("[xy]"), p.xs.string("i")], p.fn.analyzeString(p.col("1"), p.col("2"), p.col("3")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('<s:analyze-string-result xmlns:s="http://www.w3.org/2005/xpath-functions"><s:non-match>a</s:non-match><s:match>X</s:match><s:non-match>b</s:non-match><s:match>y</s:match><s:non-match>c</s:non-match></s:analyze-string-result>');
            done();
        }).catch(done);
    });
    it('fn.avg#1', function(done) {
        testPlan([[p.xs.double(2), p.xs.double(4), p.xs.double(6), p.xs.double(8)]], p.fn.avg(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('5');
            done();
        }).catch(done);
    });
    it('fn.boolean#1', function(done) {
        testPlan([p.xs.string("abc")], p.fn.boolean(p.col("1")))
          .then(function(response) {
            should(getResult(response).value).eql(true);
            done();
        }).catch(done);
    });
    it('fn.ceiling#1', function(done) {
        testPlan([p.xs.double(1.3)], p.fn.ceiling(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('2');
            done();
        }).catch(done);
    });
    it('fn.codepointEqual#2', function(done) {
        testPlan([p.xs.string("abc"), p.xs.string("abc")], p.fn.codepointEqual(p.col("1"), p.col("2")))
          .then(function(response) {
            should(getResult(response).value).eql(true);
            done();
        }).catch(done);
    });
    it('fn.codepointsToString#1', function(done) {
        testPlan([[p.xs.integer(97), p.xs.integer(98), p.xs.integer(99)]], p.fn.codepointsToString(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('abc');
            done();
        }).catch(done);
    });
    it('fn.compare#2', function(done) {
        testPlan([p.xs.string("abz"), p.xs.string("aba")], p.fn.compare(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('1');
            done();
        }).catch(done);
    });
    it('fn.compare#3', function(done) {
        testPlan([p.xs.string("abz"), p.xs.string("aba"), p.xs.string("http://marklogic.com/collation/")], p.fn.compare(p.col("1"), p.col("2"), p.col("3")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('1');
            done();
        }).catch(done);
    });
    it('fn.concat#2', function(done) {
        testPlan([p.xs.string("a"), p.xs.string("b")], p.fn.concat(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('ab');
            done();
        }).catch(done);
    });
    it('fn.concat#3', function(done) {
        testPlan([p.xs.string("a"), p.xs.string("b"), p.xs.string("c")], p.fn.concat(p.col("1"), p.col("2"), p.col("3")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('abc');
            done();
        }).catch(done);
    });
    it('fn.contains#2', function(done) {
        testPlan([p.xs.string("abc"), p.xs.string("b")], p.fn.contains(p.col("1"), p.col("2")))
          .then(function(response) {
            should(getResult(response).value).eql(true);
            done();
        }).catch(done);
    });
    it('fn.contains#3', function(done) {
        testPlan([p.xs.string("abc"), p.xs.string("b"), p.xs.string("http://marklogic.com/collation/")], p.fn.contains(p.col("1"), p.col("2"), p.col("3")))
          .then(function(response) {
            should(getResult(response).value).eql(true);
            done();
        }).catch(done);
    });
    it('fn.count#1', function(done) {
        testPlan([[p.xs.double(1), p.xs.double(2), p.xs.double(3)]], p.fn.count(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('3');
            done();
        }).catch(done);
    });
    it('fn.count#2', function(done) {
        testPlan([[p.xs.double(1), p.xs.double(2), p.xs.double(3)], p.xs.double(4)], p.fn.count(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('3');
            done();
        }).catch(done);
    });
    it('fn.dayFromDate#1', function(done) {
        testPlan([p.xs.date("2016-01-02-03:04")], p.fn.dayFromDate(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('2');
            done();
        }).catch(done);
    });
    it('fn.dayFromDateTime#1', function(done) {
        testPlan([p.xs.dateTime("2016-01-02T10:09:08Z")], p.fn.dayFromDateTime(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('2');
            done();
        }).catch(done);
    });
    it('fn.daysFromDuration#1', function(done) {
        testPlan([p.xs.dayTimeDuration("P3DT4H5M6S")], p.fn.daysFromDuration(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('3');
            done();
        }).catch(done);
    });
    it('fn.deepEqual#2', function(done) {
        testPlan([p.xs.string("abc"), p.xs.string("abc")], p.fn.deepEqual(p.col("1"), p.col("2")))
          .then(function(response) {
            should(getResult(response).value).eql(true);
            done();
        }).catch(done);
    });
    it('fn.deepEqual#3', function(done) {
        testPlan([p.xs.string("abc"), p.xs.string("abc"), p.xs.string("http://marklogic.com/collation/")], p.fn.deepEqual(p.col("1"), p.col("2"), p.col("3")))
          .then(function(response) {
            should(getResult(response).value).eql(true);
            done();
        }).catch(done);
    });
    it('fn.distinctValues#1', function(done) {
        testPlan([[p.xs.string("a"), p.xs.string("b"), p.xs.string("b"), p.xs.string("c")]], p.fn.distinctValues(p.col("1")))
          .then(function(response) {
            should(getResult(response).value).eql(["a", "b", "c"]);
            done();
        }).catch(done);
    });
    it('fn.distinctValues#2', function(done) {
        testPlan([[p.xs.string("a"), p.xs.string("b"), p.xs.string("b"), p.xs.string("c")], p.xs.string("http://marklogic.com/collation/")], p.fn.distinctValues(p.col("1"), p.col("2")))
          .then(function(response) {
            should(getResult(response).value).eql(["a", "b", "c"]);
            done();
        }).catch(done);
    });
    it('fn.empty#1', function(done) {
        testPlan([p.xs.double(1)], p.fn.empty(p.col("1")))
          .then(function(response) {
            should(getResult(response).value).eql(false);
            done();
        }).catch(done);
    });
    it('fn.encodeForUri#1', function(done) {
        testPlan([p.xs.string("http://a/b?c#d")], p.fn.encodeForUri(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('http%3A%2F%2Fa%2Fb%3Fc%23d');
            done();
        }).catch(done);
    });
    it('fn.endsWith#2', function(done) {
        testPlan([p.xs.string("abc"), p.xs.string("c")], p.fn.endsWith(p.col("1"), p.col("2")))
          .then(function(response) {
            should(getResult(response).value).eql(true);
            done();
        }).catch(done);
    });
    it('fn.endsWith#3', function(done) {
        testPlan([p.xs.string("abc"), p.xs.string("c"), p.xs.string("http://marklogic.com/collation/")], p.fn.endsWith(p.col("1"), p.col("2"), p.col("3")))
          .then(function(response) {
            should(getResult(response).value).eql(true);
            done();
        }).catch(done);
    });
    it('fn.escapeHtmlUri#1', function(done) {
        testPlan([p.xs.string("http://a/b?c#d")], p.fn.escapeHtmlUri(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('http://a/b?c#d');
            done();
        }).catch(done);
    });
    it('fn.exists#1', function(done) {
        testPlan([p.xs.double(1)], p.fn.exists(p.col("1")))
          .then(function(response) {
            should(getResult(response).value).eql(true);
            done();
        }).catch(done);
    });
    it('fn.false#0', function(done) {
        testPlan(undefined, p.fn.false())
          .then(function(response) {
            should(getResult(response).value).eql(false);
            done();
        }).catch(done);
    });
    it('fn.floor#1', function(done) {
        testPlan([p.xs.double(1.7)], p.fn.floor(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('1');
            done();
        }).catch(done);
    });
    it('fn.formatDate#2', function(done) {
        testPlan([p.xs.date("2016-01-02-03:04"), p.xs.string("[Y0001]/[M01]/[D01]")], p.fn.formatDate(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('2016/01/02');
            done();
        }).catch(done);
    });
    it('fn.formatDateTime#2', function(done) {
        testPlan([p.xs.dateTime("2016-01-02T10:09:08Z"), p.xs.string("[Y0001]/[M01]/[D01] [H01]:[m01]:[s01]:[f01]")], p.fn.formatDateTime(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('2016/01/02 10:09:08:00');
            done();
        }).catch(done);
    });
    it('fn.formatNumber#2', function(done) {
        testPlan([p.xs.double(1234.5), p.xs.string("#,##0.00")], p.fn.formatNumber(p.col("1"), p.col("2")))
          .then(function(response) {
            should(getResult(response).value).eql("1,234.50");
            done();
        }).catch(done);
    });
    it('fn.formatTime#2', function(done) {
        testPlan([p.xs.time("10:09:08Z"), p.xs.string("[H01]:[m01]:[s01]:[f01]")], p.fn.formatTime(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('10:09:08:00');
            done();
        }).catch(done);
    });
    it('fn.head#1', function(done) {
        testPlan([[p.xs.string("a"), p.xs.string("b"), p.xs.string("c")]], p.fn.head(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('a');
            done();
        }).catch(done);
    });
    it('fn.hoursFromDateTime#1', function(done) {
        testPlan([p.xs.dateTime("2016-01-02T10:09:08Z")], p.fn.hoursFromDateTime(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('10');
            done();
        }).catch(done);
    });
    it('fn.hoursFromDuration#1', function(done) {
        testPlan([p.xs.dayTimeDuration("P3DT4H5M6S")], p.fn.hoursFromDuration(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('4');
            done();
        }).catch(done);
    });
    it('fn.hoursFromTime#1', function(done) {
        testPlan([p.xs.time("10:09:08Z")], p.fn.hoursFromTime(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('10');
            done();
        }).catch(done);
    });
    it('fn.indexOf#2', function(done) {
        testPlan([[p.xs.string("a"), p.xs.string("b"), p.xs.string("c")], p.xs.string("b")], p.fn.indexOf(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('2');
            done();
        }).catch(done);
    });
    it('fn.indexOf#3', function(done) {
        testPlan([[p.xs.string("a"), p.xs.string("b"), p.xs.string("c")], p.xs.string("b"), p.xs.string("http://marklogic.com/collation/")], p.fn.indexOf(p.col("1"), p.col("2"), p.col("3")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('2');
            done();
        }).catch(done);
    });
    it('fn.insertBefore#3', function(done) {
        testPlan([[p.xs.string("a"), p.xs.string("b"), p.xs.string("e"), p.xs.string("f")], p.xs.integer(3), [p.xs.string("c"), p.xs.string("d")]], p.fn.insertBefore(p.col("1"), p.col("2"), p.col("3")))
          .then(function(response) {
            should(getResult(response).value).eql(["a", "b", "c", "d", "e", "f"]);
            done();
        }).catch(done);
    });
    it('fn.iriToUri#1', function(done) {
        testPlan([p.xs.string("http://a/b?c#d")], p.fn.iriToUri(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('http://a/b?c#d');
            done();
        }).catch(done);
    });
    it('fn.localNameFromQName#1', function(done) {
        testPlan([p.xs.QName("abc")], p.fn.localNameFromQName(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('abc');
            done();
        }).catch(done);
    });
    it('fn.lowerCase#1', function(done) {
        testPlan([p.xs.string("ABC")], p.fn.lowerCase(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('abc');
            done();
        }).catch(done);
    });
    it('fn.matches#2', function(done) {
        testPlan([p.xs.string("abc"), p.xs.string("^.B")], p.fn.matches(p.col("1"), p.col("2")))
          .then(function(response) {
            should(getResult(response).value).eql(false);
            done();
        }).catch(done);
    });
    it('fn.matches#3', function(done) {
        testPlan([p.xs.string("abc"), p.xs.string("^.B"), p.xs.string("i")], p.fn.matches(p.col("1"), p.col("2"), p.col("3")))
          .then(function(response) {
            should(getResult(response).value).eql(true);
            done();
        }).catch(done);
    });
    it('fn.max#1', function(done) {
        testPlan([[p.xs.string("a"), p.xs.string("b"), p.xs.string("c")]], p.fn.max(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('c');
            done();
        }).catch(done);
    });
    it('fn.max#2', function(done) {
        testPlan([[p.xs.string("a"), p.xs.string("b"), p.xs.string("c")], p.xs.string("http://marklogic.com/collation/")], p.fn.max(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('c');
            done();
        }).catch(done);
    });
    it('fn.min#1', function(done) {
        testPlan([[p.xs.string("a"), p.xs.string("b"), p.xs.string("c")]], p.fn.min(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('a');
            done();
        }).catch(done);
    });
    it('fn.min#2', function(done) {
        testPlan([[p.xs.string("a"), p.xs.string("b"), p.xs.string("c")], p.xs.string("http://marklogic.com/collation/")], p.fn.min(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('a');
            done();
        }).catch(done);
    });
    it('fn.minutesFromDateTime#1', function(done) {
        testPlan([p.xs.dateTime("2016-01-02T10:09:08Z")], p.fn.minutesFromDateTime(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('9');
            done();
        }).catch(done);
    });
    it('fn.minutesFromDuration#1', function(done) {
        testPlan([p.xs.dayTimeDuration("P3DT4H5M6S")], p.fn.minutesFromDuration(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('5');
            done();
        }).catch(done);
    });
    it('fn.minutesFromTime#1', function(done) {
        testPlan([p.xs.time("10:09:08Z")], p.fn.minutesFromTime(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('9');
            done();
        }).catch(done);
    });
    it('fn.monthFromDate#1', function(done) {
        testPlan([p.xs.date("2016-01-02-03:04")], p.fn.monthFromDate(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('1');
            done();
        }).catch(done);
    });
    it('fn.monthFromDateTime#1', function(done) {
        testPlan([p.xs.dateTime("2016-01-02T10:09:08Z")], p.fn.monthFromDateTime(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('1');
            done();
        }).catch(done);
    });
    it('fn.monthsFromDuration#1', function(done) {
        testPlan([p.xs.yearMonthDuration("P1Y2M")], p.fn.monthsFromDuration(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('2');
            done();
        }).catch(done);
    });
    it('fn.namespaceUriFromQName#1', function(done) {
        testPlan([p.xs.QName("abc")], p.fn.namespaceUriFromQName(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('');
            done();
        }).catch(done);
    });
    it('fn.normalizeSpace#1', function(done) {
        testPlan([p.xs.string(" abc  123 ")], p.fn.normalizeSpace(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('abc 123');
            done();
        }).catch(done);
    });
    it('fn.normalizeUnicode#1', function(done) {
        testPlan([p.xs.string(" aBc ")], p.fn.normalizeUnicode(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('aBc ');
            done();
        }).catch(done);
    });
    it('fn.normalizeUnicode#2', function(done) {
        testPlan([p.xs.string(" aBc "), p.xs.string("NFC")], p.fn.normalizeUnicode(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('aBc ');
            done();
        }).catch(done);
    });
    it('fn.not#1', function(done) {
        testPlan([p.xs.boolean(true)], p.fn.not(p.col("1")))
          .then(function(response) {
            should(getResult(response).value).eql(false);
            done();
        }).catch(done);
    });
    it('fn.number#1', function(done) {
        testPlan([p.xs.string("1.1")], p.fn.number(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('1.1');
            done();
        }).catch(done);
    });
    it('fn.prefixFromQName#1', function(done) {
        testPlan([p.xs.QName("abc")], p.fn.prefixFromQName(p.col("1")))
          .then(function(response) {
            should(getResult(response).value).eql(null);
            done();
        }).catch(done);
    });
    it('fn.QName#2', function(done) {
        testPlan([p.xs.string("http://a/b"), p.xs.string("c")], p.fn.QName(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('c');
            done();
        }).catch(done);
    });
    it('fn.remove#2', function(done) {
        testPlan([[p.xs.string("a"), p.xs.string("b"), p.xs.string("x"), p.xs.string("c")], p.xs.integer(3)], p.fn.remove(p.col("1"), p.col("2")))
          .then(function(response) {
            should(getResult(response).value).eql(["a", "b", "c"]);
            done();
        }).catch(done);
    });
    it('fn.replace#3', function(done) {
        testPlan([p.xs.string("axc"), p.xs.string("^(.)X"), p.xs.string("$1b")], p.fn.replace(p.col("1"), p.col("2"), p.col("3")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('axc');
            done();
        }).catch(done);
    });
    it('fn.replace#4', function(done) {
        testPlan([p.xs.string("axc"), p.xs.string("^(.)X"), p.xs.string("$1b"), p.xs.string("i")], p.fn.replace(p.col("1"), p.col("2"), p.col("3"), p.col("4")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('abc');
            done();
        }).catch(done);
    });
    it('fn.resolveUri#2', function(done) {
        testPlan([p.xs.string("b?c#d"), p.xs.string("http://a/x")], p.fn.resolveUri(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('http://a/b?c#d');
            done();
        }).catch(done);
    });
    it('fn.reverse#1', function(done) {
        testPlan([[p.xs.string("c"), p.xs.string("b"), p.xs.string("a")]], p.fn.reverse(p.col("1")))
          .then(function(response) {
            should(getResult(response).value).eql(["a", "b", "c"]);
            done();
        }).catch(done);
    });
    it('fn.round#1', function(done) {
        testPlan([p.xs.double(1.7)], p.fn.round(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('2');
            done();
        }).catch(done);
    });
    it('fn.roundHalfToEven#1', function(done) {
        testPlan([p.xs.double(1234.5)], p.fn.roundHalfToEven(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('1234');
            done();
        }).catch(done);
    });
    it('fn.roundHalfToEven#2', function(done) {
        testPlan([p.xs.double(1234.5), p.xs.integer(-2)], p.fn.roundHalfToEven(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('1200');
            done();
        }).catch(done);
    });
    it('fn.secondsFromDateTime#1', function(done) {
        testPlan([p.xs.dateTime("2016-01-02T10:09:08Z")], p.fn.secondsFromDateTime(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('8');
            done();
        }).catch(done);
    });
    it('fn.secondsFromDuration#1', function(done) {
        testPlan([p.xs.dayTimeDuration("P3DT4H5M6S")], p.fn.secondsFromDuration(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('6');
            done();
        }).catch(done);
    });
    it('fn.secondsFromTime#1', function(done) {
        testPlan([p.xs.time("10:09:08Z")], p.fn.secondsFromTime(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('8');
            done();
        }).catch(done);
    });
    it('fn.startsWith#2', function(done) {
        testPlan([p.xs.string("abc"), p.xs.string("a")], p.fn.startsWith(p.col("1"), p.col("2")))
          .then(function(response) {
            should(getResult(response).value).eql(true);
            done();
        }).catch(done);
    });
    it('fn.startsWith#3', function(done) {
        testPlan([p.xs.string("abc"), p.xs.string("a"), p.xs.string("http://marklogic.com/collation/")], p.fn.startsWith(p.col("1"), p.col("2"), p.col("3")))
          .then(function(response) {
            should(getResult(response).value).eql(true);
            done();
        }).catch(done);
    });
    it('fn.string#1', function(done) {
        testPlan([p.xs.double(1)], p.fn.string(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('1');
            done();
        }).catch(done);
    });
    it('fn.stringJoin#2', function(done) {
        testPlan([[p.xs.string("a"), p.xs.string("b"), p.xs.string("c")], p.xs.string("+")], p.fn.stringJoin(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('a+b+c');
            done();
        }).catch(done);
    });
    it('fn.stringLength#1', function(done) {
        testPlan([p.xs.string("abc")], p.fn.stringLength(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('3');
            done();
        }).catch(done);
    });
    it('fn.stringToCodepoints#1', function(done) {
        testPlan([p.xs.string("abc")], p.fn.stringToCodepoints(p.col("1")))
          .then(function(response) {
            should(getResult(response).value).eql([97, 98, 99]);
            done();
        }).catch(done);
    });
    it('fn.subsequence#2', function(done) {
        testPlan([[p.xs.string("a"), p.xs.string("b"), p.xs.string("c"), p.xs.string("d"), p.xs.string("e")], p.xs.double(2)], p.fn.subsequence(p.col("1"), p.col("2")))
          .then(function(response) {
            should(getResult(response).value).eql(["b", "c", "d", "e"]);
            done();
        }).catch(done);
    });
    it('fn.subsequence#3', function(done) {
        testPlan([[p.xs.string("a"), p.xs.string("b"), p.xs.string("c"), p.xs.string("d"), p.xs.string("e")], p.xs.double(2), p.xs.double(3)], p.fn.subsequence(p.col("1"), p.col("2"), p.col("3")))
          .then(function(response) {
            should(getResult(response).value).eql(["b", "c", "d"]);
            done();
        }).catch(done);
    });
    it('fn.substring#2', function(done) {
        testPlan([p.xs.string("abcd"), p.xs.double(2)], p.fn.substring(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('bcd');
            done();
        }).catch(done);
    });
    it('fn.substring#3', function(done) {
        testPlan([p.xs.string("abcd"), p.xs.double(2), p.xs.double(2)], p.fn.substring(p.col("1"), p.col("2"), p.col("3")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('bc');
            done();
        }).catch(done);
    });
    it('fn.substringAfter#2', function(done) {
        testPlan([p.xs.string("abcd"), p.xs.string("ab")], p.fn.substringAfter(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('cd');
            done();
        }).catch(done);
    });
    it('fn.substringAfter#3', function(done) {
        testPlan([p.xs.string("abcd"), p.xs.string("ab"), p.xs.string("http://marklogic.com/collation/")], p.fn.substringAfter(p.col("1"), p.col("2"), p.col("3")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('cd');
            done();
        }).catch(done);
    });
    it('fn.substringBefore#2', function(done) {
        testPlan([p.xs.string("abcd"), p.xs.string("cd")], p.fn.substringBefore(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('ab');
            done();
        }).catch(done);
    });
    it('fn.substringBefore#3', function(done) {
        testPlan([p.xs.string("abcd"), p.xs.string("cd"), p.xs.string("http://marklogic.com/collation/")], p.fn.substringBefore(p.col("1"), p.col("2"), p.col("3")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('ab');
            done();
        }).catch(done);
    });
    it('fn.sum#1', function(done) {
        testPlan([[p.xs.double(1), p.xs.double(2), p.xs.double(3)]], p.fn.sum(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('6');
            done();
        }).catch(done);
    });
    it('fn.tail#1', function(done) {
        testPlan([[p.xs.string("a"), p.xs.string("b"), p.xs.string("c")]], p.fn.tail(p.col("1")))
          .then(function(response) {
            should(getResult(response).value).eql(["b", "c"]);
            done();
        }).catch(done);
    });
    it('fn.tokenize#2', function(done) {
        testPlan([p.xs.string("axbxc"), p.xs.string("X")], p.fn.tokenize(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('axbxc');
            done();
        }).catch(done);
    });
    it('fn.tokenize#3', function(done) {
        testPlan([p.xs.string("axbxc"), p.xs.string("X"), p.xs.string("i")], p.fn.tokenize(p.col("1"), p.col("2"), p.col("3")))
          .then(function(response) {
            should(getResult(response).value).eql(["a", "b", "c"]);
            done();
        }).catch(done);
    });
    it('fn.translate#3', function(done) {
        testPlan([p.xs.string("axcy"), p.xs.string("xy"), p.xs.string("bd")], p.fn.translate(p.col("1"), p.col("2"), p.col("3")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('abcd');
            done();
        }).catch(done);
    });
    it('fn.true#0', function(done) {
        testPlan(undefined, p.fn.true())
          .then(function(response) {
            should(getResult(response).value).eql(true);
            done();
        }).catch(done);
    });
    it('fn.upperCase#1', function(done) {
        testPlan([p.xs.string("abc")], p.fn.upperCase(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('ABC');
            done();
        }).catch(done);
    });
    it('fn.yearFromDate#1', function(done) {
        testPlan([p.xs.date("2016-01-02-03:04")], p.fn.yearFromDate(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('2016');
            done();
        }).catch(done);
    });
    it('fn.yearFromDateTime#1', function(done) {
        testPlan([p.xs.dateTime("2016-01-02T10:09:08Z")], p.fn.yearFromDateTime(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('2016');
            done();
        }).catch(done);
    });
    it('fn.yearsFromDuration#1', function(done) {
        testPlan([p.xs.yearMonthDuration("P1Y2M")], p.fn.yearsFromDuration(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('1');
            done();
        }).catch(done);
    });
    it('json.array#0', function(done) {
        testPlan(undefined, p.json.array())
          .then(function(response) {
            should(getResult(response).value).eql([]);
            done();
        }).catch(done);
    });
    it('json.toArray#0', function(done) {
        testPlan(undefined, p.json.toArray())
          .then(function(response) {
            should(getResult(response).value).eql([]);
            done();
        }).catch(done);
    });
    it('map.entry#2', function(done) {
        testPlan([p.xs.string("one"), p.xs.string("two")], p.map.entry(p.col("1"), p.col("2")))
          .then(function(response) {
            should(getResult(response).value).eql({"one":"two"});
            done();
        }).catch(done);
    });
    it('map.map#0', function(done) {
        testPlan(undefined, p.map.map())
          .then(function(response) {
            should(getResult(response).value).eql({});
            done();
        }).catch(done);
    });
    it('math.acos#1', function(done) {
        testPlan([p.xs.double(0.5)], p.math.acos(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('1.0471975511966');
            done();
        }).catch(done);
    });
    it('math.asin#1', function(done) {
        testPlan([p.xs.double(0.5)], p.math.asin(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('0.523598775598299');
            done();
        }).catch(done);
    });
    it('math.atan#1', function(done) {
        testPlan([p.xs.double(3.14159)], p.math.atan(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('1.26262701154934');
            done();
        }).catch(done);
    });
    it('math.atan2#2', function(done) {
        testPlan([p.xs.double(36.23), p.xs.double(5.234)], p.math.atan2(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('1.42732303452594');
            done();
        }).catch(done);
    });
    it('math.ceil#1', function(done) {
        testPlan([p.xs.double(1.3)], p.math.ceil(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('2');
            done();
        }).catch(done);
    });
    it('math.cos#1', function(done) {
        testPlan([p.xs.double(11)], p.math.cos(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('0.00442569798805079');
            done();
        }).catch(done);
    });
    it('math.cosh#1', function(done) {
        testPlan([p.xs.double(11)], p.math.cosh(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('29937.0708659498');
            done();
        }).catch(done);
    });
    it('math.cot#1', function(done) {
        testPlan([p.xs.double(19.5)], p.math.cot(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('1.31422390103306');
            done();
        }).catch(done);
    });
    it('math.degrees#1', function(done) {
        testPlan([p.xs.double(1.5707963267949)], p.math.degrees(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('90.0000000000002');
            done();
        }).catch(done);
    });
    it('math.exp#1', function(done) {
        testPlan([p.xs.double(0.1)], p.math.exp(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('1.10517091807565');
            done();
        }).catch(done);
    });
    it('math.fabs#1', function(done) {
        testPlan([p.xs.double(4.013)], p.math.fabs(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('4.013');
            done();
        }).catch(done);
    });
    it('math.floor#1', function(done) {
        testPlan([p.xs.double(1.7)], p.math.floor(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('1');
            done();
        }).catch(done);
    });
    it('math.fmod#2', function(done) {
        testPlan([p.xs.double(10), p.xs.double(3)], p.math.fmod(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('1');
            done();
        }).catch(done);
    });
    it('math.frexp#1', function(done) {
        testPlan([p.xs.double(10)], p.math.frexp(p.col("1")))
          .then(function(response) {
            should(getResult(response).value).eql([0.625, 4]);
            done();
        }).catch(done);
    });
    it('math.ldexp#2', function(done) {
        testPlan([p.xs.double(1.333), p.xs.integer(10)], p.math.ldexp(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('1364.992');
            done();
        }).catch(done);
    });
    it('math.log#1', function(done) {
        testPlan([p.xs.double(1000)], p.math.log(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('6.90775527898214');
            done();
        }).catch(done);
    });
    it('math.log10#1', function(done) {
        testPlan([p.xs.double(1000)], p.math.log10(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('3');
            done();
        }).catch(done);
    });
    it('math.median#1', function(done) {
        testPlan([p.xs.double(1.2)], p.math.median(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('1.2');
            done();
        }).catch(done);
    });
    it('math.mode#1', function(done) {
        testPlan([[p.xs.string("abc"), p.xs.string("abc"), p.xs.string("def")]], p.math.mode(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('abc');
            done();
        }).catch(done);
    });
    it('math.mode#2', function(done) {
        testPlan([[p.xs.string("abc"), p.xs.string("abc"), p.xs.string("def")], p.xs.string("collation=http://marklogic.com/collation/")], p.math.mode(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('abc');
            done();
        }).catch(done);
    });
    it('math.modf#1', function(done) {
        testPlan([p.xs.double(1.333)], p.math.modf(p.col("1")))
          .then(function(response) {
            should(getResult(response).value).eql([0.333, 1]);
            done();
        }).catch(done);
    });
    it('math.percentRank#2', function(done) {
        testPlan([[p.xs.double(1), p.xs.double(7), p.xs.double(5), p.xs.double(5), p.xs.double(10), p.xs.double(9)], p.xs.double(9)], p.math.percentRank(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('0.833333333333333');
            done();
        }).catch(done);
    });
    it('math.percentRank#3', function(done) {
        testPlan([[p.xs.double(1), p.xs.double(7), p.xs.double(5), p.xs.double(5), p.xs.double(10), p.xs.double(9)], p.xs.double(9), p.xs.string("descending")], p.math.percentRank(p.col("1"), p.col("2"), p.col("3")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('0.333333333333333');
            done();
        }).catch(done);
    });
    it('math.percentile#2', function(done) {
        testPlan([[p.xs.double(2), p.xs.double(3), p.xs.double(1), p.xs.double(4)], [p.xs.double(0.25), p.xs.double(0.75)]], p.math.percentile(p.col("1"), p.col("2")))
          .then(function(response) {
            should(getResult(response).value).eql([1.5, 3.5]);
            done();
        }).catch(done);
    });
    it('math.pi#0', function(done) {
        testPlan(undefined, p.math.pi())
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('3.14159265358979');
            done();
        }).catch(done);
    });
    it('math.pow#2', function(done) {
        testPlan([p.xs.double(2), p.xs.double(10)], p.math.pow(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('1024');
            done();
        }).catch(done);
    });
    it('math.radians#1', function(done) {
        testPlan([p.xs.double(90)], p.math.radians(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('1.5707963267949');
            done();
        }).catch(done);
    });
    it('math.rank#2', function(done) {
        testPlan([[p.xs.double(1), p.xs.double(7), p.xs.double(5), p.xs.double(5), p.xs.double(10), p.xs.double(9)], p.xs.double(9)], p.math.rank(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('5');
            done();
        }).catch(done);
    });
    it('math.rank#3', function(done) {
        testPlan([[p.xs.double(1), p.xs.double(7), p.xs.double(5), p.xs.double(5), p.xs.double(10), p.xs.double(9)], p.xs.double(9), p.xs.string("descending")], p.math.rank(p.col("1"), p.col("2"), p.col("3")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('2');
            done();
        }).catch(done);
    });
    it('math.sin#1', function(done) {
        testPlan([p.xs.double(1.95)], p.math.sin(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('0.928959715003869');
            done();
        }).catch(done);
    });
    it('math.sinh#1', function(done) {
        testPlan([p.xs.double(1.95)], p.math.sinh(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('3.44320675450139');
            done();
        }).catch(done);
    });
    it('math.sqrt#1', function(done) {
        testPlan([p.xs.double(4)], p.math.sqrt(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('2');
            done();
        }).catch(done);
    });
    it('math.stddev#1', function(done) {
        testPlan([p.xs.double(1.2)], p.math.stddev(p.col("1")))
          .then(function(response) {
            should(getResult(response).value).eql(null);
            done();
        }).catch(done);
    });
    it('math.stddevP#1', function(done) {
        testPlan([p.xs.double(1.2)], p.math.stddevP(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('0');
            done();
        }).catch(done);
    });
    it('math.tan#1', function(done) {
        testPlan([p.xs.double(19.5)], p.math.tan(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('0.760905351982977');
            done();
        }).catch(done);
    });
    it('math.tanh#1', function(done) {
        testPlan([p.xs.double(0.95)], p.math.tanh(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('0.739783051274004');
            done();
        }).catch(done);
    });
    it('math.trunc#1', function(done) {
        testPlan([p.xs.double(123.456)], p.math.trunc(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('123');
            done();
        }).catch(done);
    });
    it('math.trunc#2', function(done) {
        testPlan([p.xs.double(123.456), p.xs.integer(2)], p.math.trunc(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('123.45');
            done();
        }).catch(done);
    });
    it('math.variance#1', function(done) {
        testPlan([p.xs.double(1.2)], p.math.variance(p.col("1")))
          .then(function(response) {
            should(getResult(response).value).eql(null);
            done();
        }).catch(done);
    });
    it('math.varianceP#1', function(done) {
        testPlan([p.xs.double(1.2)], p.math.varianceP(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('0');
            done();
        }).catch(done);
    });
    it('rdf.langString#2', function(done) {
        testPlan([p.xs.string("abc"), p.xs.string("en")], p.rdf.langString(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('abc');
            done();
        }).catch(done);
    });
    it('rdf.langStringLanguage#1', function(done) {
        testPlan([p.rdf.langString("abc", "en")], p.rdf.langStringLanguage(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('en');
            done();
        }).catch(done);
    });
    it('sem.coalesce#2', function(done) {
        testPlan([p.xs.string("a"), p.xs.string("b")], p.sem.coalesce(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('a');
            done();
        }).catch(done);
    });
    it('sem.coalesce#3', function(done) {
        testPlan([p.xs.string("a"), p.xs.string("b"), p.xs.string("c")], p.sem.coalesce(p.col("1"), p.col("2"), p.col("3")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('a');
            done();
        }).catch(done);
    });
    it('sem.datatype#1', function(done) {
        testPlan([p.xs.string("a")], p.sem.datatype(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('http://www.w3.org/2001/XMLSchema#string');
            done();
        }).catch(done);
    });
    it('sem.if#3', function(done) {
        testPlan([p.xs.boolean(true), p.xs.string("a"), p.xs.string("b")], p.sem.if(p.col("1"), p.col("2"), p.col("3")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('a');
            done();
        }).catch(done);
    });
    it('sem.invalid#2', function(done) {
        testPlan([p.xs.string("abc"), p.sem.iri("http://a/b")], p.sem.invalid(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('abc');
            done();
        }).catch(done);
    });
    it('sem.iri#1', function(done) {
        testPlan([p.xs.string("http://a/b")], p.sem.iri(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('http://a/b');
            done();
        }).catch(done);
    });
    it('sem.iriToQName#1', function(done) {
        testPlan([p.xs.string("http://a/b")], p.sem.iriToQName(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('b');
            done();
        }).catch(done);
    });
    it('sem.isBlank#1', function(done) {
        testPlan([p.xs.double(1)], p.sem.isBlank(p.col("1")))
          .then(function(response) {
            should(getResult(response).value).eql(false);
            done();
        }).catch(done);
    });
    it('sem.isIRI#1', function(done) {
        testPlan([p.xs.double(1)], p.sem.isIRI(p.col("1")))
          .then(function(response) {
            should(getResult(response).value).eql(false);
            done();
        }).catch(done);
    });
    it('sem.isLiteral#1', function(done) {
        testPlan([p.xs.double(1)], p.sem.isLiteral(p.col("1")))
          .then(function(response) {
            should(getResult(response).value).eql(true);
            done();
        }).catch(done);
    });
    it('sem.isNumeric#1', function(done) {
        testPlan([p.xs.string("a")], p.sem.isNumeric(p.col("1")))
          .then(function(response) {
            should(getResult(response).value).eql(false);
            done();
        }).catch(done);
    });
    it('sem.lang#1', function(done) {
        testPlan([p.xs.string("abc")], p.sem.lang(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('');
            done();
        }).catch(done);
    });
    it('sem.langMatches#2', function(done) {
        testPlan([p.xs.string("abc"), p.xs.string("abc")], p.sem.langMatches(p.col("1"), p.col("2")))
          .then(function(response) {
            should(getResult(response).value).eql(true);
            done();
        }).catch(done);
    });
    it('sem.QNameToIri#1', function(done) {
        testPlan([p.xs.QName("abc")], p.sem.QNameToIri(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('abc');
            done();
        }).catch(done);
    });
    it('sem.sameTerm#2', function(done) {
        testPlan([p.xs.double(1), p.xs.double(1)], p.sem.sameTerm(p.col("1"), p.col("2")))
          .then(function(response) {
            should(getResult(response).value).eql(true);
            done();
        }).catch(done);
    });
    it('sem.timezoneString#1', function(done) {
        testPlan([p.xs.dateTime("2016-01-02T10:09:08Z")], p.sem.timezoneString(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('Z');
            done();
        }).catch(done);
    });
    it('sem.typedLiteral#2', function(done) {
        testPlan([p.xs.string("abc"), p.sem.iri("http://a/b")], p.sem.typedLiteral(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('abc');
            done();
        }).catch(done);
    });
    it('sem.unknown#2', function(done) {
        testPlan([p.xs.string("abc"), p.sem.iri("http://a/b")], p.sem.unknown(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('abc');
            done();
        }).catch(done);
    });
    it('spell.doubleMetaphone#1', function(done) {
        testPlan([p.xs.string("smith")], p.spell.doubleMetaphone(p.col("1")))
          .then(function(response) {
            should(getResult(response).value).eql(["smo", "xmt"]);
            done();
        }).catch(done);
    });
    it('spell.levenshteinDistance#2', function(done) {
        testPlan([p.xs.string("cat"), p.xs.string("cats")], p.spell.levenshteinDistance(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('1');
            done();
        }).catch(done);
    });
    it('spell.romanize#1', function(done) {
        testPlan([p.xs.string("abc")], p.spell.romanize(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('abc');
            done();
        }).catch(done);
    });
    it('sql.bitLength#1', function(done) {
        testPlan([p.xs.string("abc")], p.sql.bitLength(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('24');
            done();
        }).catch(done);
    });
    it('sql.collatedString#2', function(done) {
        testPlan([p.xs.string("a"), p.xs.string("http://marklogic.com/collation/")], p.sql.collatedString(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('a');
            done();
        }).catch(done);
    });
    it('sql.dateadd#3', function(done) {
        testPlan([p.xs.string("day"), p.xs.int(3), p.xs.string("2016-01-02T10:09:08Z")], p.sql.dateadd(p.col("1"), p.col("2"), p.col("3")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('2016-01-05T10:09:08Z');
            done();
        }).catch(done);
    });
    it('sql.datediff#3', function(done) {
        testPlan([p.xs.string("day"), p.xs.string("2016-01-02T10:09:08Z"), p.xs.string("2016-01-05T10:09:08Z")], p.sql.datediff(p.col("1"), p.col("2"), p.col("3")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('3');
            done();
        }).catch(done);
    });
    it('sql.datepart#2', function(done) {
        testPlan([p.xs.string("day"), p.xs.string("2016-01-05T10:09:08Z")], p.sql.datepart(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('5');
            done();
        }).catch(done);
    });
    it('sql.day#1', function(done) {
        testPlan([p.xs.string("2016-01-02")], p.sql.day(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('2');
            done();
        }).catch(done);
    });
    it('sql.dayname#1', function(done) {
        testPlan([p.xs.string("2016-01-02")], p.sql.dayname(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('Saturday');
            done();
        }).catch(done);
    });
    it('sql.hours#1', function(done) {
        testPlan([p.xs.string("10:09:08")], p.sql.hours(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('10');
            done();
        }).catch(done);
    });
    it('sql.insert#4', function(done) {
        testPlan([p.xs.string("axxxf"), p.xs.double(2), p.xs.double(3), p.xs.string("bcde")], p.sql.insert(p.col("1"), p.col("2"), p.col("3"), p.col("4")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('abcdef');
            done();
        }).catch(done);
    });
    it('sql.instr#2', function(done) {
        testPlan([p.xs.string("abcde"), p.xs.string("cd")], p.sql.instr(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('3');
            done();
        }).catch(done);
    });
    it('sql.left#2', function(done) {
        testPlan([p.xs.string("abcde"), p.xs.double(3)], p.sql.left(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('abc');
            done();
        }).catch(done);
    });
    it('sql.ltrim#1', function(done) {
        testPlan([p.xs.string("abc")], p.sql.ltrim(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('abc');
            done();
        }).catch(done);
    });
    it('sql.minutes#1', function(done) {
        testPlan([p.xs.string("10:09:08")], p.sql.minutes(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('9');
            done();
        }).catch(done);
    });
    it('sql.month#1', function(done) {
        testPlan([p.xs.string("2016-01-02")], p.sql.month(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('1');
            done();
        }).catch(done);
    });
    it('sql.monthname#1', function(done) {
        testPlan([p.xs.string("2016-01-02")], p.sql.monthname(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('January');
            done();
        }).catch(done);
    });
    it('sql.octetLength#1', function(done) {
        testPlan([p.xs.string("abc")], p.sql.octetLength(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('3');
            done();
        }).catch(done);
    });
    it('sql.quarter#1', function(done) {
        testPlan([p.xs.string("2016-01-02")], p.sql.quarter(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('1');
            done();
        }).catch(done);
    });
    it('sql.repeat#2', function(done) {
        testPlan([p.xs.string("abc"), p.xs.double(2)], p.sql.repeat(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('abcabc');
            done();
        }).catch(done);
    });
    it('sql.right#2', function(done) {
        testPlan([p.xs.string("abcde"), p.xs.double(3)], p.sql.right(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('cde');
            done();
        }).catch(done);
    });
    it('sql.rtrim#1', function(done) {
        testPlan([p.xs.string("abc")], p.sql.rtrim(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('abc');
            done();
        }).catch(done);
    });
    it('sql.seconds#1', function(done) {
        testPlan([p.xs.string("10:09:08")], p.sql.seconds(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('8');
            done();
        }).catch(done);
    });
    it('sql.sign#1', function(done) {
        testPlan([p.xs.double(-3)], p.sql.sign(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('-1');
            done();
        }).catch(done);
    });
    it('sql.space#1', function(done) {
        testPlan([p.xs.double(1.2)], p.sql.space(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('');
            done();
        }).catch(done);
    });
    it('sql.trim#1', function(done) {
        testPlan([p.xs.string("abc")], p.sql.trim(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('abc');
            done();
        }).catch(done);
    });
    it('sql.week#1', function(done) {
        testPlan([p.xs.string("2016-01-02")], p.sql.week(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('53');
            done();
        }).catch(done);
    });
    it('sql.weekday#1', function(done) {
        testPlan([p.xs.string("2016-01-02")], p.sql.weekday(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('6');
            done();
        }).catch(done);
    });
    it('sql.year#1', function(done) {
        testPlan([p.xs.string("2016-01-02")], p.sql.year(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('2016');
            done();
        }).catch(done);
    });
    it('sql.yearday#1', function(done) {
        testPlan([p.xs.string("2016-01-02")], p.sql.yearday(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('2');
            done();
        }).catch(done);
    });
    it('xdmp.add64#2', function(done) {
        testPlan([p.xs.unsignedLong(123), p.xs.unsignedLong(456)], p.xdmp.add64(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('579');
            done();
        }).catch(done);
    });
    it('xdmp.and64#2', function(done) {
        testPlan([p.xs.unsignedLong(255), p.xs.unsignedLong(2)], p.xdmp.and64(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('2');
            done();
        }).catch(done);
    });
    it('xdmp.base64Decode#1', function(done) {
        testPlan([p.xs.string("aGVsbG8sIHdvcmxk")], p.xdmp.base64Decode(p.col("1")))
          .then(function(response) {
            should(getResult(response).value).eql("hello, world");
            done();
        }).catch(done);
    });
    it('xdmp.base64Encode#1', function(done) {
        testPlan([p.xs.string("hello, world")], p.xdmp.base64Encode(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('aGVsbG8sIHdvcmxk');
            done();
        }).catch(done);
    });
    it('xdmp.castableAs#3', function(done) {
        testPlan([p.xs.string("http://www.w3.org/2001/XMLSchema"), p.xs.string("int"), p.xs.string("1")], p.xdmp.castableAs(p.col("1"), p.col("2"), p.col("3")))
          .then(function(response) {
            should(getResult(response).value).eql(true);
            done();
        }).catch(done);
    });
    it('xdmp.crypt#2', function(done) {
        testPlan([p.xs.string("123abc"), p.xs.string("admin")], p.xdmp.crypt(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('arQEnpM6JHR8vY4n3e5gr0');
            done();
        }).catch(done);
    });
    it('xdmp.daynameFromDate#1', function(done) {
        testPlan([p.xs.date("2016-01-02")], p.xdmp.daynameFromDate(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('Saturday');
            done();
        }).catch(done);
    });
    it('xdmp.decodeFromNCName#1', function(done) {
        testPlan([p.xs.string("A_20_Name")], p.xdmp.decodeFromNCName(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('A Name');
            done();
        }).catch(done);
    });
    it('xdmp.diacriticLess#1', function(done) {
        testPlan([p.xs.string("abc")], p.xdmp.diacriticLess(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('abc');
            done();
        }).catch(done);
    });
    it('xdmp.encodeForNCName#1', function(done) {
        testPlan([p.xs.string("A Name")], p.xdmp.encodeForNCName(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('A_20_Name');
            done();
        }).catch(done);
    });
    it('xdmp.formatNumber#1', function(done) {
        testPlan([p.xs.double(9)], p.xdmp.formatNumber(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('9');
            done();
        }).catch(done);
    });
    it('xdmp.formatNumber#2', function(done) {
        testPlan([p.xs.double(9), p.xs.string("W")], p.xdmp.formatNumber(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('9');
            done();
        }).catch(done);
    });
    it('xdmp.formatNumber#3', function(done) {
        testPlan([p.xs.double(9), p.xs.string("W"), p.xs.string("en")], p.xdmp.formatNumber(p.col("1"), p.col("2"), p.col("3")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('NINE');
            done();
        }).catch(done);
    });
    it('xdmp.formatNumber#4', function(done) {
        testPlan([p.xs.double(9), p.xs.string("W"), p.xs.string("en"), p.xs.string("")], p.xdmp.formatNumber(p.col("1"), p.col("2"), p.col("3"), p.col("4")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('NINE');
            done();
        }).catch(done);
    });
    it('xdmp.formatNumber#5', function(done) {
        testPlan([p.xs.double(9), p.xs.string("W"), p.xs.string("en"), p.xs.string(""), p.xs.string("")], p.xdmp.formatNumber(p.col("1"), p.col("2"), p.col("3"), p.col("4"), p.col("5")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('NINE');
            done();
        }).catch(done);
    });
    it('xdmp.formatNumber#6', function(done) {
        testPlan([p.xs.double(9), p.xs.string("W"), p.xs.string("en"), p.xs.string(""), p.xs.string(""), p.xs.string("")], p.xdmp.formatNumber(p.col("1"), p.col("2"), p.col("3"), p.col("4"), p.col("5"), p.col("6")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('NINE');
            done();
        }).catch(done);
    });
    it('xdmp.formatNumber#7', function(done) {
        testPlan([p.xs.double(9), p.xs.string("W"), p.xs.string("en"), p.xs.string(""), p.xs.string(""), p.xs.string(""), p.xs.string(",")], p.xdmp.formatNumber(p.col("1"), p.col("2"), p.col("3"), p.col("4"), p.col("5"), p.col("6"), p.col("7")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('NINE');
            done();
        }).catch(done);
    });
    it('xdmp.formatNumber#8', function(done) {
        testPlan([p.xs.double(9), p.xs.string("W"), p.xs.string("en"), p.xs.string(""), p.xs.string(""), p.xs.string(""), p.xs.string(","), p.xs.integer(3)], p.xdmp.formatNumber(p.col("1"), p.col("2"), p.col("3"), p.col("4"), p.col("5"), p.col("6"), p.col("7"), p.col("8")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('NINE');
            done();
        }).catch(done);
    });
    it('xdmp.hash32#1', function(done) {
        testPlan([p.xs.string("abc")], p.xdmp.hash32(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('4229403455');
            done();
        }).catch(done);
    });
    it('xdmp.hash64#1', function(done) {
        testPlan([p.xs.string("abc")], p.xdmp.hash64(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('13056678368508584127');
            done();
        }).catch(done);
    });
    it('xdmp.hexToInteger#1', function(done) {
        testPlan([p.xs.string("1234567890abcdef")], p.xdmp.hexToInteger(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('1311768467294899695');
            done();
        }).catch(done);
    });
    it('xdmp.hmacMd5#2', function(done) {
        testPlan([p.xs.string("abc"), p.xs.string("def")], p.xdmp.hmacMd5(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('debda77b7cc3e7a10ee70104e6717a6b');
            done();
        }).catch(done);
    });
    it('xdmp.hmacMd5#3', function(done) {
        testPlan([p.xs.string("abc"), p.xs.string("def"), p.xs.string("base64")], p.xdmp.hmacMd5(p.col("1"), p.col("2"), p.col("3")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('3r2ne3zD56EO5wEE5nF6aw==');
            done();
        }).catch(done);
    });
    it('xdmp.hmacSha1#2', function(done) {
        testPlan([p.xs.string("abc"), p.xs.string("def")], p.xdmp.hmacSha1(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('12554eabbaf7e8e12e4737020f987ca7901016e5');
            done();
        }).catch(done);
    });
    it('xdmp.hmacSha1#3', function(done) {
        testPlan([p.xs.string("abc"), p.xs.string("def"), p.xs.string("base64")], p.xdmp.hmacSha1(p.col("1"), p.col("2"), p.col("3")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('ElVOq7r36OEuRzcCD5h8p5AQFuU=');
            done();
        }).catch(done);
    });
    it('xdmp.hmacSha256#2', function(done) {
        testPlan([p.xs.string("abc"), p.xs.string("def")], p.xdmp.hmacSha256(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('20ebc0f09344470134f35040f63ea98b1d8e414212949ee5c500429d15eab081');
            done();
        }).catch(done);
    });
    it('xdmp.hmacSha256#3', function(done) {
        testPlan([p.xs.string("abc"), p.xs.string("def"), p.xs.string("base64")], p.xdmp.hmacSha256(p.col("1"), p.col("2"), p.col("3")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('IOvA8JNERwE081BA9j6pix2OQUISlJ7lxQBCnRXqsIE=');
            done();
        }).catch(done);
    });
    it('xdmp.hmacSha512#2', function(done) {
        testPlan([p.xs.string("abc"), p.xs.string("def")], p.xdmp.hmacSha512(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('bf93c3deee1eb6660ec00820a285327b3e8b775f641fd7f2ea321b6a241afe7b49a5cca81d2e8e1d206bd3379530e2d9ad3a7b2cc54ca66ea3352ebfee3862e5');
            done();
        }).catch(done);
    });
    it('xdmp.hmacSha512#3', function(done) {
        testPlan([p.xs.string("abc"), p.xs.string("def"), p.xs.string("base64")], p.xdmp.hmacSha512(p.col("1"), p.col("2"), p.col("3")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('v5PD3u4etmYOwAggooUyez6Ld19kH9fy6jIbaiQa/ntJpcyoHS6OHSBr0zeVMOLZrTp7LMVMpm6jNS6/7jhi5Q==');
            done();
        }).catch(done);
    });
    it('xdmp.initcap#1', function(done) {
        testPlan([p.xs.string("abc")], p.xdmp.initcap(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('Abc');
            done();
        }).catch(done);
    });
    it('xdmp.integerToHex#1', function(done) {
        testPlan([p.xs.integer(123)], p.xdmp.integerToHex(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('7b');
            done();
        }).catch(done);
    });
    it('xdmp.integerToOctal#1', function(done) {
        testPlan([p.xs.integer(123)], p.xdmp.integerToOctal(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('173');
            done();
        }).catch(done);
    });
    it('xdmp.keyFromQName#1', function(done) {
        testPlan([p.xs.QName("abc")], p.xdmp.keyFromQName(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('abc');
            done();
        }).catch(done);
    });
    it('xdmp.lshift64#2', function(done) {
        testPlan([p.xs.unsignedLong(255), p.xs.long(2)], p.xdmp.lshift64(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('1020');
            done();
        }).catch(done);
    });
    it('xdmp.md5#1', function(done) {
        testPlan([p.xs.string("abc")], p.xdmp.md5(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('900150983cd24fb0d6963f7d28e17f72');
            done();
        }).catch(done);
    });
    it('xdmp.md5#2', function(done) {
        testPlan([p.xs.string("abc"), p.xs.string("base64")], p.xdmp.md5(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('kAFQmDzST7DWlj99KOF/cg==');
            done();
        }).catch(done);
    });
    it('xdmp.monthNameFromDate#1', function(done) {
        testPlan([p.xs.date("2016-01-02")], p.xdmp.monthNameFromDate(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('January');
            done();
        }).catch(done);
    });
    it('xdmp.mul64#2', function(done) {
        testPlan([p.xs.unsignedLong(123), p.xs.unsignedLong(456)], p.xdmp.mul64(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('56088');
            done();
        }).catch(done);
    });
    it('xdmp.not64#1', function(done) {
        testPlan([p.xs.unsignedLong(255)], p.xdmp.not64(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('18446744073709551360');
            done();
        }).catch(done);
    });
    it('xdmp.octalToInteger#1', function(done) {
        testPlan([p.xs.string("12345670")], p.xdmp.octalToInteger(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('2739128');
            done();
        }).catch(done);
    });
    it('xdmp.or64#2', function(done) {
        testPlan([p.xs.unsignedLong(255), p.xs.unsignedLong(2)], p.xdmp.or64(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('255');
            done();
        }).catch(done);
    });
    it('xdmp.position#2', function(done) {
        testPlan([p.xs.string("abcdef"), p.xs.string("cd")], p.xdmp.position(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('0');
            done();
        }).catch(done);
    });
    it('xdmp.position#3', function(done) {
        testPlan([p.xs.string("abcdef"), p.xs.string("cd"), p.xs.string("http://marklogic.com/collation/")], p.xdmp.position(p.col("1"), p.col("2"), p.col("3")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('0');
            done();
        }).catch(done);
    });
    it('xdmp.QNameFromKey#1', function(done) {
        testPlan([p.xs.string("{http://a/b}c")], p.xdmp.QNameFromKey(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('c');
            done();
        }).catch(done);
    });
    it('xdmp.quarterFromDate#1', function(done) {
        testPlan([p.xs.date("2016-01-02")], p.xdmp.quarterFromDate(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('1');
            done();
        }).catch(done);
    });
    it('xdmp.resolveUri#2', function(done) {
        testPlan([p.xs.string("b?c#d"), p.xs.string("/a/x")], p.xdmp.resolveUri(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('/a/b?c#d');
            done();
        }).catch(done);
    });
    it('xdmp.rshift64#2', function(done) {
        testPlan([p.xs.unsignedLong(255), p.xs.long(2)], p.xdmp.rshift64(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('63');
            done();
        }).catch(done);
    });
    it('xdmp.sha1#1', function(done) {
        testPlan([p.xs.string("abc")], p.xdmp.sha1(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('a9993e364706816aba3e25717850c26c9cd0d89d');
            done();
        }).catch(done);
    });
    it('xdmp.sha1#2', function(done) {
        testPlan([p.xs.string("abc"), p.xs.string("base64")], p.xdmp.sha1(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('qZk+NkcGgWq6PiVxeFDCbJzQ2J0=');
            done();
        }).catch(done);
    });
    it('xdmp.sha256#1', function(done) {
        testPlan([p.xs.string("abc")], p.xdmp.sha256(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
            done();
        }).catch(done);
    });
    it('xdmp.sha256#2', function(done) {
        testPlan([p.xs.string("abc"), p.xs.string("base64")], p.xdmp.sha256(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('ungWv48Bz+pBQUDeXa4iI7ADYaOWF3qctBD/YfIAFa0=');
            done();
        }).catch(done);
    });
    it('xdmp.sha384#1', function(done) {
        testPlan([p.xs.string("abc")], p.xdmp.sha384(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('cb00753f45a35e8bb5a03d699ac65007272c32ab0eded1631a8b605a43ff5bed8086072ba1e7cc2358baeca134c825a7');
            done();
        }).catch(done);
    });
    it('xdmp.sha384#2', function(done) {
        testPlan([p.xs.string("abc"), p.xs.string("base64")], p.xdmp.sha384(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('ywB1P0WjXou1oD1pmsZQBycsMqsO3tFjGotgWkP/W+2AhgcroefMI1i67KE0yCWn');
            done();
        }).catch(done);
    });
    it('xdmp.sha512#1', function(done) {
        testPlan([p.xs.string("abc")], p.xdmp.sha512(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f');
            done();
        }).catch(done);
    });
    it('xdmp.sha512#2', function(done) {
        testPlan([p.xs.string("abc"), p.xs.string("base64")], p.xdmp.sha512(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('3a81oZNherrMQXNJriBBMRLm+k6JqX6iCp7u5ktV05ohkpkqJ0/BqDa6PCOj/uu9RU1EI2Q86A4qmslPpUyknw==');
            done();
        }).catch(done);
    });
    it('xdmp.step64#2', function(done) {
        testPlan([p.xs.unsignedLong(123), p.xs.unsignedLong(456)], p.xdmp.step64(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('8966314677');
            done();
        }).catch(done);
    });
    it('xdmp.type#1', function(done) {
        testPlan([p.xs.string("a")], p.xdmp.type(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('string');
            done();
        }).catch(done);
    });
    it('xdmp.urlDecode#1', function(done) {
        testPlan([p.xs.string("a+b")], p.xdmp.urlDecode(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('a b');
            done();
        }).catch(done);
    });
    it('xdmp.urlEncode#1', function(done) {
        testPlan([p.xs.string("a b")], p.xdmp.urlEncode(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('a+b');
            done();
        }).catch(done);
    });
    it('xdmp.weekFromDate#1', function(done) {
        testPlan([p.xs.date("2016-01-02")], p.xdmp.weekFromDate(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('53');
            done();
        }).catch(done);
    });
    it('xdmp.weekdayFromDate#1', function(done) {
        testPlan([p.xs.date("2016-01-02")], p.xdmp.weekdayFromDate(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('6');
            done();
        }).catch(done);
    });
    it('xdmp.xor64#2', function(done) {
        testPlan([p.xs.unsignedLong(255), p.xs.unsignedLong(2)], p.xdmp.xor64(p.col("1"), p.col("2")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('253');
            done();
        }).catch(done);
    });
    it('xdmp.yeardayFromDate#1', function(done) {
        testPlan([p.xs.date("2016-01-02")], p.xdmp.yeardayFromDate(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('2');
            done();
        }).catch(done);
    });
    it('xs.anyURI#1', function(done) {
        testPlan([p.xs.string("http://a/b?c#d")], p.xs.anyURI(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('http://a/b?c#d');
            done();
        }).catch(done);
    });
    it('xs.base64Binary#1', function(done) {
        testPlan([p.xs.string("aGVsbG8sIHdvcmxk")], p.xs.base64Binary(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('aGVsbG8sIHdvcmxk');
            done();
        }).catch(done);
    });
    it('xs.boolean#1', function(done) {
        testPlan([p.xs.boolean(true)], p.xs.boolean(p.col("1")))
          .then(function(response) {
            should(getResult(response).value).eql(true);
            done();
        }).catch(done);
    });
    it('xs.byte#1', function(done) {
        testPlan([p.xs.double(1)], p.xs.byte(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('1');
            done();
        }).catch(done);
    });
    it('xs.date#1', function(done) {
        testPlan([p.xs.string("2016-01-02")], p.xs.date(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('2016-01-02');
            done();
        }).catch(done);
    });
    it('xs.dateTime#1', function(done) {
        testPlan([p.xs.string("2016-01-02T10:09:08Z")], p.xs.dateTime(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('2016-01-02T10:09:08Z');
            done();
        }).catch(done);
    });
    it('xs.dayTimeDuration#1', function(done) {
        testPlan([p.xs.string("P3DT4H5M6S")], p.xs.dayTimeDuration(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('P3DT4H5M6S');
            done();
        }).catch(done);
    });
    it('xs.decimal#1', function(done) {
        testPlan([p.xs.double(1.2)], p.xs.decimal(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('1.2');
            done();
        }).catch(done);
    });
    it('xs.double#1', function(done) {
        testPlan([p.xs.double(1.2)], p.xs.double(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('1.2');
            done();
        }).catch(done);
    });
    it('xs.float#1', function(done) {
        testPlan([p.xs.double(1)], p.xs.float(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('1');
            done();
        }).catch(done);
    });
    it('xs.gDay#1', function(done) {
        testPlan([p.xs.string("---02")], p.xs.gDay(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('---02');
            done();
        }).catch(done);
    });
    it('xs.gMonth#1', function(done) {
        testPlan([p.xs.string("--01")], p.xs.gMonth(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('--01');
            done();
        }).catch(done);
    });
    it('xs.gMonthDay#1', function(done) {
        testPlan([p.xs.string("--01-02")], p.xs.gMonthDay(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('--01-02');
            done();
        }).catch(done);
    });
    it('xs.gYear#1', function(done) {
        testPlan([p.xs.string("2016")], p.xs.gYear(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('2016');
            done();
        }).catch(done);
    });
    it('xs.gYearMonth#1', function(done) {
        testPlan([p.xs.string("2016-01")], p.xs.gYearMonth(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('2016-01');
            done();
        }).catch(done);
    });
    it('xs.hexBinary#1', function(done) {
        testPlan([p.xs.string("68656c6c6f2c20776f726c64")], p.xs.hexBinary(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('68656C6C6F2C20776F726C64');
            done();
        }).catch(done);
    });
    it('xs.int#1', function(done) {
        testPlan([p.xs.double(1)], p.xs.int(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('1');
            done();
        }).catch(done);
    });
    it('xs.integer#1', function(done) {
        testPlan([p.xs.double(1)], p.xs.integer(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('1');
            done();
        }).catch(done);
    });
    it('xs.language#1', function(done) {
        testPlan([p.xs.string("en-US")], p.xs.language(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('en-US');
            done();
        }).catch(done);
    });
    it('xs.long#1', function(done) {
        testPlan([p.xs.double(1)], p.xs.long(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('1');
            done();
        }).catch(done);
    });
    it('xs.Name#1', function(done) {
        testPlan([p.xs.string("a:b:c")], p.xs.Name(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('a:b:c');
            done();
        }).catch(done);
    });
    it('xs.NCName#1', function(done) {
        testPlan([p.xs.string("a-b-c")], p.xs.NCName(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('a-b-c');
            done();
        }).catch(done);
    });
    it('xs.negativeInteger#1', function(done) {
        testPlan([p.xs.double(-1)], p.xs.negativeInteger(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('-1');
            done();
        }).catch(done);
    });
    it('xs.NMTOKEN#1', function(done) {
        testPlan([p.xs.string("a:b:c")], p.xs.NMTOKEN(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('a:b:c');
            done();
        }).catch(done);
    });
    it('xs.nonNegativeInteger#1', function(done) {
        testPlan([p.xs.string("0")], p.xs.nonNegativeInteger(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('0');
            done();
        }).catch(done);
    });
    it('xs.nonPositiveInteger#1', function(done) {
        testPlan([p.xs.string("0")], p.xs.nonPositiveInteger(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('0');
            done();
        }).catch(done);
    });
    it('xs.normalizedString#1', function(done) {
        testPlan([p.xs.string("a b c")], p.xs.normalizedString(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('a b c');
            done();
        }).catch(done);
    });
    it('xs.numeric#1', function(done) {
        testPlan([p.xs.double(1.2)], p.xs.numeric(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('1.2');
            done();
        }).catch(done);
    });
    it('xs.positiveInteger#1', function(done) {
        testPlan([p.xs.double(1)], p.xs.positiveInteger(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('1');
            done();
        }).catch(done);
    });
    it('xs.QName#1', function(done) {
        testPlan([p.xs.string("abc")], p.xs.QName(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('abc');
            done();
        }).catch(done);
    });
    it('xs.short#1', function(done) {
        testPlan([p.xs.double(1)], p.xs.short(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('1');
            done();
        }).catch(done);
    });
    it('xs.string#1', function(done) {
        testPlan([p.xs.string("abc")], p.xs.string(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('abc');
            done();
        }).catch(done);
    });
    it('xs.time#1', function(done) {
        testPlan([p.xs.string("10:09:08Z")], p.xs.time(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('10:09:08Z');
            done();
        }).catch(done);
    });
    it('xs.token#1', function(done) {
        testPlan([p.xs.string("a b c")], p.xs.token(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('a b c');
            done();
        }).catch(done);
    });
    it('xs.unsignedByte#1', function(done) {
        testPlan([p.xs.double(1)], p.xs.unsignedByte(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('1');
            done();
        }).catch(done);
    });
    it('xs.unsignedInt#1', function(done) {
        testPlan([p.xs.double(1)], p.xs.unsignedInt(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('1');
            done();
        }).catch(done);
    });
    it('xs.unsignedLong#1', function(done) {
        testPlan([p.xs.double(1)], p.xs.unsignedLong(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('1');
            done();
        }).catch(done);
    });
    it('xs.unsignedShort#1', function(done) {
        testPlan([p.xs.double(1)], p.xs.unsignedShort(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('1');
            done();
        }).catch(done);
    });
    it('xs.untypedAtomic#1', function(done) {
        testPlan([p.xs.string("abc")], p.xs.untypedAtomic(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('abc');
            done();
        }).catch(done);
    });
    it('xs.yearMonthDuration#1', function(done) {
        testPlan([p.xs.string("P1Y2M")], p.xs.yearMonthDuration(p.col("1")))
          .then(function(response) {
            should(String(getResult(response).value).replace(/^ /, '')).equal('P1Y2M');
            done();
        }).catch(done);
    });
  });
  describe('expression operators', function() {
    it('add#2', function(done) {
        testPlan([p.xs.double(1), p.xs.double(2)], p.add(p.col("1"), p.col("2")))
          .then(function(response) {
            should(getResult(response).value).equal(3);
            done();
        }).catch(done);
    });
    it('add#3', function(done) {
        testPlan([p.xs.double(1), p.xs.double(2), p.xs.double(3)], p.add(p.col("1"), p.col("2"), p.col("3")))
          .then(function(response) {
            should(getResult(response).value).equal(6);
            done();
        }).catch(done);
    });
    it('and#2', function(done) {
        testPlan([p.xs.boolean(true), p.xs.boolean(true)], p.and(p.col("1"), p.col("2")))
          .then(function(response) {
            should(getResult(response).value).equal(true);
            done();
        }).catch(done);
    });
    it('and#3', function(done) {
        testPlan([p.xs.boolean(true), p.xs.boolean(true), p.xs.boolean(true)], p.and(p.col("1"), p.col("2"), p.col("3")))
          .then(function(response) {
            should(getResult(response).value).equal(true);
            done();
        }).catch(done);
    });
    it('divide#2', function(done) {
        testPlan([p.xs.double(6), p.xs.double(2)], p.divide(p.col("1"), p.col("2")))
          .then(function(response) {
            should(getResult(response).value).equal(3);
            done();
        }).catch(done);
    });
    it('eq#2', function(done) {
        testPlan([p.xs.double(1), p.xs.double(1)], p.eq(p.col("1"), p.col("2")))
          .then(function(response) {
            should(getResult(response).value).equal(true);
            done();
        }).catch(done);
    });
    it('ge#2', function(done) {
        testPlan([p.xs.double(1), p.xs.double(1)], p.ge(p.col("1"), p.col("2")))
          .then(function(response) {
            should(getResult(response).value).equal(true);
            done();
        }).catch(done);
    });
    it('gt#2', function(done) {
        testPlan([p.xs.double(2), p.xs.double(1)], p.gt(p.col("1"), p.col("2")))
          .then(function(response) {
            should(getResult(response).value).equal(true);
            done();
        }).catch(done);
    });
    it('le#2', function(done) {
        testPlan([p.xs.double(1), p.xs.double(1)], p.le(p.col("1"), p.col("2")))
          .then(function(response) {
            should(getResult(response).value).equal(true);
            done();
        }).catch(done);
    });
    it('lt#2', function(done) {
        testPlan([p.xs.double(1), p.xs.double(2)], p.lt(p.col("1"), p.col("2")))
          .then(function(response) {
            should(getResult(response).value).equal(true);
            done();
        }).catch(done);
    });
    it('multiply#2', function(done) {
        testPlan([p.xs.double(2), p.xs.double(3)], p.multiply(p.col("1"), p.col("2")))
          .then(function(response) {
            should(getResult(response).value).equal(6);
            done();
        }).catch(done);
    });
    it('multiply#3', function(done) {
        testPlan([p.xs.double(2), p.xs.double(3), p.xs.double(4)], p.multiply(p.col("1"), p.col("2"), p.col("3")))
          .then(function(response) {
            should(getResult(response).value).equal(24);
            done();
        }).catch(done);
    });
    it('ne#2', function(done) {
        testPlan([p.xs.double(1), p.xs.double(2)], p.ne(p.col("1"), p.col("2")))
          .then(function(response) {
            should(getResult(response).value).equal(true);
            done();
        }).catch(done);
    });
    it('not#1', function(done) {
        testPlan([p.xs.boolean(false)], p.not(p.col("1")))
          .then(function(response) {
            should(getResult(response).value).equal(true);
            done();
        }).catch(done);
    });
    it('or#2', function(done) {
        testPlan([p.xs.boolean(false), p.xs.boolean(true)], p.or(p.col("1"), p.col("2")))
          .then(function(response) {
            should(getResult(response).value).equal(true);
            done();
        }).catch(done);
    });
    it('or#3', function(done) {
        testPlan([p.xs.boolean(false), p.xs.boolean(true), p.xs.boolean(false)], p.or(p.col("1"), p.col("2"), p.col("3")))
          .then(function(response) {
            should(getResult(response).value).equal(true);
            done();
        }).catch(done);
    });
    it('subtract#2', function(done) {
        testPlan([p.xs.double(3), p.xs.double(2)], p.subtract(p.col("1"), p.col("2")))
          .then(function(response) {
            should(getResult(response).value).equal(1);
            done();
        }).catch(done);
    });
  });
});
