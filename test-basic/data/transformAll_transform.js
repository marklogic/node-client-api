/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
function transform_function(context, params, content) {
  let document = content.toObject();
  document.key = params.newValue;
  return document;
}
module.exports = {
  transform: transform_function
};
