/*
 * sObjects
 * ============================================================================
 * author: Jack Galilee
 * ============================================================================
 * Core library. Constructs the classes by requesting and interpretings the
 * returned information. Provides helper functions for sObject Classes allowing
 * them to interact with the Force.com canvas.
 */
var sObjects = function(requestJSON, ready) {
  var _this = this;
  _this._sr = JSON.parse(requestJSON);
  _this._oauthToken = Sfdc.canvas.oauth.token(_this._sr);
  _this._sfdcClient = Sfdc.canvas.client;
  _this.loadUrls(function() {
    _this.loadObjects(function() {
      if(undefined !== ready) {
        ready(_this);
      }
    });
  });
  return _this;
};

/*
 * Utility method to simplify callback to the Salesforce.com instance.
 */
sObjects.prototype.ajax = function(options) {
  var _this = this;
  var body = {
    token: _this._sr.oauthToken,
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
 * Fetch the base URL for each of the sObject endpoints.
 */
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

/*
 * Request the schema definitions for each of the sObjects.
 */
sObjects.prototype.loadObjects = function(ready) {
  var _this = this;
  _this.ajax({
    url: _this._urls.sobject,
    method: 'GET',
    success: function(data) {
      var sObjectSchemas = data.payload.sobjects;
      for (var i = sObjectSchemas.length - 1; i >= 0; i--) {
        var sObjectSchema = sObjectSchemas[i];
        if(undefined !== sObjectSchema.name) {
          _this[sObjectSchema.name] = new sObjectClass(_this, sObjectSchema);
        }
      };
      if(undefined !== ready) {
        ready(_this, data, status);
      }
    }
  });
  return true;
}

window.sObjects = sObjects;
