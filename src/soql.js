var SOQL = function(options) {
  this.query = '';
  for(var key in options) {
    this[key] = options[key];
  }
  return this;
}

SOQL.prototype._bindSyntax = function(keyword) {
  this.query += keyword + ' ';
  return this;
};

SOQL.prototype._bindValues = function(items, seperator) {
  var parsedValues = '';
  if(undefined === seperator) {
    seperator = ', ';
  }
  if(undefined !== items) {
    items = items.reverse();
    for (var i = items.length - 1; i >= 0; i--) {
      if(items.length != 0 && (i < items.length - 1)) {
        parsedValues += seperator + items[i];
      } else {
        parsedValues += items[i];
      }
    }
  }
  return this._bindSyntax(parsedValues);
}

SOQL.prototype.select = function(fields) {
  return this._bindSyntax('SELECT').
    _bindValues(fields);
}

SOQL.prototype.subSelect = function(func) {
  return this._bindSyntax('(').
    _bindSyntax(func(new SOQL()).finish()).
    _bindSyntax(')');
}

SOQL.prototype.from = function(name) {
  return this._bindSyntax('FROM').
    _bindSyntax(name);
}

SOQL.prototype.where = function(value) {
  return this._bindSyntax('WHERE').
    _bindSyntax(value);
}

SOQL.prototype.equal = function(value) {
  return this._bindSyntax('==').
    _bindSyntax(value);
}

SOQL.prototype.and = function(value) {
  return this._bindSyntax('AND').
    _bindSyntax(value);
}

SOQL.prototype.or = function(value) {
  return this._bindSyntax('OR').
    _bindSyntax(value);
}

SOQL.prototype.notEqual = function(value) {
  return this._bindSyntax('!=').
    _bindSyntax(value);
}

SOQL.prototype.not = function() {
  return this._bindSyntax('NOT');
}

SOQL.prototype.isNull = function(value) {
  return this._bindSyntax('IS NULL');
}

SOQL.prototype.isNotNull = function(value) {
  return this._bindSyntax('IS NOT NULL');
}

SOQL.prototype.in = function(values) {
  return this._bindSyntax('IN(').
    _bindValues(values).
    _bindSyntax(')');
}

SOQL.prototype.limit = function(n) {
  return this._bindSyntax('LIMIT').
    _bindSyntax(n.toString());
}

SOQL.prototype.orderBy = function(values) {
  return this._bindSyntax('ORDER BY').
    _bindValues(values);
}

SOQL.prototype.orderByAsc = function(values) {
  return this._bindSyntax('ORDER BY ASC').
    _bindValues(values);
}

SOQL.prototype.orderByDesc = function(values) {
  return this._bindSyntax('ORDER BY DESC').
    _bindValues(values);
}

SOQL.prototype.finish = function(ready) {
  var finalQuery = this.query;
  this.query = '';
  while(finalQuery.charAt(finalQuery.length-1) === ' ') {
    finalQuery = finalQuery.substr(0, finalQuery.length-1);
  }
  return finalQuery;
}
