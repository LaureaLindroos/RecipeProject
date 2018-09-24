var pm = require("promisemaker");
 
// Wrap the fs module with promisemaker 
var fs = pm( require("fs") );
 
// Now all methods return promises 
// and can be used with await in ES7
var fileContent = await fs.readFile("./package.json","utf8");

console.log(fileContent);