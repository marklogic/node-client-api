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

'use strict';

const crypto= require('crypto')
  , parsers= require('./parsers')
  , md5= require('./md5')
  , user_credentials= require('./user-credentials')
  , basic_challenge= {
      statusCode: 401,
      headers: {
        'www-authenticate': 'Basic realm="sample"'
      }
    }
  ;

function hex8(num)
{
  return ('00000000' + num.toString(16)).slice(-8);
}

const www_authenticator = function(username,password,options)
{
  if (2 == arguments.length && toString.call(password) != '[object String]') {
    options= password;
    password= null;
  }
  const credentials= user_credentials(username,password);
  let cnonce;
  if (options) {
    if (toString.call(options.cnonce) == '[object String]')
      {cnonce= options.cnonce;}
  }
  if (cnonce === void 0) {cnonce= crypto.randomBytes(8).toString('hex');}
  const parse_header= function(www_authenticate)
  {
    function Authenticator()
    {
      const note_error = (err) =>
      {
        this.err= err;
      };
      let nc= 0;

      // Returns an error message, or nothing when the challenge was applied.
      const configure= (selected) => {
        const note_error= err => err;
        const parsed= new parsers.WWW_Authenticate(selected);
        if (parsed.err) {return parsed.err;}
        const scheme = parsed.scheme.toLowerCase();
        const auth_parms= this.parms= parsed.parms;
        this.cnonce= cnonce;

        switch(scheme) {
          case 'basic':
            var auth_string= 'Basic '+credentials.basic();
            this.authorize= function() {
              return auth_string;
            };
            return;
          case 'digest': {
            var realm= auth_parms.realm;
            if (!realm) {
              return note_error('Realm not found in www-authenticate header.');
            }

            var ha1=
              credentials.digest(realm);
            var nonce= auth_parms.nonce;
            if (!nonce) {
              return note_error('Nonce not found in www-authenticate header.');
            }

            var fixed= 'Digest username="'+credentials.username+'",'+
                ' realm="'+realm+'",'+
                ' nonce="'+nonce+'",';
            var qop= auth_parms.qop;
            // RFC 2069 Digest without qop has no client nonce, so an attacker who strips qop could force a weaker exchange.
            if (!qop) {
              return note_error('Server did not offer a quality of protection (qop) for Digest authentication.');
            }
            const algorithm= auth_parms.algorithm;
            if (algorithm) {
              const normalized= algorithm.toLowerCase();
              if (normalized !== 'md5' && normalized !== 'md5-sess') {
                return note_error('Unsupported Digest algorithm: ' + algorithm);
              }
              fixed+= ' algorithm="'+algorithm+'",';
            }
            const qopa= qop.split(',').map(value => value.trim());
            if (qopa.indexOf('auth') < 0) {
              return note_error('Server does not accept any supported quality of protection techniques.');
            }
            var opaque= auth_parms.opaque;
            var a1= (algorithm && algorithm.toLowerCase() === 'md5-sess') ?
              md5(ha1+':'+nonce+':'+cnonce)
              :
              ha1;
            this.authorize= function(method,digestURI) {
              const ha2= md5(method+':'+digestURI);
              nc= nc+1;
              const hexed_nc= hex8(nc);
              let s= fixed+
                ' uri="'+digestURI+'",'+
                ' qop=auth,'+
                ' nc='+hexed_nc+','+
                ' cnonce="'+cnonce+'",'+
                ' response="'+md5(a1+':'+nonce+':'+hexed_nc+':'+cnonce+':auth:'+ha2)+'"';
              if (opaque) {
                s+= ', opaque="'+opaque+'"';
              }
              return s;
            };
            return;
          }
          default:
            return note_error('Unknown scheme');
        }
      };

      const challenges= parsers.split_challenges(www_authenticate);
      if (challenges.length === 0) {
        return note_error('Invalid www-authenticate header.');
      }
      let candidates= challenges;
      const expected= (options && options.expectedScheme) ?
        String(options.expectedScheme).toLowerCase() : null;
      if (expected) {
        const offered= challenges.map(challenge =>
          parsers.challenge_scheme(challenge).toLowerCase());
        candidates= challenges.filter((challenge, index) => offered[index] === expected);
        if (candidates.length === 0) {
          const schemes= offered.filter(scheme => scheme.length > 0);
          if (schemes.length === 0) {
            return note_error(new parsers.WWW_Authenticate(challenges[0]).err ||
              'Invalid www-authenticate header.');
          }
          return note_error('Server requested ' + schemes.join(', ').toUpperCase() +
            ' authentication, but the client is configured for ' + expected.toUpperCase());
        }
      }

      // A server may offer several challenges for the same scheme (for example, Digest
      // with different algorithms), so use the first one that is supported.
      let firstError;
      for (const candidate of candidates) {
        const err= configure(candidate);
        if (!err) {return;}
        if (firstError === undefined) {firstError= err;}
        delete this.parms;
        delete this.authorize;
      }
      return note_error(firstError);
    }

    return new Authenticator();
  };

  parse_header.authenticator= new HigherLevel(credentials,options); // deprecated
  return parse_header;
};


function HigherLevel(credentials,options)
{
  this.credentials= credentials;
  this.options= options;
  if (options && options.sendImmediately) {
    this.sendImmediately= true;
  }
}
HigherLevel.prototype.get_challenge= function(request) {
  if (401 == request.statusCode && 'www-authenticate' in request.headers) {
    if (!this.parse_header) {
      this.parse_header= www_authenticator(this.credentials,this.options);
    }
    this.challenge= this.parse_header(request.headers['www-authenticate']);
    return this.challenge.err;
  }
};
HigherLevel.prototype._challenge= function() {
  if (!this.challenge) {
    if (this.sendImmediately) {
      // simulate receipt of a basic challenge
      this.get_challenge(basic_challenge);
      return this.challenge;
    }
    else {return;}   // simply won't produce an 'Authorization' header
  }
  return this.challenge;
};
HigherLevel.prototype.authentication_string= function(method,digestURI) {
  const challenge= this._challenge();
  if (!challenge) {return;}   // simply won't produce an 'Authorization' header
  if (challenge.err) {return challenge.err;}
  return challenge.authorize(method,digestURI);
};
HigherLevel.prototype.authenticate_headers= function(headers,method,digestURI) {
  const challenge= this._challenge();
  if (!challenge) {return;}   // simply won't produce an 'Authorization' header
  if (challenge.err) {return challenge.err;}
  headers.authorization= challenge.authorize(method,digestURI);
};
HigherLevel.prototype.authenticate_request_options= function(request_options) {
  const challenge= this._challenge();
  if (!challenge) {return;}   // simply won't produce an 'Authorization' header
  if (challenge.err) {return challenge.err;}
  if (!request_options.headers) {request_options.headers= {};}
  request_options.headers.authorization= challenge.authorize(request_options.method,request_options.path);
};

module.exports = www_authenticator;
module.exports.parsers= parsers;
module.exports.user_credentials= user_credentials;
module.exports.basic_challenge= basic_challenge;
module.exports.authenticator= function(username,password,options)
{
  if (2 == arguments.length && toString.call(password) != '[object String]') {
    options= password;
    password= null;
  }
  const credentials= user_credentials(username,password);
  return new HigherLevel(credentials,options);
};