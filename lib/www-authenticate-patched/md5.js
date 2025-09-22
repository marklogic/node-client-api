/*
 * www-authenticate
 * https://github.com/randymized/www-authenticate
 *
 * Copyright (c) 2013 Randy McLaughlin
 * Licensed under the MIT license.
 */

/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
var crypto= require('crypto');

function md5(s) {
  return crypto.createHash('md5').update(s).digest('hex');
}

module.exports= md5;