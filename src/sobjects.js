var sObjects = function() {

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

window.sObjects = sObjects;
