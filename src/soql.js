/*
 * SOQL
 * ============================================================================
 * author: Jack Galilee
 * ============================================================================
 * Provides the core functionality for construction of SOQL queries. Currently
 * it does not provide the ability to specify polymorphic SOQL queries.
 *
 * Options specified a set of aditional functions that can be utilised by the
 * object. Example, the addition of an all key value pair specifying a function
 * as its value now allows the owner object to send the final query to the
 * server.
 */
var SOQL = function(options) {
  this.query = '';
  for(var key in options) {
    this[key] = options[key];
  }
  return this;
}

/*
 * Adds the provided keyword to the query and seperates it with a space.
 */
SOQL.prototype._bindSyntax = function(keyword) {
  this.query += keyword + ' ';
  return this;
};

/*
 * Takes a list of items, and an optional seperator. If no seperator is provided
 * then a comma is used. Binds the constructed string as a syntax keyword.
 */
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

/*
 * Binds the SELECT keyword followed by a comma seperated list of items.
 */
SOQL.prototype.select = function(fields) {
  return this._bindSyntax('SELECT').
    _bindValues(fields);
}

/*
 * Binds the completed query of a SOQL object between a parif of brackets.
 */
SOQL.prototype.subSelect = function(func) {
  return this._bindSyntax('(').
    _bindSyntax(func(new SOQL()).finish()).
    _bindSyntax(')');
}

/*
 * Binds the FROM keyword and a provided table name to the query.
 */
SOQL.prototype.from = function(name) {
  return this._bindSyntax('FROM').
    _bindSyntax(name);
}

/*
 * Binds the WHERE keyword and a provided variable name to the query.
 */
SOQL.prototype.where = function(value) {
  return this._bindSyntax('WHERE').
    _bindSyntax(value);
}

/*
 * Binds an equals symbol and a provided value to the query.
 */
SOQL.prototype.equal = function(value) {
  return this._bindSyntax('==').
    _bindSyntax(value);
}

/*
 * Binds an AND keyword and a provided value to the query.
 */
SOQL.prototype.and = function(value) {
  return this._bindSyntax('AND').
    _bindSyntax(value);
}

/*
 * Binds an OR keyword and a provided value to the query.
 */
SOQL.prototype.or = function(value) {
  return this._bindSyntax('OR').
    _bindSyntax(value);
}

/*
 * Binds an not equal to symbol and a provided value to the query.
 */
SOQL.prototype.notEqual = function(value) {
  return this._bindSyntax('!=').
    _bindSyntax(value);
}

/*
 * Binds a NOT keyword to the query.
 */
SOQL.prototype.not = function() {
  return this._bindSyntax('NOT');
}

/*
 * Binds an IS NULL keyword to the query.
 */
SOQL.prototype.isNull = function(value) {
  return this._bindSyntax('IS NULL');
}

/*
 * Binds an IS NOT NULL keyword to the query.
 */
SOQL.prototype.isNotNull = function(value) {
  return this._bindSyntax('IS NOT NULL');
}

/*
 * Binds an IN keyword, and a comma seperated list of values between brackets 
 * to the query.
 */
SOQL.prototype.in = function(values) {
  return this._bindSyntax('IN(').
    _bindValues(values).
    _bindSyntax(')');
}

/*
 * Binds a LIMIT keyword and a specified numeric value to the query.
 */
SOQL.prototype.limit = function(n) {
  return this._bindSyntax('LIMIT').
    _bindSyntax(n.toString());
}

/*
 * Binds a ORDER BY keyword followed by a list of comma seperated values to the
 * query.
 */
SOQL.prototype.orderBy = function(values) {
  return this._bindSyntax('ORDER BY').
    _bindValues(values);
}

/*
 * Binds a ORDER BY ASC keyword followed by a list of comma seperated values to
 * the query.
 */
SOQL.prototype.orderByAsc = function(values) {
  return this._bindSyntax('ORDER BY ASC').
    _bindValues(values);
}

/*
 * Binds a ORDER BY DESC keyword followed by a list of comma seperated values to
 * the query.
 */
SOQL.prototype.orderByDesc = function(values) {
  return this._bindSyntax('ORDER BY DESC').
    _bindValues(values);
}

/*
 * Returns the complete string and strips any white space of the end of the
 * query string. Clears the existing query string.
 */
SOQL.prototype.finish = function(ready) {
  var finalQuery = this.query;
  this.query = '';
  while(finalQuery.charAt(finalQuery.length-1) === ' ') {
    finalQuery = finalQuery.substr(0, finalQuery.length-1);
  }
  return finalQuery;
}
