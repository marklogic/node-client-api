/*
 * Copyright 2017-2019 MarkLogic Corporation
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

function arrayMapper(row) {
  const result = row.concat();
  result.push((typeof result[0] === 'string') ? 'seconds' :
    fn.floor(fn.secondsFromDateTime(fn.currentDateTime()))
  );
  return result;
}
function arrayReducer(previous, row) {
  const val = (previous === void 0) ? 0 : previous + row[0];
  return val;
}
function secondsMapper(row) {
  row.seconds = new Date().getSeconds();
  return row;
}
function fibReducer(previous, row) {
  const i = Array.isArray(previous) ? previous.length : 0;

  row.i = i;

  switch(i) {
    case 0:
      row.fib = 0;
      break;
    case 1:
      row.fib = 1;
      break;
    default:
      row.fib = previous[i - 2].fib + previous[i - 1].fib;
      break;
  }

  if (i === 0) {
    previous = [row];
  } else {
    previous.push(row);
  }

  return previous;
}

module.exports = {
  arrayMapper:   arrayMapper,
  arrayReducer:  arrayReducer,
  secondsMapper: secondsMapper,
  fibReducer:    fibReducer
};
