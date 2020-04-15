/*
 * Copyright (c) 2020 MarkLogic Corporation
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
'use strict';
var start;
var length;
if (fn.empty(start)) {
  start = 1;
}
if (fn.empty(length)) {
  length = 100;
}
const batch = new Array(length).fill(start).map((v,i) => {
  return {
    start:  start,
    length: length,
    value:  v + i
  };
});
const result = Sequence.from(batch);
result;
