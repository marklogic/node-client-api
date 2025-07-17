/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
function getVersionService(context, params) {
  return {
    architecture: xdmp.architecture(),
    edition:      xdmp.productEdition(),
    platform:     xdmp.platform(),
    version:      xdmp.version()
  };
}

module.exports = {
    GET: getVersionService
};
