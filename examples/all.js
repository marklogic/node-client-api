/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
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
