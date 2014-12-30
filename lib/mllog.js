/*
 * Copyright 2014-2015 MarkLogic Corporation
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
var util = require('util');

var valcheck = require('core-util-is');

function DelegatingLogger(logger) {
  if (!(this instanceof DelegatingLogger)) {
    return new DelegatingLogger(logger);
  }
  if (valcheck.isNullOrUndefined(logger)) {
    throw new Error('no logger provided');
  }
  if (!valcheck.isFunction(logger.debug)) {
    throw new Error('logger does not have debug() method');
  }
  if (!valcheck.isFunction(logger.info)) {
    throw new Error('logger does not have info() method');
  }
  if (!valcheck.isFunction(logger.warn)) {
    throw new Error('logger does not have warn() method');
  }
  if (!valcheck.isFunction(logger.error)) {
    throw new Error('logger does not have error() method');
  }
  this.logger       = logger;
  this.isErrorFirst = false;
}
DelegatingLogger.prototype.debug = function logDebug() {
  this.logger.debug.apply(this.logger, arguments);
};
DelegatingLogger.prototype.info = function logInfo() {
  this.logger.info.apply(this.logger, arguments);
};
DelegatingLogger.prototype.warn = function logWarn() {
  this.logger.warn.apply(this.logger, arguments);
};
DelegatingLogger.prototype.error = function logError() {
  this.logger.error.apply(this.logger, arguments);
};

function ConsoleLogger(level) {
  if (!(this instanceof ConsoleLogger)) {
    return new ConsoleLogger(level);
  }

  this.setLevel(valcheck.isNullOrUndefined(level) ? 'silent' : level);
  this.isErrorFirst = false;
}
ConsoleLogger.prototype.setLevel = function consoleSetLevel(level) {
  if (valcheck.isNullOrUndefined(level)) {
    return;
  }
  switch(level) {
  case 'debug':  this.level =  20; break;
  case 'info':   this.level =  30; break;
  case 'warn':   this.level =  40; break;
  case 'error':  this.level =  50; break;
  case 'silent': this.level = 100; break;
  default:
    throw new Error('unsupported logging level: '+level);
  }
};
ConsoleLogger.prototype.debug = function consoleDebug() {
  if (this.level > 20) {
    return;
  }
  console.log('Debug: '+util.format.apply(this, arguments));
};
ConsoleLogger.prototype.info = function consoleInfo() {
  if (this.level > 30) {
    return;
  }
  console.log('Info: '+util.format.apply(this, arguments));
};
ConsoleLogger.prototype.warn = function consoleWarn() {
  if (this.level > 40) {
    return;
  }
  console.log('Warn: '+util.format.apply(this, arguments));
};
ConsoleLogger.prototype.error = function consoleError() {
  if (this.level > 50) {
    return;
  }
  console.log('Error: '+util.format.apply(this, arguments));
};

module.exports = {
    DelegatingLogger: DelegatingLogger,
    ConsoleLogger:    ConsoleLogger
};
