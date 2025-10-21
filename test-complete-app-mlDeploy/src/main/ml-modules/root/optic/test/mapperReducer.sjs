/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
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
