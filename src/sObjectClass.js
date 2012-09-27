/*
 *  sObjectClass
 * ============================================================================
 * author: Jack Galilee
 * date: 27th September 2012
 * version: DEVELOPMENT
 */


/*
 * Defines the type sObject schema that will be used to manage the specific type
 * of sObject as defined on the Salesforce.com instance. Each instance contains
 * a schema provided by the instance of sObjects it belongs to.
 */
sObjectClass = function(sObjects, sObjectSchema) {
  var _this = this;
  _this._sObjects = sObjects;
  _this._sObjectSchema = sObjectSchema;
  _this._className = '';
  _this._loaded = false;
  _this._queryBuilder = new SOQL({
    all: _this.all
  });
  return _this;
}

/*
 * Utility method to simplify callback to the Salesforce.com instance.
 */
sObjectClass.prototype._ajax = function(options) {
  var body = {
    token: sr.oauthToken,
    method: options.method,
    contentType: "application/json",
    success: options.success
  }
  if(undefined !== options.payload) {
    body["data"] = JSON.stringify(options.payload);
  }
  Sfdc.canvas.client.ajax(options.url, body);
  return this;
}

/*
 * Utility method to defer a callback until after the schema information
 * has been loaded for the specific class.
 */
sObjectClass.prototype._deferUnlessLoaded = function(defer) {
  if(this.is('loaded') == false) {
    this.load(defer);
  } else {
    defer();
  }
  return this;
}

/*
 * Requests more information specified in the sObjects schema and constructs
 * the fields and data.
 */
sObjectClass.prototype.load = function(ready) {
  Sfdc.canvas.client.ajax(this._sObjectSchema.urls.describe, {
    token: this._sObjects._sr.oauthToken,
    method: 'GET',
    contentType: "application/json",
    success: function(data) {
      var fields = data.payload.fields
      this.fields = {}
      for (var i = fields.length - 1; i >= 0; i--) {
        var field = fields[i];
        if(undefined !== field.name) {
          this.fields[field.name] = field;
        }
      };
      this._is['loaded'] = true;
      if(undefined !== ready) {
        ready(this);
      }
    }
  });
  return this;
}

/*
 * Utility method for providing the name of the sObject as specified in the
 * Salesforce.com instance 'Name' field.
 */
sObjectClass.prototype.className = function() {
  return this._className;
}

/*
 * CREATE method in the restufl CRUD endpoints. Posts a set of fields and
 * parses the result into a refined set of objects for the callback method to
 * handle.
 */
sObjectClass.prototype.create = function(fields, after) {
  var record = new sObjectRecord(this, fields);
  this._ajax({
    url: this._generalUrl,
    method: 'POST',
    payload: this._attributes,
    success: function() {
      after();
    }
  });
  return record;
}

/*
 * READ method in the restful endpoints. Constructs the start of a query for the
 * sObject, given a set of fields. Dependant on the interface provided by the
 * SOQL object.
 */
sObjectClass.prototype.find = function(fields) {
  return this._queryBuilder.
    select(fields).
    from(this.className());
}

/*
 * Assistant method to the find method. If called after a query has been
 * constructed it will post the finished result from the SOQL builder attached.
 */
sObjectClass.prototype.all = function(ready) {
  var _this = this;
  return _this._deferUnlessLoaded(function() {
    _this._ajax({
      url: (_this._sObjects._urls.query + '?q=' + _this._queryBuilder.finish()),
      method: 'GET',
      success: function(data) {
        ready(data.payload.records);
      }
    });
  });
}

/*
 * UPDATE method in the restufl CRUD endpoints. PATCHES one or more sObject
 * records parses the result back into the obejcts for the callback method to
 * handle.
 */
sObjectClass.prototype.update = function(sobjects, after) {
  var record = new sObjectRecord(this, fields);
  this._ajax({
    url: this._specificUrl,
    method: 'PATCH',
    payload: this._attributes,
    success: function() {
      after();
    }
  });
  return record;
}

/*
 * DELETE method in the restufl CRUD endpoints. DELETES one or more sObject
 * records parses the resulting success of failure and returns it to a callback.
 */
sObjectClass.prototype.delete = function(sobjects, after) {
  var record = new sObjectRecord(this, fields);
  this._ajax({
    url: this._specificUrl,
    method: 'DELETE',
    success: function() {
      after();
    }
  });
  return record;
}
