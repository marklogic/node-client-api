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

const ParseAuth= /^\s*([\w!#$%&'*+.^`|~-]+)(?:\s+([\s\S]*))?$/  // -> scheme, params
  , Separators= /([",=])/
  , ChallengeStart= /^\s*[\w!#$%&'*+.^`|~-]+(?=\s|,|$)(?!\s*=)/
  ;

// Node joins repeated WWW-Authenticate headers with ", ", so one value may hold
// several challenges. A new challenge starts at a top-level comma followed by
// a scheme token rather than an auth-param name followed by "=".
function split_challenges(header) {
  const challenges= [];
  if (typeof header !== 'string') {return challenges;}
  let start= 0, quoted= false, _i;
  for (_i = 0; _i < header.length; _i++) {
    const ch= header[_i];
    if (quoted) {
      if (ch === '\\') {_i++;}
      else if (ch === '"') {quoted= false;}
    }
    else if (ch === '"') {quoted= true;}
    else if (ch === ',' && ChallengeStart.test(header.slice(_i+1))) {
      challenges.push(header.slice(start, _i).trim());
      start= _i+1;
    }
  }
  challenges.push(header.slice(start).trim());
  return challenges.filter(challenge => challenge.length > 0);
}

function challenge_scheme(challenge) {
  const match= (typeof challenge === 'string') ? challenge.match(ParseAuth) : null;
  return match ? match[1] : '';
}

function parse_params(header) {
  // This parser will definitely fail if there is more than one challenge
  let tok, _i, _len, key, value;
  let state= 0;   //0: token,
  const m= header.split(Separators);
  for (_i = 0, _len = m.length; _i < _len; _i++) {
    tok = m[_i];
    if (!tok.length) {continue;}
    switch (state) {
      case 0: // token
        key= tok.trim();
        state= 1; // expect equals
        continue;
      case 1: // expect equals
        if ('=' != tok) {return 'Equal sign was expected after '+key;}
        state= 2;
        continue;
      case 2: // expect value
        if ('"' == tok) {
          value= '';
          state= 3; // expect quoted
          continue;
        }
        else {
          this.parms[key]= value= tok.trim();
          state= 9; // expect comma or end
          continue;
        }
      case 3: // handling quoted string
        if ('"' == tok) {
          state= 8; // end quoted
          continue;
        }
        else {
          value+= tok;
          state= 3; // continue accumulating quoted string
          continue;
        }
      case 8: // end quote encountered
        if ('"' == tok) {
          // double quoted
          value+= '"';
          state= 3; // back to quoted string
          continue;
        }
        if (',' == tok) {
          this.parms[key]= value;
          state= 0;
          continue;
        }
        else {
          return 'Unexpected token ('+tok+') after '+value+'"';
        }
      case 9: // expect commma
        if (',' != tok) {return 'Comma expected after '+value;}
        state= 0;
        continue;
    }
  }
  switch (state) {  // terminal state
    case 0:   // Empty or ignoring terminal comma
    case 9:   // Expecting comma or end of header
      return;
    case 8:   // Last token was end quote
      this.parms[key]= value;
      return;
    default:
      return 'Unexpected end of www-authenticate value.';
  }
}

function Parse_WWW_Authenticate(to_parse)
{
  this.scheme= '';
  this.parms= {};
  const m= (typeof to_parse === 'string') ? to_parse.match(ParseAuth) : null;
  if (!m) {
    this.err= 'Invalid www-authenticate header.';
    return;
  }
  this.scheme= m[1];
  const err= this.parse_params(m[2] || '');
  if (err) {
    this.scheme= '';
    this.parms= {};
    this.err= err;
  }
}

function Parse_Authentication_Info(to_parse)
{
  this.scheme= 'Digest';
  this.parms= {};
  const err= this.parse_params(to_parse);
  if (err) {
    this.scheme= '';
    this.parms= {};
    this.err= err;
  }
}

Parse_Authentication_Info.prototype.parse_params= parse_params;
Parse_WWW_Authenticate.prototype.parse_params= parse_params;

module.exports = {
  WWW_Authenticate: Parse_WWW_Authenticate,
  Authentication_Info: Parse_Authentication_Info,
  split_challenges: split_challenges,
  challenge_scheme: challenge_scheme
};
