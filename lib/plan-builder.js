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
    if(this.rdt === void 0) {
      this.rdt = new RdtExpr();
    }
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

class RdtExpr {
  constructor() {
  }
  /**
   * This function replaces values with masking text that is deterministic. A given input generates the same mask value every time it is applied.
   * Controls features such as the length and type of the generated value.
   * @method planBuilder#maskDeterministic
   * @since 2.7.0
   * @param args - with column and options - Column is the name of the column to be defined.
   *  This can be either a string or the return value from PlanBuilder.col(), PlanBuilder.viewCol() or PlanBuilder.schemaCol().
   *  Options is an object with name-value pairs specific to the redaction method.
   * @returns { planBuilder.PlanExprCol }
   */
  maskDeterministic(...args) {
    return redactimpl('maskDeterministic', 'mask-deterministic',1,args);
  }
  /** This function replaces values with random text. The masking value can vary across repeated application to the same input value.
   * Controls the length of the generated value and type of replacement text (numbers or letters).
   * @method planBuilder#maskRandom
   * @since 2.7.0
   * @param args - with column and options - Column is the name of the column to be defined.
   *  This can be either a string or the return value from PlanBuilder.col(), PlanBuilder.viewCol() or PlanBuilder.schemaCol().
   *  Options is an object with name-value pairs specific to the redaction method.
   * @returns { planBuilder.PlanExprCol }
   */
  maskRandom(...args) {
    return redactimpl('maskRandom', 'mask-random', 1, args);
  }
  /** This function redacts data that matches the pattern of a dateTime value. Controls the expected input format and the masking dateTime format.
   * @method planBuilder#redactDatetime
   * @since 2.7.0
   * @param args - with column and options - Column is the name of the column to be defined.
   *  This can be either a string or the return value from PlanBuilder.col(), PlanBuilder.viewCol() or PlanBuilder.schemaCol().
   *  Options is an object with name-value pairs specific to the redaction method.
   * @returns { planBuilder.PlanExprCol }
   */
  redactDatetime(...args) {
    return redactimpl('redactDatetime', 'redact-datetime',2, args);
  }
  /** This function redacts data that matches the pattern of an email address.
   * Controls whether to mask the entire address, only the username, or only the domain name.
   * @method planBuilder#redactEmail
   * @since 2.7.0
   * @param args - with column and options - Column is the name of the column to be defined.
   *  This can be either a string or the return value from PlanBuilder.col(), PlanBuilder.viewCol() or PlanBuilder.schemaCol().
   *  Options is an object with name-value pairs specific to the redaction method.
   * @returns { planBuilder.PlanExprCol }
   */
  redactEmail(...args) {
    return redactimpl('redactEmail', 'redact-email', 1, args);
  }
  /** This function redacts data that matches the pattern of an IPv4 address. Controls what character to use as a masking character.
   * @method planBuilder#redactIpv4
   * @since 2.7.0
   * @param args - with column and options - Column is the name of the column to be defined.
   *  This can be either a string or the return value from PlanBuilder.col(), PlanBuilder.viewCol() or PlanBuilder.schemaCol().
   *  Options is an object with name-value pairs specific to the redaction method.
   * @returns { planBuilder.PlanExprCol }
   */
  redactIpv4(...args) {
    return redactimpl('redactIpv4', 'redact-ipv4', 1, args);
  }
  /** This function replaces values with random numbers. Controls the data type, range, and format of the masking values.
   * @method planBuilder#redactNumber
   * @since 2.7.0
   * @param args - with column and options - Column is the name of the column to be defined.
   *  This can be either a string or the return value from PlanBuilder.col(), PlanBuilder.viewCol() or PlanBuilder.schemaCol().
   *  Options is an object with name-value pairs specific to the redaction method.
   * @returns { planBuilder.PlanExprCol }
   */
  redactNumber(...args) {
    return redactimpl('redactNumber', 'redact-number', 1, args);
  }
  /** This function redacts data that matches a given regular expression. You must specify the regular expression and the masking text.
   * @method planBuilder#redactRegex
   * @since 2.7.0
   * @param args - with column and options - Column is the name of the column to be defined.
   *  This can be either a string or the return value from PlanBuilder.col(), PlanBuilder.viewCol() or PlanBuilder.schemaCol().
   *  Options is an object with name-value pairs specific to the redaction method.
   * @returns { planBuilder.PlanExprCol }
   */
  redactRegex(...args) {
    return redactimpl('redactRegex', 'redact-regex', 2, args);
  }
  /** This function redacts data that matches the pattern of a US Social Security Number (SSN).
   * Controls whether or not to preserve the last 4 digits and what character to use as a masking character.
   * @method planBuilder#redactUsSsn
   * @since 2.7.0
   * @param args - with column and options - Column is the name of the column to be defined.
   *  This can be either a string or the return value from PlanBuilder.col(), PlanBuilder.viewCol() or PlanBuilder.schemaCol().
   *  Options is an object with name-value pairs specific to the redaction method.
   * @returns { planBuilder.PlanExprCol }
   */
  redactUsSsn(...args) {
    return redactimpl('redactUsSsn', 'redact-us-ssn', 1, args);
  }
  /** This function redacts data that matches the pattern of a US telephone number.
   * Controls whether or not to preserve the last 4 digits and what character to use as a masking character.
   * @method planBuilder#redactUsPhone
   * @since 2.7.0
   * @param args - with column and options - Column is the name of the column to be defined.
   *  This can be either a string or the return value from PlanBuilder.col(), PlanBuilder.viewCol() or PlanBuilder.schemaCol().
   *  Options is an object with name-value pairs specific to the redaction method.
   * @returns { planBuilder.PlanExprCol }
   */
  redactUsPhone(...args) {
    return redactimpl('redactUsPhone', 'redact-us-phone', 1, args);
  }
}

function redactimpl(clientName, serverName, minArity, args) {
  const namer = bldrbase.getNamer(args, 'column');
  const paramdefs = [['column', [bldrgen.PlanColumn, types.XsString], true, false], ['option', [], false, false]];
  const checkedArgs = (namer !== null) ?
      bldrbase.makeNamedArgs(namer, `PlanBuilder.${clientName}`, minArity, new Set(['column', 'options']), paramdefs, args) :
      bldrbase.makePositionalArgs(`PlanBuilder.${clientName}`, minArity, false, paramdefs, args);
  return new bldrgen.PlanExprCol('ordt', serverName, checkedArgs);
}

const builder = new Builder();

module.exports = {
  builder: builder,
  Plan:    bldrgen.Plan
};
