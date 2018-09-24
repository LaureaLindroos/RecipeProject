// You can epxort functions, objects, classes and more
// as Node.js modules by assigning them to module.exports
module.exports = class Ingredient {

  constructor(props){
    
    Object.assign(this, props);
  }

}