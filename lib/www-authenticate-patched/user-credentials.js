/*
* Copyright (c) 2015-2026 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

/*
 * www-authenticate
 * https://github.com/randymized/www-authenticate
 *
 * Copyright (c) 2013 Randy McLaughlin
 * Licensed under the MIT license.
 */


const md5= require('./md5');

/*
 * Hide the password. Uses the password to form authorization strings,
 * but provides no interface for exporting it.
 */
function user_credentials(username,password,options) {
  if (username.is_user_credentials &&
    typeof username.basic === 'function' &&
    typeof username.digest === 'function'
  ) {
    return username;
  }

  const basic_string= options && options.hide_basic ?
    ''
    :
      (!password && password !== '' ?
        Buffer.from(username, 'ascii').toString('base64')
      :
        Buffer.from(username+':'+password, 'ascii').toString('base64')
      );
  function Credentials()
  {
    this.username= username;
  }
  Credentials.prototype.basic= function()
  {
    return basic_string;
  };
  
  /**
   * Generate HTTP Digest Authentication HA1 hash per RFC 2617.
   * 
   * ⚠️  SECURITY: This uses MD5 as mandated by RFC 2617 for HTTP Digest Auth.
   * Passwords are NOT stored - they are hashed on-demand for challenge-response.
   * 
   * @param {string} realm - Authentication realm from server
   * @returns {string} MD5(username:realm:password) per RFC 2617 Section 3.2.2
   */
  Credentials.prototype.digest= function(realm)
  {
    return !password && password !== '' ?
        md5(username+':'+realm)
        :
        md5(username+':'+realm+':'+password);
  };
  Credentials.prototype.is_user_credentials= function()
  {
    return true;
  };

  return new Credentials;
}

module.exports= user_credentials;
