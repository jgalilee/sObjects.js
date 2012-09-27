/*
 *  Definition of the SOSL query
 */

var SOSL = function() {
  var _this = this;
  _this._reserved = ["?" ,"&" ,"|" ,"!" ,"{" ,"}" ,"[" ,"]" ,"(" ,")" ,"^" ,"~" ,"*" ,":" ,"\\" ,"\"" ,"'" ,"+" ,"-"]
  _this._reset();
}

SOSL.prototype._resolveOutstandingSyntax = function() {
  var _object = this;
  return _object;
}

SOSL.prototype._reset = function() {
  var _object = this;
  _object._query = '';
  _object._groupCount = 0;
  _object._finishedReturning = true;
  _object._parsingSObject = false;
}

SOSL.prototype._parseFields = function(fields, seperator) {
  var result = '';
  fields = fields.reverse();
  if(undefined === seperator) {
    seperator = '';
  }
  if(undefined !== fields && fields.length >= 0) {
    for (var i = fields.length - 1; i >= 0; i--) {
      if(fields.length != 0 && (i < fields.length - 1)) {
        result = result + seperator + fields[i];
      } else {
        result = result + fields[i];
      }
    }
  }
  return result;
}

SOSL.prototype._bindSyntax = function(before, fields, after) {
  var _object = this;
  if(undefined !== before) {
    _object._query += before;
  }
  if(undefined !== fields) {
    _object._query += ' ' + _object._parseFields(fields) + '';
  }
  if(undefined !== after) {
    _object._query += after;
  }
  return _object;
}

// FIND KEYWORD

SOSL.prototype._finishFind = function() {
  var _object = this;
  if(_object._finishedFind === false) {
    _object._bindSyntax('}')
    _object._finishedFind = true;
  }
  return _object;
}

SOSL.prototype.find = function(fields) {
  var _object = this;
  _object._finishedFind = false;
  _object._query = 'FIND {';
  _object._query = _object._query + _object._parseFields(fields);
  return _object;
}

SOSL.prototype.exact = function() {
  var _object = this;
  return _object._bindSyntax("EXACT", fields);
}

SOSL.prototype.and = function(fields) {
  var _object = this;
  return _object._bindSyntax(" AND", fields);
}

SOSL.prototype.or = function(fields) {
  var _object = this;
  return _object._bindSyntax(" OR", fields);
}

SOSL.prototype.andNot = function(fields) {
  var _object = this;
  return _object._bindSyntax(" AND NOT", fields);
}

// IN KEYWORD

SOSL.prototype.in = function(custom) {
  var _object = this;
  _object._finishFind();
  if(undefined !== custom) {
    return _object._bindSyntax((" IN " + custom));
  } else {
    return _object;
  }
}

SOSL.prototype.inAllFields = function() {
  var _object = this;
  _object._finishFind();
  return _object._bindSyntax(" IN ALL FIELDS");
}

SOSL.prototype.inEmailFields = function() {
  var _object = this;
  _object._finishFind();
  return _object._bindSyntax(" IN EMAIL FIELDS");
}

SOSL.prototype.inNameFields = function() {
  var _object = this;
  _object._finishFind();
  return _object._bindSyntax(" IN NAME FIELDS");
}

SOSL.prototype.inPhoneFields = function() {
  var _object = this;
  _object._finishFind();
  return _object._bindSyntax(" IN PHONE FIELDS");
}

SOSL.prototype.inSidebarFields = function() {
  var _object = this;
  _object._finishFind();
  return _object._bindSyntax(" IN SIDEBAR FIELDS");
}

// RETURNING KEYWORD

SOSL.prototype._finishReturning = function() {
  var _object = this;
  if(_object._finishedReturning === false) {
    _object._finishedReturning = true;
  }
  _object._finishSObject();
  return _object;
}

SOSL.prototype._finishSObject = function() {
  var _object = this;
  if(true === _object._parsingSObject) {
    _object._parsingSObject = false;
    return _object._bindSyntax(")");
  } else {
    return _object;
  }
}

SOSL.prototype._parseSObject = function(sobj, fields, limit) {
  var _object = this;
  var result = sobj.getName();
  if(undefined !== fields) {
    result += "(" + _object._parseFields(fields, ', ');
    _object._parsingSObject = true;
    if(undefined !== limit) {
      result += " LIMIT " + limit.toString();
    }
  }
  return result;
}

SOSL.prototype.returning = function(sobj, fields, limit) {
  var _object = this;
  _object._finishFind();
  var seperator = ', ';
  if(_object._finishedReturning === true) {
    _object._bindSyntax(" RETURNING ");
    _object._finishedReturning = false
    seperator = '';
    _object._bindSyntax(seperator + _object._parseSObject(sobj, fields, limit));
    return _object._finishSObject();
  }
  return _object._bindSyntax(seperator + _object._parseSObject(sobj, fields, limit));
}

SOSL.prototype.where = function(field) {
  var _object = this;
  return _object._bindSyntax(" WHERE ", [field]);
}

SOSL.prototype.equals = function(value) {
  var _object = this;
  return _object._bindSyntax(" = ", [value]);
}

SOSL.prototype.includes = function(values) {
  var _object = this;
  return _object._bindSyntax(" includes('", [values], "')");
}

SOSL.prototype.not = function() {
  var _object = this;
  return _object._bindSyntax(" NOT ");
}

SOSL.prototype.notEquals = function(value) {
  var _object = this;
  return _object._bindSyntax(" != ", [value]);
}

SOSL.prototype.orderBy = function(fields) {
  var _object = this;
  return _object._bindSyntax(" ORDER BY ", fields);
}

SOSL.prototype.orderByAsc = function(fields) {
  var _object = this;
  return _object._bindSyntax(" ORDER BY ASC ", fields);
}

SOSL.prototype.orderByDesc = function(fields) {
  var _object = this;
  return _object._bindSyntax(" ORDER BY DESC ", fields);
}

SOSL.prototype.all = function(fields) {
  var _object = this;
  return _object;
}

SOSL.prototype.last = function(n) {
  var _object = this;
  return _object;
}

SOSL.prototype.with = function() {
  var _object = this;
  return _object;
}

SOSL.prototype.nullsFirst = function() {
  var _object = this;
  return _object._bindSyntax(" NULLS first");
}

SOSL.prototype.nullsLast = function() {
  var _object = this;
  return _object._bindSyntax(" NULLS last");
}

SOSL.prototype.withDivision = function(divisionName) {
  var _object = this;
  _object._resolveOutstandingSyntax();
  _object._bindSyntax(" WITH DIVISION = '" + divisionName + "'");
  return _object;
}

SOSL.prototype.withDataCategory = function() {
  var _object = this;

  return _object;
}

SOSL.prototype.limit = function(number) {
  var _object = this;
  _object._finishFind();
  _object._finishReturning();
  return _object._bindSyntax(" LIMIT " + number.toString());
}

SOSL.prototype.toLabel = function() {
  var _object = this;

  return _object;
}

SOSL.prototype._finishGroup = function() {
  var _object = this;
  if(_object.groupCount > 0) {

  } else {

  }
  return _object;
}

SOSL.prototype.group = function() {
  var _object = this;
  _object._groupCount += 1;
  return _object._bindSyntax("(", fields);
}

SOSL.prototype.raw = function() {
  var _object = this;
  _object._finishFind();
  _object._finishSObject();

  var finalQuery = _object._query;
  _object._reset();
  return finalQuery;
}

window.SOSL = SOSL;

sObjects.sosl = new SOSL();
