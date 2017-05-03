# Kerberos Authentication

In addition to basic, digest, and certificate authentication, the Node.js Client API supports [Kerberos authentication](https://docs.marklogic.com/guide/security/external-auth) on MarkLogic servers.

The Node.js Client API uses the [kerberos](https://www.npmjs.com/package/kerberos) module to support Kerberos authentication and requires (on Linux):

- [MIT Kerberos](http://web.mit.edu/kerberos/dist/) (for communicating with the Key Distribution Center)
- gcc and g++
- Python 2.7
- [node-gyp](https://github.com/nodejs/node-gyp)

Windows requires additional libraries. See the [kerberos documentation](https://www.npmjs.com/package/kerberos) for details.

The [kerberos](https://www.npmjs.com/package/kerberos) module is listed as an optional dependency in the Node.js Client API package.json. To skip installing optional modules during [npm install](https://docs.npmjs.com/cli/install), use the --no-optional flag:

    npm install --no-optional
