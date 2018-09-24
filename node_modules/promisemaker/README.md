# promisemaker 0.1.3 - documentation

Converts methods using callbacks into methods returning promises. Can convert a whole module/library (like fs) at once.

Thomas Frank, Nodebite, April 2016

### Install

Install: **npm install promisemaker**
(or incude as an dependency in your package.json file)

## Usage

### Simple example - convert the fs module
```javascript
var pm = require("promisemaker");

// Wrap the fs module with promisemaker
var fs = pm( require("fs") );

// Now all methods return promises
fs.readFile("./package.json","utf8").then(
  function(x){
    console.log("Resolved", x);
  },
  function(x){
    console.log("Rejected",x);
  }
);
```

### Advanced example - convert the mysql module
```javascript
var pm = require("promisemaker");

var mysql = require('mysql');

// When it comes to the mysql module
// what we want to wrap is an instance
// the "connection"

var connection = pm(
  mysql.createConnection({
    "host": "127.0.0.1",
    "user": "root",
    "password": "dbPassword",
    "database": "someDatabase"
  }),
  {
    // The connection object of the mysql module
    // has a method called query
    // that returns rows and fields to the original
    // callback function as different arguments
    // here we tell promisemaker
    // to map this to an object with properties
    mapArgsToProps: {query: ["rows", "fields"]}
  }
);

connection.query('SHOW TABLES').then(
  function(x){
    console.log("Resolved", x.rows);
  },
  function(x){
    console.log("Rejected",x);
  }
);
```

## ES7 and await
Although we use traditional ES6 above, obviously one of the
cool things with *promisemaker* is that if we run it in an
ES7 environment we can use it with awaits:
```javascript
var pm = require("promisemaker");

// Wrap the fs module with promisemaker
var fs = pm( require("fs") );

// Use with await in ES7
var fileContents = await fs.readFile("./package.json","utf8");
``` 

## Settings
As you saw in the advanced example *promisemaker* has a number of settings you can send to it as a a second argument. Their usage and default values are as follows:
```javascript
{
  // rejectOnErrors: If set to false resolves even on errors.
  rejectOnErrors: true,
  // syncFuncs : Strings and regexps to match function names against
  // when deciding if a function is synchronous.
  syncFuncs: [ /.*?Sync$/ ],
  // syncFuncsReturnPromises: If false returns the value directly
  // for a synchronous function, instead of a promise
  syncFuncsReturnPromises: true,
  // If the callback receives several arguments (apart from an error)
  // then we can map the arguments into property names.
  // If a mapping exists the promises receives an object,
  // otherwise it receives the argument array.
  mapArgsToProps: {/*"someFuncName": ["prop1", "prop2"]*/}
}
```
