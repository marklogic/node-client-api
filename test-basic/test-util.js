/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

var stream = require('stream');
var util   = require('util');

function ValueStream(value) {
  stream.Readable.call(this);
  this.value    = value;
}
util.inherits(ValueStream, stream.Readable);
ValueStream.prototype._read = function() {
  this.push(this.value);
  this.push(null);
};

module.exports = {
    ValueStream: ValueStream
};
