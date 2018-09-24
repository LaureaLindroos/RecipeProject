// require promisemaker, that converts modules
// with callbacks based methods to modules
// with methods that return promises
const pm = require("promisemaker");

// require the built in in module path
// that helps us buld file paths
const path = require('path');

// require the built in module fs
// and convert it with promisemaker to 
// return promises instead of callbacks
const fs = pm(
  require('fs'), 
  // Important: Never reject promises
  // - instead send the error as a resolve
  // (this is a promisemaker setting)
  { rejectOnErrors: false }
);

module.exports = class Recipe {

  // Note: Static methods
  // are methods common for the whole class
  // (not instance specific)

  static createFilePath(recipeName){
    // sanitize the recipename so that it can only
    // contain the characters a-z
    // (this prevents hacks with '../' in the path
    // as well as strange characters in the path)
    recipeName = recipeName.toLowerCase().replace(/![a-z]/g,'');
    // return a file path built with path.join
    return path.join(__dirname, '../json', 'recept', recipeName + '.json');
  }

  static async readFromFile(recipeName){
    let filePath = Recipe.createFilePath(recipeName);
    let contents = await fs.readFile(filePath, 'utf-8');
    // if the file doesn't exist we get an error
    if(contents instanceof Error){
      return {error: contents};
    }
    // otherwise we get JSON data that
    // we'll convert to a Recipe instance
    let data = JSON.parse(contents);
    return new Recipe(data);
  }

  constructor(props){
    // Move all properties in the object props
    // to the instance we are creating
    
    // Please Note: Right now we are not
    // checking that any specific 
    // properties exists... we probably should ;)
    
    Object.assign(this, props);
  }

  async writeToFile(){
    let filePath =  Recipe.createFilePath(this.name);
    // check if the file exists
    let fileExists = !((await fs.stat(filePath)) instanceof Error);
    // if the file exists - return an error
    if(fileExists){
      return {error: 'A recipe with that name already exists! Cannot create the recipe!'}
    }
    await fs.writeFile(
      filePath,
      JSON.stringify(this, null, '  '),
      'utf-8'
    );
    // assume it worked
    return {success: 'Recipe created!'}
  }

}