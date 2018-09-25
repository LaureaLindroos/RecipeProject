// You can epxort functions, objects, classes and more
// as Node.js modules by assigning them to module.exports
module.exports = class Ingredient {

  constructor(props){
    // Object.assign copies properties
    // to a target (first argument)
    // from one or more sources (second - N argument)
    // so here we copy all properties from the 
    // object props to the instance (this) being created
    Object.assign(this, props);
  }

}