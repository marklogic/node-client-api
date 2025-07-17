/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

'use strict';

const marklogic = require('../');
const should = require('should');
const testconfig = require('../etc/test-config');
const expect = require('chai').expect;

const dbReader = marklogic.createDatabaseClient(testconfig.restReaderConnection);
const dbWriter = marklogic.createDatabaseClient(testconfig.restWriterConnection);

const p = marklogic.planBuilder;

describe('redact test', function () {

    it('maskDeterministic test', function(done){
        const str = 'What is truth?';
        const lit = p.fromLiterals({cDefault:str,  cCharMixedCase:str});
        const redactLit = lit.bind([p.rdt.maskDeterministic('cDefault'),
            p.rdt.maskDeterministic('cCharMixedCase',  {character:'mixedCase'})]);
        const anyRegex = /^[A-za-z0-9+=\/]+$/;

        dbReader.rows.query(redactLit)
            .then(function (response) {
                response['rows'].length.should.equal(1);
                const rowValue = response['rows'][0];
                const cDefault = rowValue.cDefault.value;
                expect(cDefault).to.match(anyRegex);

                const mixedCaseValue = rowValue.cCharMixedCase.value;
                expect(mixedCaseValue).to.match(/^[A-Za-z]+$/);
                done();
            })
            .catch(err => {
                done(err);
            });
    });

    it('maskRandom test', function(done){
        const str = 'What is truth?';
        const lit = p.fromLiterals({cDefault:str,  cCharMixedCase:str});
        const redactLit = lit.bind([p.rdt.maskRandom('cDefault'),
            p.rdt.maskRandom('cCharMixedCase',  {character:'mixedCase'})]);
        const anyRegex = /^[A-za-z0-9+=\/]+$/;

        dbReader.rows.query(redactLit)
            .then(function (response) {
                response['rows'].length.should.equal(1);
                const rowValue = response['rows'][0];
                const cDefault = rowValue.cDefault.value;
                expect(cDefault).to.match(anyRegex);

                const mixedCaseValue = rowValue.cCharMixedCase.value;
                expect(mixedCaseValue).to.match(/^[A-Za-z]+$/);
                done();
            })
            .catch(err => {
                done(err);
            });
    });

    it('redactDatetime test', function(done){
        const str = '12/31/2019';
        const lit = p.fromLiterals({cParsed:str,  cRandom:str});
        const parsedOptions = {level: 'parsed', picture:'[M01]/[D01]/[Y0001]', format: 'xx/xx/[Y01]'};
        const randomOptions = {level: 'random', range:'2000,2020'};
        const redactLit = lit.bind([p.rdt.redactDatetime('cParsed', parsedOptions),
            p.rdt.redactDatetime('cRandom', randomOptions)]);

        dbReader.rows.query(redactLit)
            .then(function (response) {
                response['rows'].length.should.equal(1);
                const rowValue = response['rows'][0];
                expect(rowValue.cParsed.value).to.equal('xx/xx/19');
                expect(rowValue.cRandom.value).to.match(/^20\d{2}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+$/);
                done();
            })
            .catch(err => {
                done(err);
            });
    });

    it('redactEmail test', function(done){
        const str = 'thename1@thedomain1.com';
        const lit = p.fromLiterals({default:str,  name:str});
        const redactLit = lit.bind([p.rdt.redactEmail('default'),
            p.rdt.redactEmail('name',  {level:'name'})]);

        dbReader.rows.query(redactLit)
            .then(function (response) {
                response['rows'].length.should.equal(1);
                const rowValue = response['rows'][0];
                const cDefault = rowValue.default.value;
                expect(cDefault).to.equal('NAME@DOMAIN');
                expect(rowValue.name.value).to.equal('NAME@thedomain1.com');
                done();
            })
            .catch(err => {
                done(err);
            });
    });

    it('redactIpv4 test', function(done){
        const str = '123.145.167.189';
        const lit = p.fromLiterals({cDefault:str,  cChar:str});
        const redactLit = lit.bind([p.rdt.redactIpv4('cDefault'),
            p.rdt.redactIpv4('cChar',  {character:'x'})]);
        dbReader.rows.query(redactLit)
            .then(function (response) {
                response['rows'].length.should.equal(1);
                const rowValue = response['rows'][0];
                const cDefault = rowValue.cDefault.value;
                expect(cDefault).to.equal('###.###.###.###');
                expect(rowValue.cChar.value).to.equal('xxx.xxx.xxx.xxx');
                done();
            })
            .catch(err => {
                done(err);
            });
    });

    it('redactNumber test', function(done){
        var a =1;
        var b =1.3;
        const lit = p.fromLiterals({cDefault:a,  cDouble:b});
        const redactLit = lit.bind([p.rdt.redactNumber('cDefault'),
            p.rdt.redactNumber('cDouble',  {type:'double', min:2, max:4})]);
        dbWriter.rows.query(redactLit)
            .then(function (response) {
                response['rows'].length.should.equal(1);
                const rowValue = response['rows'][0];
                const cDefault = rowValue.cDefault.value;
                expect(cDefault).to.match(/^\d+$/);
                expect(rowValue.cDouble.value).to.be.greaterThan(1.999999);
                expect(rowValue.cDouble.value).to.be.lessThan(   4.000001);
                done();
            })
            .catch(err => {
                done(err);
            });
    });

    it('redactRegex test', function(done){
        const lit = p.fromLiterals({cTarget:'thetargettext'});
        const parsedOptions = {pattern: 'tar([a-z])et', replacement:'=$1='};
        const redactLit = lit.bind(p.rdt.redactRegex('cTarget', parsedOptions));

        dbReader.rows.query(redactLit)
            .then(function (response) {
                response['rows'].length.should.equal(1);
                const rowValue = response['rows'][0];
                expect(rowValue.cTarget.value).to.equal('the=g=text');
                done();
            })
            .catch(err => {
                done(err);
            });
    });

    it('redactUsSsn test', function(done){
        const str = '123-45-6789';
        const lit = p.fromLiterals({default:str,  random:str});
        const redactLit = lit.bind([p.rdt.redactUsSsn('default'),
            p.rdt.redactUsSsn('random',  {level:'full-random'})]);
        dbReader.rows.query(redactLit)
            .then(function (response) {
                response['rows'].length.should.equal(1);
                const rowValue = response['rows'][0];
                const cDefault = rowValue.default.value;
                expect(cDefault).to.equal('###-##-####');
                expect(rowValue.random.value).to.match(/^\d{3}-\d{2}-\d{4}$/);
                done();
            })
            .catch(err => {
                done(err);
            });
    });

    it('redactUsPhone test', function(done){
        const str = '123-456-7890';
        const lit = p.fromLiterals({default:str,  random:str});
        const redactLit = lit.bind([p.rdt.redactUsPhone('default'),
            p.rdt.redactUsPhone('random',  {level:'full-random'})]);
        dbReader.rows.query(redactLit)
            .then(function (response) {
                response['rows'].length.should.equal(1);
                const rowValue = response['rows'][0];
                const cDefault = rowValue.default.value;
                expect(cDefault).to.equal('###-###-####');
                expect(rowValue.random.value).to.match(/^\d{3}-\d{3}-\d{4}$/);
                done();
            })
            .catch(err => {
                done(err);
            });
    });
});

