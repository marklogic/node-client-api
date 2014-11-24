# How to contribute

We welcome contributions from the community. If you have a patch that you'd
like us to consider, please do the following: 

* Provide a signed 
[Contributor License Agreement](http://developer.marklogic.com/products/cla).

* Create an issue for the fix or enhancement. 

  For a bug, clearly describe the steps to reproduce the problem and the
  earliest version that exhibits the problem. For an enhancement, make sure
  you have basic agreement about the fix or enhancement.

* [Fork the API repository](https://github.com/marklogic/node-client-api/fork) in your repository on GitHub.

* Create a branch based on the `master` branch or (if you are in the Early
Access program) on the `develop` branch.

* Implement the fix or enhancement.

  As with other projects, you should include unit tests using the same test
  harness (at present, [Mocha](http://visionmedia.github.io/mocha/) and [should](https://github.com/visionmedia/should.js/)). Follow the same style conventions
  as existing code. Run jshint on the changes. Create jsdoc for any new
  interfaces.  (See the gulp tasks for a convenient way to run jshint.)
  Run all of the tests to make sure the change doesn't have side effects.

* Commit in one or more logical units with clear messages.

* Push to the branch in your fork.

* Create a pull request from your fork and add a comment to the issue.

  The team will then review the changes and possibly suggest improvements
  or alternatives.
