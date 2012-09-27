/*
 *  sObjectRecord
 * ============================================================================
 * author: Jack Galilee
 * date: 27th September 2012
 * version: DEVELOPMENT
 */


/*
 * Defines the tyoe of sObject class that the record is of, if any changes have
 * been saved on the server, and the attributes that it has by default.
 */
var sObjectRecord = function(sobjclass, attributes) {
  this._class = sobjclass;
  this._is = {
    saved = false
  }
  this._attributes = attributes;
}

/*
 * Provides a method for utilising the values of the record without the extra
 * functionality specified in the record class.
 */
sObjectRecord.prototype.toJSON = function() {
  return JSON.parse(this._attributes);
}

/*
 * Overrides the current toString method to provide a better realistic
 * representation of the object as a string.
 */
sObjectRecord.prototype.toString = function() {
  return JSON.stringify(this.toJSON());
}

/*
 * Returns the current is value for the key provided.
 * Note that 'is values' are never attempted to be persisted on the server.
 */
sObjectRecord.prototype.is = function(key) {
  return this._is[key];
}

/*
 * Returns the current attribute value for the key provided.
 */
sObjectRecord.prototype.get = function(keyOrKeys) {
  if(arguments.length == 1) {
    return this._attributes[keyOrKeys];
  } else(arguments.length > 1) {
    var result = {};
    for (var i = arguments.length - 1; i >= 0; i--) {
      var key = arguments[i];
      if(this._attributes[key] !== undefined) {
        result[key] = this._attributes[key];
      }
    }
    return result;
  }
}

/*
 * Sets the key, value pair in the attributes object if given one key, value
 * pair. e.g. record.set('key', 'value');
 *
 * Sets each of the key, value pairs in the attributes object if given a key,
 * value set. e.g. record.set({ 'key1': 'value1', 'key2': 'value2' })
 */
sObjectRecord.prototype.set = function(keyOrObject, optionalValue) {
  if(optionalValue !== undefined) {
    this._attributes[keyOrObject] = optionalValue;
  } else {
    for(key in keyOrObject) {
      this._attributes[key] = keyOrObject[key];
    }
  }
  return this;
}

/*
 * Updates the record if it has an id.
 * Creates a new record if it does not have an id.
 */
sObjectRecord.prototype.save = function() {
  for(var key in this._attributes) {
    this._attributes[key] = this._attributes[key];
  }
}

/*
 * Discards all of the currently recorded attribute values by requesting the
 * values from the Salesforce.com instance and using them instead.
 */
sObjectRecord.prototype.reload = function(after) {
  this._ajax({
    url: this._specificUrl,
    method: 'GET',
    success: function() {
      after();
    }
  });
  return this;
}