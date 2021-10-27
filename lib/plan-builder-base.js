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

const types = require('./server-types-generated.js');

function checkMinArity(funcName, argsLen, minArity) {
  if (argsLen < minArity) {
    throw new Error(
      `${funcName} takes a minimum of ${minArity} arguments but received: ${argsLen}`
      );
  }
}
function checkMaxArity(funcName, argsLen, maxArity) {
  if (argsLen > maxArity) {
    throw new Error(
      `${funcName} takes a maximum of ${maxArity} arguments but received: ${argsLen}`
      );
  }
}
function checkArity(funcName, argsLen, minArity, maxArity) {
  checkMinArity(funcName, argsLen, minArity);
  checkMaxArity(funcName, argsLen, maxArity);
}

function checkArg(arg, funcName, argPos, paramName, paramTypes, isRequired, isMultiple) {
  if (arg === void 0) {
    if (isRequired) {
      throw new Error(
        `${argLabel(funcName, paramName, argPos)} is a required ${typeLabel(paramTypes)} value`
        );
    }
    return null;
  } else if (Array.isArray(arg)) {
    if (!isMultiple) {
      throw new Error(
        `${argLabel(funcName, paramName, argPos)} must be one ${typeLabel(paramTypes)} value instead of an array`
        );
    } else if (arg.length === 0 && isRequired) {
      throw new Error(
        `${argLabel(funcName, paramName, argPos)} array must have at least one ${typeLabel(paramTypes)} value`
        );
    }
    return arg.map(val => castArg(val, funcName, paramName, argPos, paramTypes));
  }

  const val = castArg(arg, funcName, paramName, argPos, paramTypes);
  const result = isMultiple ? [val] : val;
  return result;
}
function castArg(arg, funcName, paramName, argPos, paramTypes) {
  if (arg === void 0 || arg === null || !Array.isArray(paramTypes) || paramTypes.length === 0) {
    return arg;
  } else if (arg instanceof Object) {
    if (paramTypes.some(paramType => (arg instanceof paramType))) {
      return arg;
    } else if (arg instanceof Number || arg instanceof Boolean || arg instanceof String) {
      arg = arg.valueOf();
    } else if (arg instanceof types.ServerType) {
      throw new Error(
        `${argLabel(funcName, paramName, argPos)} must have type ${typeLabel(paramTypes)}`
      );
    } else if (paramTypes.some(paramType => {
      const paramClass = paramType.name;
      switch(paramClass) {
      case 'PlanCtsReferenceMap': return Object.keys(arg).every(key => {
        const value = arg[key];
        if (value instanceof types.CtsReference) {
          return true;
        }
        throw new Error(
          `${argLabel(funcName, paramName, argPos)} has ${key} key without a CtsReference value for ${typeLabel(paramTypes)}`
        );
      });
      case 'PlanGroupConcatOption': return Object.keys(arg).every(key => {
        const value = arg[key];
        switch(key) {
        case 'separator':
          if (typeof value === 'string' || value instanceof String) {
            return true;
          }
          throw new Error(
            `${argLabel(funcName, paramName, argPos)} separator must be a string for ${typeLabel(paramTypes)} options`
          );
        case 'values':
          if (value === 'distinct') {
            return true;
          }
          throw new Error(
            `${argLabel(funcName, paramName, argPos)} values can only be "distinct" for ${typeLabel(paramTypes)} options`
          );
        default:
          return false;
        }});
      case 'PlanSampleByOption': return Object.keys(arg).every(key => {
        const value = arg[key];
        switch(key) {
        case 'limit':
          if (typeof value === 'number' || value instanceof Number || typeof value === 'string' || value instanceof String) {
            return true;
          }
          throw new Error(
            `${argLabel(funcName, paramName, argPos)} limit must be a number or string for ${typeLabel(paramTypes)} options`
          );
        default:
          return false;
        }});
      case 'PlanSearchOption':  return Object.keys(arg).every(key => {
        const value = arg[key];
        switch(key) {
          case 'scoreMethod':
            if (['logtfidf', 'logtf', 'simple', 'score-logtfidf', 'score-logtf', 'score-simple'].includes(value)) {
              return true;
            }
            throw new Error(
                `${argLabel(funcName, paramName, argPos)} can only be logtfidf, logtf, or simple`
            );
          case 'qualityWeight':
            if (typeof value === 'number' || value instanceof Number) {
              return true;
            }
            throw new Error(
                `${argLabel(funcName, paramName, argPos)} must be a number`
            );
          default:
            return false;
        }});
      case 'PlanSparqlOption': return Object.keys(arg).every(key => {
        const value = arg[key];
        switch(key) {
        case 'dedup':
          switch(value) {
          case 'on':
          case 'off':
            return true;
          default:
            throw new Error(
              `${argLabel(funcName, paramName, argPos)} values for dedup can only be "on" or "off" for ${typeLabel(paramTypes)} options`
            );
          }
          break;
        case 'base':
          if (typeof value === 'string' || value instanceof String) {
            return true;
          }
          throw new Error(
            `${argLabel(funcName, paramName, argPos)} base must be a URI string for ${typeLabel(paramTypes)} options`
          );
        default:
          return false;
        }});
      case 'PlanTripleOption':  return Object.keys(arg).every(key => {
        const value = arg[key];
        switch(key) {
        case 'dedup':
          switch(value) {
          case 'on':
          case 'off':
            return true;
          default:
            throw new Error(
              `${argLabel(funcName, paramName, argPos)} values for dedup can only be "on" or "off" for ${typeLabel(paramTypes)} options`
            );
          }
          break;
        default:
          return false;
        }});
      case 'PlanValueOption':  return Object.keys(arg).every(key => {
        const value = arg[key];
        switch(key) {
        case 'values':
          if (value === 'distinct') {
            return true;
          }
          throw new Error(
            `${argLabel(funcName, paramName, argPos)} values can only be "distinct" for ${typeLabel(paramTypes)} options`
          );
        default:
          return false;
        }});
      case 'PlanXsValueMap':
        const keys = Object.keys(arg);
        const columns = (keys.length === 2) ? arg.columnNames : null;
        const rows    = Array.isArray(columns) ? arg.rowValues : null;
        if (Array.isArray(rows)) {
          if (columns.every(column => (typeof column === 'string' || column instanceof String))) {
            if (rows.every(row => (Array.isArray(row) && row.length <= columns.length))) {
              return true;
            }
          }
          return false;
        }
        return keys.every(key => {
          const value   = arg[key];
          const valtype = typeof value;
          switch (valtype) {
          case 'boolean': return true;
          case 'number':  return true;
          case 'string':  return true;
          case 'object':
            if (value === null || value instanceof String || value instanceof Number || value instanceof Boolean) {
              return true;
            } else if (value instanceof types.XsAnyAtomicType) {
              const valArgs = value._args;
              if (Array.isArray(valArgs) && valArgs.every(valArg => !(valArg instanceof types.ServerType))) {
                return true;
              }
              throw new Error(
               `${argLabel(funcName, paramName, argPos)} has ${key} key with expression value`
              );
            }
            break;
          default:
            throw new Error(
              `${argLabel(funcName, paramName, argPos)} has ${key} key with ${valtype} instead of ${typeLabel(paramTypes)} literal value`
            );
          }});
      default:
        return false;
      }
      })) {
      return arg;
    } else {
      throw new Error(
        `${argLabel(funcName, paramName, argPos)} has invalid argument for ${typeLabel(paramTypes)} value: ${arg}`
      );
    }
  }

  const argType = typeof arg;
  switch(argType) {
  case 'boolean':
    if (isProtoChained(paramTypes, [types.XsBoolean, types.BooleanNode, types.JsonContentNode])) {
      return arg;
    }
    break;
  case 'number':
    if (isProtoChained(paramTypes,
        [types.XsDecimal, types.XsDouble, types.XsFloat, types.XsNumeric, types.NumberNode, types.JsonContentNode])) {
      return arg;
    }
    break;
  case 'string':
    if (isProtoChained(paramTypes, [types.XsAnyAtomicType, types.TextNode, types.JsonContentNode, types.XmlContentNode])) {
      return arg;
    }
    break;
  default:
    throw new Error(
      `${argLabel(funcName, paramName, argPos)} must be a ${typeLabel(paramTypes)} instead of ${argType} value`
    );
  }
  throw new Error(
    `${argLabel(funcName, paramName, argPos)} must be a ${typeLabel(paramTypes)} value`
  );
}

