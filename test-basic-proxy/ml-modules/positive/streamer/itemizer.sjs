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
