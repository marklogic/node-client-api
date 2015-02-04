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
var fs = require('fs');

var exutil = require('./example-util.js');

function QueuedScript(script) {
  if (!(this instanceof QueuedScript)) {
    return new QueuedScript(script);
  }

  this.script = script;
}
QueuedScript.prototype.run = function scriptRunner() {
  var script = this.script;
  console.log('-----------------------------------------------------------');
  console.log(script);
  // must capture the required script to consume read streams
  var x = require('./'+script);
};

fs.readdir('./examples', function(err, filenames) {
  if (err) {
    throw err;
  }

  var exclude = {
      'all.js':          true,
      'before-load.js':  true,
      'example-util.js': true,
      'setup.js':        true
  };

  filenames.forEach(function(filename) {
    if (filename.match(/\.js$/) && exclude[filename] !== true) {
      exutil.addScript(new QueuedScript(filename));
    }
  });
});