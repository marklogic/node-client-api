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

/* IMPORTANT: Do not edit. This file is generated. */
class ServerType {
  constructor(ns, fn, args) {
    this._ns   = ns;
    this._fn   = fn;
    this._args = args;
  }
}
class Item extends ServerType {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class SqlRowID extends ServerType {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class SemBlank extends ServerType {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class Node extends Item {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class MapMap extends Item {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class CtsReference extends Item {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class XsAnySimpleType extends Item {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class CtsPeriod extends Item {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class CtsQuery extends Item {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class CtsRegion extends Item {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class SemStore extends Item {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class JsonArray extends Item {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class MathLinearModel extends Item {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class ArrayNode extends Node {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class TextNode extends Node {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class XmlContentNode extends Node {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

  static [Symbol.hasInstance](obj) {
    return obj instanceof Object && (
      XmlContentNode.prototype.isPrototypeOf(obj) ||
      obj instanceof CommentNode || obj instanceof ElementNode || obj instanceof ProcessingInstructionNode || obj instanceof TextNode
      );
  }
}
class ObjectNode extends Node {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class BooleanNode extends Node {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class AttributeNode extends Node {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class JsonContentNode extends Node {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

  static [Symbol.hasInstance](obj) {
    return obj instanceof Object && (
      JsonContentNode.prototype.isPrototypeOf(obj) ||
      obj instanceof ArrayNode || obj instanceof BooleanNode || obj instanceof NullNode || obj instanceof NumberNode || obj instanceof ObjectNode || obj instanceof TextNode
      );
  }
}
class DocumentNode extends Node {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class JsonRootNode extends Node {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

  static [Symbol.hasInstance](obj) {
    return obj instanceof Object && (
      JsonRootNode.prototype.isPrototypeOf(obj) ||
      obj instanceof ArrayNode || obj instanceof ObjectNode
      );
  }
}
class ProcessingInstructionNode extends Node {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class CommentNode extends Node {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class NumberNode extends Node {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class NullNode extends Node {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class XmlRootNode extends Node {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

  static [Symbol.hasInstance](obj) {
    return obj instanceof Object && (
      XmlRootNode.prototype.isPrototypeOf(obj) ||
      obj instanceof CommentNode || obj instanceof ElementNode || obj instanceof ProcessingInstructionNode
      );
  }
}
class ElementNode extends Node {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class JsonObject extends MapMap {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class CtsGeospatialPathReference extends CtsReference {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class CtsElementAttributeReference extends CtsReference {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class CtsJsonPropertyReference extends CtsReference {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class CtsPathReference extends CtsReference {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class CtsUriReference extends CtsReference {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class CtsFieldReference extends CtsReference {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class CtsGeospatialRegionPathReference extends CtsReference {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class CtsCollectionReference extends CtsReference {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class CtsElementReference extends CtsReference {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class XsAnyAtomicType extends XsAnySimpleType {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class CtsPoint extends CtsRegion {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class CtsPolygon extends CtsRegion {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class CtsCircle extends CtsRegion {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class CtsComplexPolygon extends CtsRegion {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class CtsLinestring extends CtsRegion {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class CtsBox extends CtsRegion {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class XsTime extends XsAnyAtomicType {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class XsBoolean extends XsAnyAtomicType {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class XsNumeric extends XsAnyAtomicType {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

  static [Symbol.hasInstance](obj) {
    return obj instanceof Object && (
      XsNumeric.prototype.isPrototypeOf(obj) ||
      obj instanceof XsDecimal || obj instanceof XsDouble || obj instanceof XsFloat
      );
  }
}
class SemUnknown extends XsAnyAtomicType {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class XsDuration extends XsAnyAtomicType {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class XsDecimal extends XsAnyAtomicType {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class XsBase64Binary extends XsAnyAtomicType {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class XsFloat extends XsAnyAtomicType {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class XsString extends XsAnyAtomicType {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class XsGYearMonth extends XsAnyAtomicType {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class XsGMonthDay extends XsAnyAtomicType {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class XsUntypedAtomic extends XsAnyAtomicType {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class XsQName extends XsAnyAtomicType {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class XsHexBinary extends XsAnyAtomicType {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class XsGYear extends XsAnyAtomicType {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class XsGMonth extends XsAnyAtomicType {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class XsDateTime extends XsAnyAtomicType {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class SemInvalid extends XsAnyAtomicType {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class XsDouble extends XsAnyAtomicType {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class XsAnyURI extends XsAnyAtomicType {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class SemBnode extends XsAnyAtomicType {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class XsGDay extends XsAnyAtomicType {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class XsDate extends XsAnyAtomicType {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class XsYearMonthDuration extends XsDuration {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class XsDayTimeDuration extends XsDuration {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class XsInteger extends XsDecimal {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class XsNormalizedString extends XsString {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class RdfLangString extends XsString {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class SemIri extends XsAnyURI {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class XsNonPositiveInteger extends XsInteger {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class XsLong extends XsInteger {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class XsNonNegativeInteger extends XsInteger {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class XsToken extends XsNormalizedString {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class XsNegativeInteger extends XsNonPositiveInteger {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class XsInt extends XsLong {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class XsUnsignedLong extends XsNonNegativeInteger {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class XsPositiveInteger extends XsNonNegativeInteger {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class XsNMTOKEN extends XsToken {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class XsLanguage extends XsToken {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class XsName extends XsToken {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class XsShort extends XsInt {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class XsUnsignedInt extends XsUnsignedLong {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class XsNCName extends XsName {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class XsByte extends XsShort {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class XsUnsignedShort extends XsUnsignedInt {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}
class XsUnsignedByte extends XsUnsignedShort {

