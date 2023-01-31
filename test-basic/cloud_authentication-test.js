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

const marklogic = require('../');
let assert = require('assert');

describe('cloud-authentication tests', function() {
    it('should throw error without apiKey.', function(done){
        try{
            marklogic.createDatabaseClient({
                host:     'invalid',
                authType: 'cloud'
            });
        } catch(error) {
            assert(error.toString().includes('apiKey needed for MarkLogic cloud authentication.'));
            done();
        }
    });
});
