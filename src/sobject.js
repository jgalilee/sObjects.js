sObject = function(sObjects, sObjectSchema) {
  var _this = this;
  _this._loaded = false;
  _this._sObjects = sObjects;
  _this._sObjectSchema = sObjectSchema;
  _this._currentAttributes = {};
  _this._pendingAttributes = {};
  _this._queryBuilder = new SOQL({
    all: _this.all
  });
  return _this;
}

sObject.prototype._deferUnlessLoaded = function(defer) {
  if(this.isLoaded() == false) {
    this.load(defer);
  } else {
    defer();
  }
  return this;
}

sObject.prototype._ajax = function(options) {
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

sObject.prototype.isLoaded = function() {
  return this._loaded;
}

sObject.prototype.load = function(ready) {
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
      this._loaded = true;
      if(undefined !== ready) {
        ready(this);
      }
    }
  });
  return this;
}

// record methods

sObject.prototype.get = function(key) {
  if(this._currentAttributes[key] !== undefined) {
    return this._currentAttributes[key];
  }
}

sObject.prototype.set = function(keyOrObject, optionalValue) {
  if(optionalValue !== undefined) {
    this._pendingAttributes[keyOrObject] = optionalValue;
  } else {
    for(key in keyOrObject) {
      this._pendingAttributes[key] = keyOrObject[key];
    }

  }
  return this;
}

sObject.prototype.savePendingAttributes = function() {
  for(var key in this._pendingAttributes) {
    this._currentAttributes[key] = this._pendingAttributes[key];
  }
}

sObject.prototype.reload = function(after) {
  this._ajax({
    url: this._specificUrl,
    method: 'GET',
    success: function() {
      after();
    }
  });
  return this;
}

// class query methods

sObject.prototype.find = function(fields) {
  return this._queryBuilder.
    select(fields).
    from(this.get('Name'));
}

// class rest methods

sObject.prototype.all = function(ready) {
  var _this = this;
  return _this._deferUnlessLoaded(function() {
    _this._ajax({
      url: (_this._sObjects._urls.query + '?q=' + this.query),
      method: 'GET',
      success: function(data) {
        ready(data.payload.records);
      }
    });
  });
}

sObject.prototype.create = function(fields, after) {
  this.set(fields);
  this._ajax({
    url: this._generalUrl,
    method: 'POST',
    payload: this._pendingAttributes,
    success: function() {
      after();
    }
  });
  return this;
}

sObject.prototype.update = function(fields, after) {
  this.set(fields);
  this._ajax({
    url: this._specificUrl,
    method: 'PATCH',
    payload: this._pendingAttributes,
    success: function() {
      after();
    }
  });
  return this;
}

sObject.prototype.delete = function(after) {
  this.set(fields);
  this._ajax({
    url: this._specificUrl,
    method: 'DELETE',
    success: function() {
      after();
    }
  });
  return this;
}
