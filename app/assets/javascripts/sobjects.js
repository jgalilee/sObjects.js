sObjects = function() {

};

sObjects.prototype.loadUrls = function(ready) {
  var _this = this;
  _this._baseUrl = _this._sr.instanceUrl;
  _this._urls = {};
  var links = _this._sr.context.links;
  for(var key in links) {
    _this._urls[key.substr(0, key.length - 3)] = (_this._baseUrl + links[key]);
  }
  if(undefined !== ready) {
    ready();
  }
  return true;
}

sObjects.prototype.loadObjects = function(ready) {
  var _this = this;
  _this._sfdcClient.ajax(_this._urls.sobject, {
    token: _this._sr.oauthToken,
    method: 'GET',
    contentType: "application/json",
    success: function(data) {
      var sObjectSchemas = data.payload.sobjects;
      for (var i = sObjectSchemas.length - 1; i >= 0; i--) {
        var sObjectSchema = sObjectSchemas[i];
        if(undefined !== sObjectSchema.name) {
          _this[sObjectSchema.name] = new sObject(_this, sObjectSchema);
        }
      };
      if(undefined !== ready) {
        ready();
      }
    }
  });
  return true;
}

sObjects.prototype.instantiate = function(requestJSON, ready) {
  var _this = this;
  _this._sr = JSON.parse(requestJSON);
  _this._oauthToken = Sfdc.canvas.oauth.token(_this._sr);
  _this._sfdcClient = Sfdc.canvas.client;
  _this.loadUrls(function() {
    _this.loadObjects(function() {
      if(undefined !== ready) {
        ready(this);
      }
    });
  });
  return _this;
};

/*
 *  Definition of the sObject
 */

sObject = function(sObjects, sObjectSchema) {
  var _this = this;
  _this._sObjects = sObjects;
  _this._sObjectSchema = sObjectSchema;
}

sObject.prototype.load = function(ready) {
  var _this = this;
  Sfdc.canvas.client.ajax(_this._sObjectSchema.urls.describe, {
    token: _this._sObjects._sr.oauthToken,
    method: 'GET',
    contentType: "application/json",
    success: function(data) {
      console.log(data);
      var fields = data.payload.fields
      _this.fields = {}
      for (var i = fields.length - 1; i >= 0; i--) {
        var field = fields[i];
        if(undefined !== field.name) {
          _this.fields[field.name] = field;
        }
      };
      _this._loaded = true;
      if(undefined !== ready) {
        ready(_this);
      }
    }
  });
}

sObject.prototype.isLoaded = function() {
  var _object = this;
  return _object._loaded;
}

sObject.prototype.find = function(fields) {
  var _object = this;
  var _this = this.find;

  // Fields
  _this.query = 'SELECT ';
  for (var i = fields.length - 1; i >= 0; i--) {
    if(fields.length != 0 && (i < fields.length - 1)) {
      _this.query = _this.query + ', ' + fields[i];
    } else {
      _this.query = _this.query + ' ' + fields[i];
    }
  };
  _this.query = _this.query + ' FROM ' + _object._sObjectSchema.name;

  _this.where = function() {
    return _this;
  }

  _this.limit = function() {
    return _this;
  }

  _this.not = function() {
    return _this;
  }

  _this.in = function() {
    return _this;
  }

  _this.all = function(ready) {
    var queryUrl = _object._sObjects._urls.query + '?q=' + _this.query;
    var defer = function() {
      Sfdc.canvas.client.ajax(queryUrl, {
        token: _object._sObjects._sr.oauthToken,
        method: 'GET',
        contentType: "application/json",
        success: function(data) {
          ready(data.payload.records)
        }
      });
    }
    if(_object.isLoaded() == false) {
      _object.load(defer);
    } else {
      defer();
    }
    return '[' + _this.query + ']';
  }
  return _this;
}
