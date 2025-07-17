/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

function paramTransform(context, params, document) {
  var newDoc = document.toObject();
  var newTitle = params.title;
  var intValue = params.myInt;
  var boolValue = params.myBool == 'true';
  newDoc.title = newTitle;
  newDoc.intKey = parseInt(intValue);
  newDoc.boolKey = boolValue;
  return newDoc;
}

module.exports = {
  transform: paramTransform
};
