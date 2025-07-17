/*
* Copyright © 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/
var test;
var extra;

switch(test) {
case  1:
  xdmp.toJSON({k:'v'});
  break;
case  2:
  xdmp.unquote('<a>element</a>');
  break;
case  3:
  xdmp.xqueryEval('binary{xdmp:integer-to-hex(255)}');
  break;
case  4:
  xdmp.xqueryEval('text{"text value"}');
  break;
case  5:
  'string value';
  break;
case  6:
  true;
  break;
case  7:
  3;
  break;
case  8:
  4.4;
  break;
case  9:
  new Date('2010-10-08T10:17:15.125Z').toISOString();
  break;
case  10:
  xdmp.arrayValues([1, 'two', {i:3}, [4,'four'], xdmp.unquote('<i>5</i>')]);
  break;
default:
  break;
}
