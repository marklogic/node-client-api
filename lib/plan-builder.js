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

const types    = require('./server-types-generated.js');
const bldrbase = require('./plan-builder-base.js');
const bldrgen  = require('./plan-builder-generated.js');

/** @ignore */
function isNonEmptyString(arg) {
  if (typeof arg === "string" || arg instanceof String) {
    return (arg.length > 0);
  }
  return false;
}
/** @ignore */
function iriMaker(builder, prefix, name) {
  if (!isNonEmptyString(name)) {
    throw new Error('cannot define '+prefix+' iri without name: '+name);
  }

  const lastChar  = prefix.substr(-1, 1);
  const firstChar = name.substr(0, 1);
  if (firstChar === lastChar) {
    if (name.length === 1) {
      throw new Error('cannot define '+prefix+' iri with name of '+name);
    }
    // TODO: name separator should override prefix separator in SJS, XQY, and Java
    name = name.substr(1);
  } else if (name.length === 0) {
    throw new Error('cannot define '+prefix+' iri with empty name');
  }

  return builder.sem.iri(prefix + name);
}

bldrgen.AccessPlan.prototype.col = function(...args) {
  const self = this;
  const paramdef = ['column', [types.XsString], true, false];
  const checkedArgs = bldrbase.makeSingleArgs('PlanAccessPlan.col', 1, paramdef, args);
  const colName = checkedArgs[0];
  const accessorArgs = self._args;
  switch (self._fn) {
  case 'from-lexicons':
  case 'from-literals':
  case 'from-triples':
    const qualifierName = (accessorArgs.length > 1) ? accessorArgs[1] : null;
    if (qualifierName !== void 0 && qualifierName !== null) {
      return new bldrgen.PlanColumn('op', 'view-col', [qualifierName, colName]);
    }
    break;
  case 'from-view':
    const viewQualifier = (accessorArgs.length > 2) ? accessorArgs[2] : null;
    if (viewQualifier !== void 0 && viewQualifier !== null) {
      return new bldrgen.PlanColumn('op', 'view-col', [viewQualifier, colName]);
    } else {
      const schemaName = accessorArgs[0];
      const viewName   = accessorArgs[1];
      return new bldrgen.PlanColumn('op', 'schema-col',
        [((schemaName === void 0) ? null : schemaName), viewName, colName]
        );
    }
    break;
  }
  return new bldrgen.PlanColumn('op', 'col', checkedArgs);
};

class Builder extends bldrgen.PlanBuilder {
  constructor() {
    super({});
  }
  prefixer(base) {
    const self = this;

    if (!isNonEmptyString(base)) {
      throw new Error('cannot define prefixer without prefix: '+base);
    }
    const lastChar = base.substr(-1, 1);
    if (lastChar !== '/' && lastChar !== '#' && lastChar !== '?') {
      base += '/';
    }

    const prefix = base;
    return function(name) {
      return iriMaker(self, prefix, name);
    };
  }
  resolveFunction(functionName, modulePath) {
    return super.resolveFunction(
      (functionName instanceof types.XsQName) ? functionName : this.xs.QName(functionName),
      modulePath
      );
  }
}

const builder = new Builder();

module.exports = {
  builder: builder,
  Plan:    bldrgen.Plan
};
