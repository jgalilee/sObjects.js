/*
 * sObjectClass
 * ============================================================================
 * author: Jack Galilee
 * ============================================================================
 * Defines the type sObject schema that will be used to manage the specific type
 * of sObject as defined on the Salesforce.com instance. Each instance contains
 * a schema provided by the instance of sObjects it belongs to.
 */

sObjectClass = function(sObjects, sObjectSchema) {
  var _this = this;
  _this._sObjects = sObjects;
  _this._sObjectSchema = sObjectSchema;
  _this._is = {
    loaded: false
  };
  return _this;
}

/*
 * Utility method to defer a callback until after the schema information
 * has been loaded for the specific class.
 */
sObjectClass.prototype._deferUnlessLoaded = function(defer) {
  var _this = this;
  if(_this.is('loaded') == false) {
    _this.load(defer);
  } else {
    defer();
  }
  return _this;
}

/*
 * Simply returns the generic url as provided by the Force.com api for the
 * sObject type. Example 'api.force.com/sobjects/Contact/'.
 */
sObjectClass.prototype.url = function() {
  var _this = this;
  return _this._sObjectSchema.urls.sobject;
}

/*
 * Simply returns the boolean value of a state the class is in.
 * Example: if the class has been loaded or not; .is('loaded'); // false
 */
sObjectClass.prototype.is = function(what) {
  var _this = this;
  return _this._is[what];
}

/*
 * Requests more information specified in the sObjects schema and constructs
 * the fields and data.
 */
sObjectClass.prototype.load = function(ready) {
  var _this = this;
  _this._sObjects.ajax({
    url: this._sObjectSchema.urls.describe,
    method: 'GET',
    success: function(data) {
      var fields = data.payload.fields
      _this.fields = {}
      for (var i = fields.length - 1; i >= 0; i--) {
        var field = fields[i];
        if(undefined !== field.name) {
          _this.fields[field.name] = field;
        }
      };
      _this._is['loaded'] = true;
      if(undefined !== ready) {
        ready(_this);
      }
    }
  });
  return _this;
}

/*
 * Utility method for providing the name of the sObject as specified in the
 * Salesforce.com instance 'Name' field.
 */
sObjectClass.prototype.className = function() {
  return this._sObjectSchema.name;
}

/*
 * READ method in the restful endpoints. Constructs the start of a query for the
 * sObject, given a set of fields. Dependant on the interface provided by the
 * SOQL object.
 */
sObjectClass.prototype.find = function(fields) {
  var _this = this;
  var queryBuilder = new SOQL({
    all: function(ready) {
      _this._deferUnlessLoaded(function() {
        _this._sObjects.ajax({
          url: (_this._sObjects._urls.query + '?q=' + queryBuilder.finish()),
          method: 'GET',
          success: function(data, status) {
            var results = [];
            var records = data.payload.records;
            for (var i = records.length - 1; i >= 0; i--) {
              results.push(new sObjectRecord(_this, records[i]));
            };
            ready(results, data, status);
          }
        });
      });
    }
  });
  return queryBuilder.select(fields).from(this.className());
}

/*
 * Instantiates one or more non-persisted sObjectClass record. If an array of
 * attributes is provided an sObjectRecord is created for each and returned.
 * If only a singly anonymous object containing the attributes is provided,
 * only it is returned.
 */
sObjectClass.prototype.build = function(attributes) {
  var _this = this;
  var results = [];
  if(Object.prototype.toString.call(attributes) === '[object Array]') {
    for (var i = attributes.length - 1; i >= 0; i--) {
      results.push(new sObjectRecord(_this, attributes[i]));
    }
  } else {
    result = new sObjectRecord(_this, attributes);
  }
  return results;
}

/*
 * CREATE method in the restufl CRUD endpoints. Posts a set of fields and
 * parses the result into a refined set of objects for the callback method to
 * handle.
 */
sObjectClass.prototype.create = function(record, after) {
  var _this = this;
  _this._sObjects.ajax({
    url: this.url(),
    method: 'POST',
    payload: record.get(),
    success: function(data) {
      record.set(data.payload);
      after(data);
    }
  });
  return record;
}

/*
 * CREATE method in the restufl CRUD endpoints. Posts a set of fields and
 * parses the result into a refined set of objects for the callback method to
 * handle.
 */
sObjectClass.prototype.read = function(record, after) {
  var _this = this;
  _this._sObjects.ajax({
    url: record.url(),
    method: 'GET',
    success: function(data) {
      record.set(data.payload);
      after(data);
    }
  });
  return record;
}

/*
 * UPDATE method in the restufl CRUD endpoints. PATCHES one or more sObject
 * records parses the result back into the obejcts for the callback method to
 * handle.
 */
sObjectClass.prototype.update = function(record, after) {
  var _this = this;
  _this._sObjects.ajax({
    url: record.url(),
    method: 'PATCH',
    payload: record.get(),
    success: function(data) {
      record.set(data.payload);
      after(data);
    }
  });
  return record;
}

/*
 * DELETE method in the restful CRUD endpoints. DELETES one or more sObject
 * records parses the resulting success of failure and returns it to a callback.
 */
sObjectClass.prototype.delete = function(record, after) {
  var _this = this;
  _this._sObjects.ajax({
    url: record.url(),
    method: 'DELETE',
    success: function(data) {
      after(data);
    }
  });
  return record;
}
