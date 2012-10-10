# sObjects.js

Currently there exists very little documentation about how to use the new Force.com canvas javascript library. This library hopes to remove the difficulty of locating these resources and to provide a friendly wrapper for the existing library making it easier to use and bringing it inline with modern javascript libraries.

## Building

Building the sObjects.js library requires nodejs, npm and a global installation of the npm jake package.

git clone this library and install the node dependencies.

````shell
sudo npm install dependencies
````

To build the sObjects.js library run jake

````shell
jake
````

The sobjects.min.js file will now be in the current directory.


## Installation

Installing the library into a Ruby on Rails or Java application is as easy as adding it to the javascript assets, and making sure that is included correctly.

## Usage

Detailed usage can be found at the [sObjects Wiki.](https://github.com/jgalilee/sObjects.js/wiki)

## Overview

Using the sObjects library is simple. Examples for the Force.com canvas require you to setup the request object as follows.

````js
Sfdc.canvas(function() {
  var sr = JSON.parse('<%=signedRequestJson%>');
  Sfdc.canvas.oauth.token(sr.oauthToken);

  // Code using the canvas goes here.

});
````

sObjects simplifies this low level approach by providing a wrapping function. In the background sObjects will curate the data available with the Force.com canvas api and map it into a more robust and semantically enjoyable library.

````js
Sfdc.canvas(function() {
  var sObjects = new sObjects();
  sObjects.instantiate('<%= raw @canvasRequestJson %>', function() {

    // Code using canvas goes here.
    // Code using sObjects goes here.

  });
});
````

sObjects does not mutate the existing library which can still be accessed with ...

````
sObjects.getBase() // return result of var sr = JSON.parse('<%=signedRequestJson%>');
````

### Accessing sObjects

sObjects will load all of the objects that are available in the context of the Force.com canvas. They are accessible as an attribute of sObjects where there name denotes the attribute of sObjects.

Example: Accounts have the name Account, so the Account sObjects is referenced with …
````js
sObjects.Account
````

sObjects are not loaded by default. You can force an sObject to load by calling the load method. Loading an sObject retrieves the schema for the sObject and all of its fields. It also prepares the urls required to query and update the sObject.

sObjects can be loaded with …
````js
sObjects.Account.load(function(result) {
  console.log('sObjects.Account.load callback');
});
````

### Querying sObjects

Borrowing from the rails active record and arel libraries sObjects implement their own programatic query interface for constructing SOQL queries.

Without sObjects querying the Id and Name fields from the Account records involves the following...

````js
Sfdc.canvas(function() {
  var sr = JSON.parse('<%=signedRequestJson%>');
  Sfdc.canvas.oauth.token(sr.oauthToken); // Save the token

  var queryUrl = sr.instanceUrl + sr.context.links.queryUrl;
  var soqlQuery = "SELECT Id, Name FROM Account";

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

Using sObjects is not only semantically nicer, but allows for easy construction of complex SOQL queries.

````js
sObjects.Account.find(['Id', 'Name']).all(function(records) {
  console.log('Found the id and name of all accounts: ', records);
});
````

#### Queries and sObject loading

sObjects loads all information about sObjects available in the context that canvas app is running. They are then available as a property of sObjects. sObject queries are lazy loaded, specific information about an sObject is only retrieved when required.

You can force sObjects to load by calling the load function.

````js
sObjects.Account.load(function() {
  console.log('sObjects.Account finished loading');
}
````

If you do not want to call the load function, this will automatically be called when you do your first query.
If you chose to do this, your first query will load the sObject details and then perform the query, subsequent
queries will not call the load method.

````js

// First query
sObjects.Account.find(['Id', 'Name']).all(function(records) {
  console.log('Found the id and name of all accounts in an asynchronous callback after load', records);
});

// Second query
sObjects.Account.find(['Id', 'Name']).all(function(records) {
  console.log('Found the id and name of all accounts in an asynchronous callback ', records);
});

````
