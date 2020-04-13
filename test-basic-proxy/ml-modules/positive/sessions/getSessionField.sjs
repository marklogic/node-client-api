/*
 * Copyright 2019-2020 MarkLogic Corporation
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
var fieldName;
var fieldValue;

const timestamp = fn.head(xdmp.getSessionField(xs.string(fieldName)));

// console.log(Object.prototype.toString.call(fieldValue));
// console.log(Object.prototype.toString.call(timestamp));
// console.log('get '+fieldName+': '+timestamp+'='+fieldValue);

const result = (String(timestamp) == String(fieldValue));
result;
