/*
 * sObjectRecord
 * ============================================================================
 * author: Jack Galilee
 * ============================================================================
 * Defines the type of sObject class that the record is of, if any changes have
 * been saved on the server, and the attributes that it has by default.
 */
var sObjectRecord = function(sobjclass, attributes) {
  this._class = sobjclass;
  this._is = {
    saved: false
  }
  this._attributes = attributes;
  if(undefined === this._attributes) {
    this._attributes = {};
  }
}

/*
 * Returns the is value for the key provided.
 * Note: that 'is values' are never attempted to be persisted on the server.
 */
sObjectRecord.prototype.is = function(key, value) {
  var _this = this;
  if(undefined !== value) {
    return _this._is[key] = value;
  }
  return _this._is[key];
}

/*
 * Returns the current attribute value for the key provided.
 */
sObjectRecord.prototype.get = function(keyOrKeys) {
  var _this = this;
  if(arguments.length == 1) {
    return _this._attributes[keyOrKeys];
  } else if(arguments.length > 1) {
    var result = {};
    for (var i = arguments.length - 1; i >= 0; i--) {
      var key = arguments[i];
      if(_this._attributes[key] !== undefined) {
        result[key] = _this._attributes[key];
      }
    }
    return result;
  } else {
    return JSON.parse(JSON.stringify(this._attributes));
  }
}

/*
 * Check if the object has an Id. If it does then attempt to get the specific
 * URL for the object. Otherwise throw an error explaining why one could not
 * be returned. If an object has an id the Force.com api also provides a url
 * for the object in a returned JSON key value pair named 'attributes'.
 */
sObjectRecord.prototype.url = function() {
  if(undefined !== _this.get('Id')) {
    return _this.get('attributes').url);
  } else {
    throw "sObject has no specific url, since it has no Id.";
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
  var _this = this;
  if(optionalValue !== undefined) {
    this._attributes[keyOrObject] = optionalValue;
    _this.is('saved', false);
  } else {
    for(key in keyOrObject) {
      this._attributes[key] = keyOrObject[key];
      _this.is('saved', false);
    }
  }
  return this;
}

/*
 * Updates the record if it has an id.
 * Creates a new record if it does not have an id.
 */
sObjectRecord.prototype.save = function(after) {
  var _this = this;
  if(undefined !== _this.get('Id')) {
    _this._class.update(_this, function(data) {
      _this.set(data.payload);
      _this.is('saved', true)
      after(_this, data);
    });
  } else {
    _this._class.create(_this, function(data) {
      /*
       * Salesforce only returns the Id for the object on a POST.
       * Defer the after function and reload the object. Since we've
       * sent the object for the create it will contain the attributes
       * values that were sent to start with.
       */
      if(data.status == 200) {
        _this.set('Id', data.payload.id).reload(after);
      }
      after(_this, data);
    });
  }
  return _this;
}

/*
 * Discards all of the currently recorded attribute values by requesting the
 * values from the Salesforce.com instance and using them instead.
 */
sObjectRecord.prototype.reload = function(after) {
  var _this = this;
  if(undefined !== _this.get('Id')) {
    _this._class.read(_this, function(data) {
      _this._attributes = {};
      _this.set(data.payload);
      _this.is('saved', true)
      after(_this, data, status);
    });
  } else {
    throw new Error("Unable to reload non-persisted sObject record.");
  }
  return _this;
}
