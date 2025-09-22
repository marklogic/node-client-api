/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
'use strict';

const should = require('should');

describe('FIPS test - ensure MD5 hash digester object is not loaded by default on require of www-authenticate module', function () {
  it('should not automatically load MD5 digest algorithm function when requiring www-authenticate module', function () {
    /** 
     * Attempt to load/require the www-authenticate module after applying a monkey-patch
     * to the crypto.createHash function to intercept any attempts to create an MD5 hash
     * digester object.
     * This is to simulate a FIPS-enabled environment where MD5 is not allowed.
     * 
     * First, create a monkey-patch to intercept calls to crypto.createHash
     * and throw an Error object if the code attempts to create an 
     * MD5 hashing algorithm object.
     * 
     * We undo this monkey-patch after the test to avoid side effects on all the other tests.
     * 
     * To simulate the require/load, we first delete the module from Node's require cache
     * and then require it again, which forces a reload of the module.
     */
    delete require.cache[require.resolve('../lib/www-authenticate-patched/www-authenticate')];
    delete require.cache[require.resolve('../lib/www-authenticate-patched/md5')];
    const crypto = require('crypto');
    const originalCreateHash = crypto.createHash;

    crypto.createHash = function (algorithm, ...args) {
      if (algorithm.toLowerCase() === 'md5') {
        throw new Error('FIPS emulation: MD5 digest algorithm is not allowed on this system!');
      }
      return originalCreateHash.call(this, algorithm, ...args);
    };

    try { // we must ensure the createHash function is restored after the test

      // Verify MD5 detection works
      (() => crypto.createHash('md5')).should.throw('FIPS emulation: MD5 digest algorithm is not allowed on this system!');

      // Require the module - should not call to get MD5 digester so should not throw
      (() => require('../lib/www-authenticate-patched/md5')).should.not.throw();
      (() => require('../lib/www-authenticate-patched/www-authenticate')).should.not.throw();

    } finally {
      // Restore the original createHash function to avoid side effects
      // This MUST execute to avoid breaking other tests!
      crypto.createHash = originalCreateHash;
    }
  });
});


