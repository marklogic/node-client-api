/*
 * Copyright 2014-2015 MarkLogic Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
  new Date('2010-10-08T10:17:15.125Z');
  break;
case  10:
  xdmp.arrayValues([1, 'two', {i:3}, [4,'four'], xdmp.unquote('<i>5</i>')]);
  break;
default:
  extra;
  break;
}