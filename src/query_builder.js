var QueryBuilder = function(fields) {
  this.query = '';
  return this;
}

QueryBuilder.prototype._bindSyntax = function(keyword) {
  this.query += keyword + ' ';
  return this;
};

QueryBuilder.prototype._bindValues = function(items, seperator) {
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

QueryBuilder.prototype.find = function(fields) {
  return this._bindSyntax('SELECT').
    _bindValues(fields);
}

QueryBuilder.prototype.from = function(name) {
  return this._bindSyntax('FROM').
    _bindSyntax(name);
}

QueryBuilder.prototype.where = function(value) {
  return this._bindSyntax('WHERE').
    _bindSyntax(value);
}

QueryBuilder.prototype.equal = function(value) {
  return this._bindSyntax('==').
    _bindSyntax(value);
}

QueryBuilder.prototype.and = function(value) {
  return this._bindSyntax('AND').
    _bindSyntax(value);
}

QueryBuilder.prototype.or = function(value) {
  return this._bindSyntax('OR').
    _bindSyntax(value);
}

QueryBuilder.prototype.notEqual = function(value) {
  return this._bindSyntax('!=').
    _bindSyntax(value);
}

QueryBuilder.prototype.not = function() {
  return this._bindSyntax('NOT');
}

QueryBuilder.prototype.isNull = function(value) {
  return this._bindSyntax('IS NULL');
}

QueryBuilder.prototype.isNotNull = function(value) {
  return this._bindSyntax('IS NOT NULL');
}

QueryBuilder.prototype.in = function(values) {
  return this._bindSyntax('IN(').
    _bindValues(values).
    _bindSyntax(')');
}

QueryBuilder.prototype.limit = function(n) {
  return this._bindSyntax('LIMIT').
    _bindSyntax(n.toString());
}

QueryBuilder.prototype.orderBy = function(values) {
  return this._bindSyntax('ORDER BY').
    _bindValues(values);
}

QueryBuilder.prototype.orderByAsc = function(values) {
  return this._bindSyntax('ORDER BY ASC').
    _bindValues(values);
}

QueryBuilder.prototype.orderByDesc = function(values) {
  return this._bindSyntax('ORDER BY DESC').
    _bindValues(values);
}

QueryBuilder.prototype.finish = function(ready) {
  var finalQuery = this.query;
  this.query = '';
  while(finalQuery.charAt(finalQuery.length-1) === ' ') {
    finalQuery = finalQuery.substr(0, finalQuery.length-1);
  }
  return finalQuery;
}
