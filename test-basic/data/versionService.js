function getVersionService(context, params) {
  return {
    architecture: xdmp.architecture(),
    edition:      xdmp.productEdition(),
    platform:     xdmp.platform(),
    version:      xdmp.version()
  };
}

module.exports = {
    get: getVersionService
};