function isProtoChained(declaredTypes, valueTypes) {
  return valueTypes.some(valueType => {
    const valueProto = valueType.prototype;
    return declaredTypes.some(declaredType => {
      const declaredProto = declaredType.prototype;
      return (
        declaredProto === valueProto            ||
        declaredProto.isPrototypeOf(valueProto) ||
        valueProto.isPrototypeOf(declaredProto)
        );
    });
  });
}

function argLabel(funcName, paramName, argPos) {
  return `${paramName} argument at ${argPos} of ${funcName}()`;
}
function typeLabel(paramTypes) {
  // vulnerable if a type ever has a name property
  return paramTypes.map(paramType => paramType.name).join(' or ');
}

function getNamer(args, name) {
  const onlyArg = getOptionalArg(args);
  const namer = (onlyArg === null || onlyArg[name] === void 0) ? null : onlyArg;
  return namer;
}
function getOptionalArg(args) {
  const firstArg = (args.length === 1) ? args[0] : void 0;
  const onlyArg  = (firstArg !== null && !Array.isArray(firstArg) && typeof firstArg === 'object') ?
        firstArg : null;
  return onlyArg;
}

function makePositionalArgs(funcName, minArity, isUnbounded, paramDefs, args) {
  const paramLen = paramDefs.length;
  if (isUnbounded) {
    checkMinArity(funcName, args.length, minArity);
  } else {
    checkArity(funcName, args.length, minArity, paramLen);
  }
  return args.map((arg, i) => {
    const paramNum = (isUnbounded && i >= paramLen) ? (paramLen - 1) : i;
    const paramDef = paramDefs[paramNum];
    return checkArg(arg, funcName, i, paramDef[0], paramDef[1], paramDef[2], paramDef[3]);
    });
}
function makeNamedArgs(namer, funcName, minArity, paramNames, paramDefs, args) {
  Object.keys(namer).forEach(name => {
    if (!paramNames.has(name)) {
      throw new Error(`${name} is not a named parameter of ${funcName}`);
    }
  });
  args = [];
  let paramDef = null;
  let i = 0;
  let j = -1;
  for (const paramName of paramNames) {
    const val = namer[paramName];
    if (val !== void 0) {
      paramDef = paramDefs[++j];
      while (j < i) {
        args.push(checkArg(null, funcName, j, paramDef[0], paramDef[1], paramDef[2], paramDef[3]));
        paramDef = paramDefs[++j];
      }
      args.push(checkArg(val, funcName, i, paramName, paramDef[1], paramDef[2], paramDef[3]));
    }
    i++;
  }
  while (++j < minArity) {
    paramDef = paramDefs[j];
    args.push(checkArg(null, funcName, j, paramDef[0], paramDef[1], paramDef[2], paramDef[3]));
  }
  checkArity(funcName, args.length, minArity, paramNames.length);
  return args;
}
function makeSingleArgs(funcName, minArity, paramDef, args) {
  const argLen = args.length;
  checkArity(funcName, argLen, minArity, 1);
  if (argLen === 1) {
    const paramName = paramDef[0];
    const namer     = getNamer(args, paramName);
    if (namer === null || namer instanceof types.ServerType) {
      args[0] = checkArg(args[0], funcName, 0, paramName, paramDef[1], paramDef[2], paramDef[3]);
    } else if (Object.keys(namer).length > 1) {
      throw new Error(`named parameter object has keys other than ${paramName} for ${funcName}`);
    } else {
      args[0] = checkArg(namer[paramName], funcName, 0, paramName, paramDef[1], paramDef[2], paramDef[3]);
    }
  }
  return args;
}

