/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

'use strict';

function library(libname) {
  if (libname == null) {
    return null;
  }
  try {
    return require(libname);
  } catch(e) {
    return null;
  }
}
function libraryProperty(libname, propertyName) {
  var lib = library(libname);
  if (lib == null) {
    return null;
  }
  return lib[propertyName];
}

module.exports = {
    library:         library,
    libraryProperty: libraryProperty
};
