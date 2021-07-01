/*
 * Copyright (c) 2021 MarkLogic Corporation
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

const bldrgen  = require('./plan-builder-generated.js');

    /**
     * A helper for building the definition of a query. The helper is
     * created by the {@link marklogic.ctsQueryBuilder} function.
     * @namespace ctsQueryBuilder
     */
    /**
     * Builds expressions to call functions in the cts server library
     * for a row pipeline.
     * @namespace ctsQueryBuilder.cts
     * @since 2.7.0
     */
    /**
     * Builds expressions to call functions in the fn server library
     * for a row pipeline.
     * @namespace ctsQueryBuilder.fn
     * @since 2.7.0
     */
    /**
     * Builds expressions to call functions in the geo server library
     * for a row pipeline.
     * @namespace ctsQueryBuilder.geo
     * @since 2.7.0
     */
    /**
     * Builds expressions to call functions in the json server library
     * for a row pipeline.
     * @namespace ctsQueryBuilder.json
     * @since 2.7.0
     */
    /**
     * Builds expressions to call functions in the map server library
     * for a row pipeline.
     * @namespace ctsQueryBuilder.map
     * @since 2.7.0
     */
    /**
     * Builds expressions to call functions in the math server library
     * for a row pipeline.
     * @namespace ctsQueryBuilder.math
     * @since 2.7.0
     */
    /**
     * Builds expressions to call functions in the rdf server library
     * for a row pipeline.
     * @namespace ctsQueryBuilder.rdf
     * @since 2.7.0
     */
    /**
     * Builds expressions to call functions in the sem server library
     * for a row pipeline.
     * @namespace ctsQueryBuilder.sem
     * @since 2.7.0
     */
    /**
     * Builds expressions to call functions in the spell server library
     * for a row pipeline.
     * @namespace ctsQueryBuilder.spell
     * @since 2.7.0
     */
    /**
     * Builds expressions to call functions in the sql server library
     * for a row pipeline.
     * @namespace ctsQueryBuilder.sql
     * @since 2.7.0
     */
    /**
     * Builds expressions to call functions in the xdmp server library
     * for a row pipeline.
     * @namespace ctsQueryBuilder.xdmp
     * @since 2.7.0
     */
    /**
     * Builds expressions to call functions in the xs server library
     * for a row pipeline.
     * @namespace ctsQueryBuilder.xs
     * @since 2.7.0
     */

class CtsQueryBuilder {
    constructor() {
        this.cts = new bldrgen.CtsExpr();
        this.fn = new bldrgen.FnExpr();
        this.geo =  new bldrgen.GeoExpr();
        this.json =  new bldrgen.JsonExpr();
        this.map =  new bldrgen.MapExpr();
        this.math =  new bldrgen.MathExpr();
        this.rdf =  new bldrgen.RdfExpr();
        this.sem =  new bldrgen.SemExpr();
        this.spell =  new bldrgen.SpellExpr();
        this.sql =  new bldrgen.SqlExpr();
        this.xdmp =  new bldrgen.XdmpExpr();
        this.xs =  new bldrgen.XsExpr();
    }
}

const ctsBuilder = new CtsQueryBuilder();

module.exports = {
    builder: ctsBuilder
};