function exportOperators(plan) {
  const operList = plan._operators;
  if (!Array.isArray(operList)) {
    throw new Error(`operator list is not an array: `+operList);
  }
  return {
    ns:   'op',
    fn:   'operators',
    args: operList.map(oper => exportOperator(oper))
    };
}
function exportOperator(oper) {
  const ns   = oper._ns;
  const fn   = oper._fn;
  const args = oper._args;
  if (ns !== 'op' || fn === void 0 || !Array.isArray(args)) {
    throw new Error(`cannot export invalid operator: ${oper}`);
  }

  let exportedArgs = null;
  switch(fn) {
  case 'from-literals':
    exportedArgs = args.map((arg, i) => {
      if (i === 0) {
        const lit = (!Array.isArray(arg)) ? arg : (arg.length ===1) ? arg[0] : void 0;
        if (lit === void 0) {
          return exportArgs(arg);
        } else {
          const columnNames = lit.columnNames;
          const rowValues   = lit.rowValues;
          if (columnNames === void 0 || rowValues === void 0) {
            return [exportArg(lit)];
          } else if (Array.isArray(columnNames) && Array.isArray(rowValues)) {
            return rowValues.map((rowIn) => {
              if (!Array.isArray(rowIn)) {
                throw new Error(`literal row is not array: ${rowIn}`);
              }
              const rowOut = {};
              rowIn.forEach((value, j) => {
                if (j > columnNames.length) {
                  throw new Error(`more values than column names: ${rowIn}`);
                }
                rowOut[columnNames[j]] = value;
                });
              return rowOut;
              });
          } else {
            throw new Error(`no literals: ${oper}`);
          }
        }
      } else {
        return exportArg(arg);
      }
      });
    break;
  case 'join-inner':
  case 'join-left-outer':
  case 'join-cross-product':
  case 'except':
  case 'intersect':
  case 'union':
    exportedArgs = args.map((arg, i) => {
      if (i === 0) {
        return exportOperators(arg);
      }
      return exportArg(arg);
      });
    break;
  default:
    exportedArgs = exportArgs(args);
    break;
  }

  return {ns:ns, fn:fn, args:exportedArgs};
}
function exportObject(obj) {
  const ns   = obj._ns;
  const fn   = obj._fn;
  const args = obj._args;
  if (ns !== void 0 && fn !== void 0 && Array.isArray(args)) {
    return {
      ns:   ns,
      fn:   fn,
      args: exportArgs(args)
    };
  }
  return Object.getOwnPropertyNames(obj).reduce(
      (objCopy, key) => {objCopy[key] = exportArg(obj[key]); return objCopy;},
      {}
      );
}
function exportArgs(argList) {
  if (argList === void 0 || argList === null || argList.length === 0 ||
    (argList.length === 1 && argList[0] === null)
  ) {
    return [];
  }
  return argList.map(arg => {
    return exportArg(arg);
  });
}
function exportArg(arg) {
  if (arg === null || typeof arg !== 'object' ||
      arg instanceof String || arg instanceof Number || arg instanceof Boolean
      ) {
    return arg;
  } else if (!Array.isArray(arg)) {
    return exportObject(arg);
  } else if (arg.length === 1) {
    return exportArg(arg[0]);
  }
  return exportArgs(arg);
}
function doExport(plan) {
  return {$optic:exportOperators(plan)};
}

module.exports = {
    checkArity:          checkArity,
    checkMaxArity:       checkMaxArity,
    exportArg:           exportArg,
    getNamer:            getNamer,
    makeNamedArgs:       makeNamedArgs,
    makePositionalArgs:  makePositionalArgs,
    makeSingleArgs:      makeSingleArgs,
    doExport:            doExport
};
