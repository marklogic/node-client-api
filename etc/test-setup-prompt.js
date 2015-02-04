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
var read   = require("read");
var mlutil = require('../lib/mlutil.js');

function adminUserPrompt() {
  var self = this;
  if (self.user === null) {
    read({
      prompt: 'admin user (default=admin): '
      },
      mlutil.callbackOn(self, adminUserCallback)
      );
  } else {
    self.passwordPrompt();
  }
}
function adminUserCallback(error, result) {
  if (error) {
    console.log(error);
    process.exit(1);
  }
  this.user = (result === '') ? 'admin' : result;
  this.passwordPrompt();
}
function adminPasswordPrompt() {
  var self = this;
  if (self.password === null) {
    read({
      prompt:    (self.user === 'admin') ?
          'admin password (default=admin): ' : 'admin password: ',
      silent:    true,
      replace:   '*',
      edit:      false
      },
      mlutil.callbackOn(self, adminPasswordCallback)
      );
  } else {
    self.finish();
  }
}
function adminPasswordCallback(error, result) {
  if (error) {
    console.log(error);
    process.exit(1);
  }
  if (result === '') {
    if (this.user === 'admin') {
      this.password = 'admin';
    } else {
      console.log('no admin password specified, so cannot setup');
      process.exit(1);      
    }
  } else {
    this.password = result;    
  }
  this.finish();
}
function adminFinish() {
  this.done(this.user, this.password);
}

function AdminPrompter(done) {
  this.done     = done;
  this.user     = null;
  this.password = null;
}
AdminPrompter.prototype.userPrompt       = adminUserPrompt;
AdminPrompter.prototype.userCallback     = adminUserCallback;
AdminPrompter.prototype.passwordPrompt   = adminPasswordPrompt;
AdminPrompter.prototype.passwordCallback = adminPasswordCallback;
AdminPrompter.prototype.finish           = adminFinish;

function promptForAdmin(done) {
  var prompter = new AdminPrompter(done);

  var argvLen = process.argv.length;
  if (argvLen >= 4) {
    var argvMax = argvLen - 1;
    for (var argvI=2; argvI < argvMax; argvI++) {
      var argvVal = process.argv[argvI];
      if (argvVal === '-u') {
        argvVal = process.argv[argvI + 1];
        var argvSep = argvVal.indexOf(':');
        if (argvSep < 0) {
          prompter.user = argvVal;
          break;
        }
        if (argvSep > 0) {
          prompter.user = argvVal.substring(0, argvSep);
        }
        if (argvSep < (argvVal.length - 1)) {
          prompter.password = argvVal.substring(argvSep + 1);
        }
        break;
      } else if (argvVal === '-h') {
        console.log('usage: '+process.argv[1]+' [-u adminUser:adminPassword]');
        console.log('without -u, prompts for admin user and/or admin password');
        process.exit();
      }
    };
  }

  prompter.userPrompt();
}

module.exports = promptForAdmin;
