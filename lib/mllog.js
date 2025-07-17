/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

'use strict';
var util = require('util');



function DelegatingLogger(logger) {
  if (!(this instanceof DelegatingLogger)) {
    return new DelegatingLogger(logger);
  }
  if (logger == null) {
    throw new Error('no logger provided');
  }
  if (typeof logger.debug !== 'function') {
    throw new Error('logger does not have debug() method');
  }
  if (typeof logger.info !== 'function') {
    throw new Error('logger does not have info() method');
  }
  if (typeof logger.warn !== 'function') {
    throw new Error('logger does not have warn() method');
  }
  if (typeof logger.error !== 'function') {
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

  this.setLevel((level == null) ? 'silent' : level);
  this.isErrorFirst = false;
}
ConsoleLogger.prototype.setLevel = function consoleSetLevel(level) {
  if (level == null) {
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
