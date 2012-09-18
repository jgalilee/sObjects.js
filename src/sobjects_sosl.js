/*
 *  Definition of the SOSL query
 */

SOSL = function() {
  var _this = this;
  var _query = '';
  var _reserved = ["?" ,"&" ,"|" ,"!" ,"{" ,"}" ,"[" ,"]" ,"(" ,")" ,"^" ,"~" ,"*" ,":" ,"\\" ,"\"" ,"'" ,"+" ,"-"]
}

SOSL.prototype.find = function(fields) {
  var _object = _this;
  var _this = _object.find;

  _this.exact = function() {

  }

  _this.and = function() {

  }

  _this.or = function() {

  }

  _this.andNot = function() {

  }

  _this.group = function() {

  }

}

SOSL.prototype.in = function(sobject) {

}

SOSL.prototype.returning = function() {

}

SOSL.prototype.where = function() {

}

SOSL.prototype.orderBy = function(fields) {

}

SOSL.prototype.with = function() {

}

SOSL.prototype.withDataCategory = function() {

}

SOSL.prototype.limit = function(number) {

}

SOSL.prototype.toLabel = function() {

}

sObjects.sosl = new SOSL();