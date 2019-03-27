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

function colorIdMapper(row) {
  const result = row;
  switch(result.myColorId) {
    case 1:
      result.myColorId = 'RED';
      break;
    case 2:
      result.myColorId = 'BLUE';
      break;
    case 3:
      result.myColorId = 'YELLOW';
      break;
    case 4:
      result.myColorId = 'BLACK';
      break;
    default:
      result.myColorId = 'NO COLOR';
  }
  return result;
}

function arrayReducer(previous, row) {
  const val = (previous === void 0) ? 0 : previous + row[0];
  return val;
}

function fibReducer(previous, row) {
  const i = Array.isArray(previous) ? previous.length : 0;
  const result = row;
  result.i = i;
    switch(i) {
      case 0:
        result.fib = 0;
        break;
      case 1:
        result.fib = 1;
        break;
      default:
        result.fib = previous[i - 2].fib + previous[i - 1].fib;
        break;
    }
    if (previous === void 0) {
      previous = [result];
    } else {
      previous.push(result);
    }
  return previous;
}

function ageMapper(row) {
  const result = row;
  if(result.player_age < 21)
    result.player_age = 'rookie';
  else if(result.player_age > 21 && result.player_age < 30)
    result.player_age = 'premium';
  else
    result.player_age = 'veteran';
  return result;
}

module.exports = {
  arrayMapper:   arrayMapper,
  colorIdMapper: colorIdMapper,
  ageMapper:     ageMapper,
  arrayReducer:  arrayReducer,
  fibReducer:    fibReducer
};
