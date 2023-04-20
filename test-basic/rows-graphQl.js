/*
 * Copyright (c) 2023 MarkLogic Corporation
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

const testconfig = require('../etc/test-config.js');
const marklogic = require('../');
const db = marklogic.createDatabaseClient(testconfig.restWriterConnection);
const assert = require('assert');
const volumeSet = new Set().add('118').add('120');
const dateSet = new Set().add('1970-12-07').add('1968-12-07');
const idSet = new Set().add(123).add(456);
const issnSet = new Set().add('1234').add('5678');

describe('graphQL endpoint tests', function() {

    it('should throw error when graphql query is not provided', function (done) {
        try{
            db.rows.graphQL();
        } catch (e){
            assert(e.toString().includes('graphql query required'));
            done();
        }
    });

    it('should return values based on the graphQL query.', function (done) {
        const q = {"query": "query AllPublications { Medical_Publications { ID ISSN Volume Date } }"};
        db.rows.graphQL(q).then(res => {
            const publications = res.data.Medical_Publications;
            assert(publications);
            assert(publications.length === 2);
            assert(volumeSet.has(publications[0].Volume));
            assert(volumeSet.has(publications[1].Volume));
            assert(dateSet.has(publications[0].Date));
            assert(dateSet.has(publications[1].Date));
            assert(idSet.has(publications[0].ID));
            assert(idSet.has(publications[1].ID));
            assert(issnSet.has(publications[0].ISSN));
            assert(issnSet.has(publications[1].ISSN));
            done();
        }).catch(e => {
            done(e);
        });
    });

    after(function(done){
        marklogic.releaseClient(db);
        done();
    });
});
