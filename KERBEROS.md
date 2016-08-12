# Kerberos Authentication

In addition to basic and digest authentication, the Node.js Client API supports Kerberos authentication for MarkLogic servers that have been so configured.

The Node.js Client API uses the [kerberos](https://www.npmjs.com/package/kerberos) module to support authentication and requires (on Linux):

- MIT Kerberos (for communicating with the Key Distribution Center)
- gcc and g++
- Python 2.7
- [node-gyp](https://github.com/nodejs/node-gyp)

Windows requires additional libraries. See the [kerberos documentation](https://www.npmjs.com/package/kerberos) for details.