  constructor(ns, fn, args) {
    super(ns, fn, args);
  }

}

module.exports = {
    ServerType: ServerType,
ArrayNode: ArrayNode,
AttributeNode: AttributeNode,
BooleanNode: BooleanNode,
CommentNode: CommentNode,
CtsBox: CtsBox,
CtsCircle: CtsCircle,
CtsCollectionReference: CtsCollectionReference,
CtsComplexPolygon: CtsComplexPolygon,
CtsElementAttributeReference: CtsElementAttributeReference,
CtsElementReference: CtsElementReference,
CtsFieldReference: CtsFieldReference,
CtsGeospatialPathReference: CtsGeospatialPathReference,
CtsGeospatialRegionPathReference: CtsGeospatialRegionPathReference,
CtsJsonPropertyReference: CtsJsonPropertyReference,
CtsLinestring: CtsLinestring,
CtsPathReference: CtsPathReference,
CtsPeriod: CtsPeriod,
CtsPoint: CtsPoint,
CtsPolygon: CtsPolygon,
CtsQuery: CtsQuery,
CtsReference: CtsReference,
CtsRegion: CtsRegion,
CtsUriReference: CtsUriReference,
DocumentNode: DocumentNode,
ElementNode: ElementNode,
Item: Item,
JsonContentNode: JsonContentNode,
JsonRootNode: JsonRootNode,
JsonArray: JsonArray,
JsonObject: JsonObject,
MapMap: MapMap,
MathLinearModel: MathLinearModel,
Node: Node,
NullNode: NullNode,
NumberNode: NumberNode,
ObjectNode: ObjectNode,
ProcessingInstructionNode: ProcessingInstructionNode,
RdfLangString: RdfLangString,
SemBlank: SemBlank,
SemBnode: SemBnode,
SemInvalid: SemInvalid,
SemIri: SemIri,
SemStore: SemStore,
SemUnknown: SemUnknown,
SqlRowID: SqlRowID,
TextNode: TextNode,
XmlContentNode: XmlContentNode,
XmlRootNode: XmlRootNode,
XsAnyAtomicType: XsAnyAtomicType,
XsAnySimpleType: XsAnySimpleType,
XsAnyURI: XsAnyURI,
XsBase64Binary: XsBase64Binary,
XsBoolean: XsBoolean,
XsByte: XsByte,
XsDate: XsDate,
XsDateTime: XsDateTime,
XsDayTimeDuration: XsDayTimeDuration,
XsDecimal: XsDecimal,
XsDouble: XsDouble,
XsDuration: XsDuration,
XsFloat: XsFloat,
XsGDay: XsGDay,
XsGMonth: XsGMonth,
XsGMonthDay: XsGMonthDay,
XsGYear: XsGYear,
XsGYearMonth: XsGYearMonth,
XsHexBinary: XsHexBinary,
XsInt: XsInt,
XsInteger: XsInteger,
XsLanguage: XsLanguage,
XsLong: XsLong,
XsName: XsName,
XsNCName: XsNCName,
XsNegativeInteger: XsNegativeInteger,
XsNMTOKEN: XsNMTOKEN,
XsNonNegativeInteger: XsNonNegativeInteger,
XsNonPositiveInteger: XsNonPositiveInteger,
XsNormalizedString: XsNormalizedString,
XsNumeric: XsNumeric,
XsPositiveInteger: XsPositiveInteger,
XsQName: XsQName,
XsShort: XsShort,
XsString: XsString,
XsTime: XsTime,
XsToken: XsToken,
XsUnsignedByte: XsUnsignedByte,
XsUnsignedInt: XsUnsignedInt,
XsUnsignedLong: XsUnsignedLong,
XsUnsignedShort: XsUnsignedShort,
XsUntypedAtomic: XsUntypedAtomic,
XsYearMonthDuration: XsYearMonthDuration
};
