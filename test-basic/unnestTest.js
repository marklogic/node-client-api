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
const assert = require('assert');
const marklogic = require('../');
const testconfig = require('../etc/test-config.js');
const db = marklogic.createDatabaseClient(testconfig.restWriterConnection);
const op = marklogic.planBuilder;

const TEAM_MEMBER_NAME_COLUMN = "teamMemberName";


describe('test unnest function', function () {

    beforeEach(function (done) {

        db.documents.remove(['/optic/test/office1.json'])
            .result(function(_response){

            })
            .catch(err=> {});

        const doc = {
            office: [
                { department: "Engineering", teamMembers: "Cindy,Alice,Dan" },
                { department: "Sales", teamMembers: "Bob" },
                { department: "Marketing", teamMembers: null }
            ]
        };

        db.documents.write({
            uri: '/optic/test/office1.json',
            contentType: 'application/json',
            content: doc
        }).result(function() {
            done();
        }, function(error) {
            done(error);
        });
    });

    it('unnestInner', function (done) {
        db.rows.query(op.fromView(
                "unnestSchema",
                "unnestView"
            )
                .bind(
                    op.as(
                        "teamMemberNameArray",
                        op.fn.tokenize(
                            op.col("teamMembers"),
                            op.xs.string(",")
                        )
                    )
                )
                .unnestInner("teamMemberNameArray", TEAM_MEMBER_NAME_COLUMN)
                .orderBy(op.col(TEAM_MEMBER_NAME_COLUMN))
                .select(["teamMemberName", "department"])
        )
            .then((response) => {
                const rows = response.rows;
                // response rows it will be something like this: [{"teamMemberName":{"type":"xs:string","value":"Alice"},"unnestSchema.unnestView.department":{"type":"xs:string","value":"Engineering"}},{"teamMemberName":{"type":"xs:string","value":"Bob"},"unnestSchema.unnestView.department":{"type":"xs:string","value":"Sales"}},{"teamMemberName":{"type":"xs:string","value":"Cindy"},"unnestSchema.unnestView.department":{"type":"xs:string","value":"Engineering"}},{"teamMemberName":{"type":"xs:string","value":"Dan"},"unnestSchema.unnestView.department":{"type":"xs:string","value":"Engineering"}}]
                assert.equal(rows.length, 4, "The 3 incoming rows should result in 4 rows due to the unnestInner operation " +
                    "creating a row for each team member name, and there are 4 team member names");
                assert.equal(rows[0][TEAM_MEMBER_NAME_COLUMN].value, "Alice", "Alice should be first since the rows " +
                    "are ordered by team member name");
                assert.equal(rows[1][TEAM_MEMBER_NAME_COLUMN].value, "Bob");
                assert.equal(rows[2][TEAM_MEMBER_NAME_COLUMN].value, "Cindy");
                assert.equal(rows[3][TEAM_MEMBER_NAME_COLUMN].value, "Dan");
                done();
            }).catch(err => done(err));

    });
    it('unnestInnerWithOrdinality', function (done) {
        db.rows.query(op.fromView(
                "unnestSchema",
                "unnestView"
            )
                .bind(
                    op.as(
                        "teamMemberNameArray",
                        op.fn.tokenize(
                            op.col("teamMembers"),
                            op.xs.string(",")
                        )
                    )
                )
                .unnestInner("teamMemberNameArray", TEAM_MEMBER_NAME_COLUMN, "index")
                .orderBy(op.col(TEAM_MEMBER_NAME_COLUMN))
        )
            .then((response) => {
                const rows = response.rows;
                assert.equal(rows.length, 4, "The 3 incoming rows should result in 4 rows due to the unnestInner operation " +
                    "creating a row for each team member name, and there are 4 team member names");
                assert.equal(rows[0][TEAM_MEMBER_NAME_COLUMN].value, "Alice", "Alice should be first since the rows " +
                    "are ordered by team member name");
                assert.equal(rows[0].index.value, 2, "The ordinality column is expected to capture the index of the value in the array that it came from, " +
                    "where the index is 1-based, not 0-based");
                assert.equal(rows[1][TEAM_MEMBER_NAME_COLUMN].value, "Bob");
                assert.equal(rows[1].index.value, 1);
                assert.equal(rows[2][TEAM_MEMBER_NAME_COLUMN].value, "Cindy");
                assert.equal(rows[2].index.value, 1);
                assert.equal(rows[3][TEAM_MEMBER_NAME_COLUMN].value, "Dan");
                assert.equal(rows[3].index.value, 3);
                done();
            }).catch(err => done(err));
    });
    it('unnestLeftOuter', function (done) {
        db.rows.query(op.fromView(
                "unnestSchema",
                "unnestView"
            )
                .bind(
                    op.as(
                        "teamMemberNameArray",
                        op.fn.tokenize(
                            op.col("teamMembers"),
                            op.xs.string(",")
                        )
                    )
                )
                .unnestLeftOuter("teamMemberNameArray", TEAM_MEMBER_NAME_COLUMN)
                .orderBy(op.col(TEAM_MEMBER_NAME_COLUMN))
        )
            .then((response) => {
                const rows = response.rows;
                assert.equal(rows.length, 5, "The 4 incoming rows should result in 5 rows due to the unnestLeftOuter operation " +
                    "creating a row for each team member name, even if the array is null, and there are 4 team member names in total");
                assert.equal(rows[0][TEAM_MEMBER_NAME_COLUMN].value, "Alice", "Alice should be first since the rows " +
                    "are ordered by team member name");
                assert.equal(rows[1][TEAM_MEMBER_NAME_COLUMN].value, "Bob");
                assert.equal(rows[2][TEAM_MEMBER_NAME_COLUMN].value, "Cindy");
                assert.equal(rows[3][TEAM_MEMBER_NAME_COLUMN].value, "Dan");
                assert.equal(rows[4][TEAM_MEMBER_NAME_COLUMN].value, null, "unnestLeftOuter should include rows where the array is null, " +
                    "and thus the Marketing row should be retained");
                assert.equal(rows[4]["unnestSchema.unnestView.department"].value, "Marketing");
                done();
            }).catch(err => done(err));
    });
    it('unnestLeftOuterWithOrdinality', function (done) {
        db.rows.query(op.fromView(
                "unnestSchema",
                "unnestView"
            )
                .bind(
                    op.as(
                        "teamMemberNameArray",
                        op.fn.tokenize(
                            op.col("teamMembers"),
                            op.xs.string(",")
                        )
                    )
                )
                .unnestLeftOuter("teamMemberNameArray", TEAM_MEMBER_NAME_COLUMN, "myIndex")
                .orderBy(op.col(TEAM_MEMBER_NAME_COLUMN))
        )
            .then((response) => {
                const rows = response.rows;
                assert.equal(rows.length, 5, "The 4 incoming rows should result in 5 rows due to the unnestLeftOuter operation " +
                    "creating a row for each team member name, even if the array is null, and there are 4 team member names in total");
                assert.equal(rows[0][TEAM_MEMBER_NAME_COLUMN].value, "Alice", "Alice should be first since the rows " +
                    "are ordered by team member name");
                assert.equal(rows[0].myIndex.value, 2);
                assert.equal(rows[1][TEAM_MEMBER_NAME_COLUMN].value, "Bob");
                assert.equal(rows[1].myIndex.value, 1);
                assert.equal(rows[2][TEAM_MEMBER_NAME_COLUMN].value, "Cindy");
                assert.equal(rows[2].myIndex.value, 1);
                assert.equal(rows[3][TEAM_MEMBER_NAME_COLUMN].value, "Dan");
                assert.equal(rows[3].myIndex.value, 3);
                assert.equal(rows[4][TEAM_MEMBER_NAME_COLUMN].value, null);
                assert.equal(rows[4].myIndex.value, null);
                done();
            }).catch(err => done(err));

    });
});
