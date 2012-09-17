#sObjects.js

Provides easier access to the Force.com Canvas API.

## Usage

### Getting access to the canvas.

Using the existing canvas api.

````js
Sfdc.canvas(function() {
  var sr = JSON.parse('<%=signedRequestJson%>');
  Sfdc.canvas.oauth.token(sr.oauthToken);
  
  // Code using the canas goes here.
  
});
````

Using sObjects.

````js
Sfdc.canvas(function() {
  var sObjects = new sObjects();
  sObjects.instantiate('<%= raw @canvasRequestJson %>', function() {
    
    // Code utilising sObjects goes here.
    
  });
});
````

#### Performing a SOQL query

Using the existing canvas api.

````js
Sfdc.canvas(function() {
  var sr = JSON.parse('<%=signedRequestJson%>');
  Sfdc.canvas.oauth.token(sr.oauthToken); // Save the token

  var queryUrl = sr.instanceUrl + sr.context.links.queryUrl;
  var soqlQuery = "SELECT Id, Name, FROM Account";

  Sfdc.canvas.client.ajax(queryUrl + "?q=" + soqlQuery, {
    token: sr.oauthToken,
    method: 'GET',
    contentType: "application/json",
    success: function(data) {
      console.log('Found the id and name of all accounts: ', data.payload.records);
    }
  });
});

````

Using sObjects.

````js
sObjects.Account.find(['Id', 'Name']).all(function(records) {
  console.log('Found the id and name of all accounts: ', records);
});
````

## What does it do for me though?

sObjects loads all information about sObjects available in the context that canvas app is running. They are then available as a property of sObjects. sObject queryies are lazy loaded, specific information about an sObject is only retrived when required.

You can force sObjects to load by calling the load function.

````js
sObjects.Account.load(function() {
  console.log('sObjects.Account finished loading');
}
````

If you do not want to call the load function, this will automatically be called when you do your first query. Your first query will also run asynchronously, however subsequent calls will not.

````js

// First query
sObjects.Account.find(['Id', 'Name']).all(function(records) {
  console.log('Found the id and name of all accounts in an asynchronous callback ', records);
});

// Second query
sObjects.Account.find(['Id', 'Name']).all(function(records) {
  console.log('Found the id and name of all accounts in a synchronous callback ', records);
});

````
