/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

function timestampTransform(context, params, document) {
  var newDoc = document.toObject();

  newDoc.timestamp = fn.currentDateTime();
  newDoc.userName  = xdmp.getCurrentUser();

  return newDoc;
}

module.exports = {
  transform: timestampTransform
};
