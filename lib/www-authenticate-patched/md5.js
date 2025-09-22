var crypto= require('crypto');

function md5(s) {
  return crypto.createHash('md5').update(s).digest('hex');
}

module.exports= md5;