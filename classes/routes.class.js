// We have dependencies to other modules/classes
const Recipe = require('./recipe.class');

// probably singleton
// sets all Express routes
module.exports = class Routes {

  constructor(app, ingredients){
    this.app = app;
    this.ingredients = ingredients;
    this.setRoutes();
  }

  setRoutes(){
    // set some routes
    // we might split this method into several later

    // should we have a route that returns ingredients by id?
    // then it should be app.get('/ingredients/1)
    // we coud use .Nummer as an equivalent of id in a DB...

    // should we return all ingredients if we just call
    // app.get('/ingredients')
    // in that case should we return them in a short form
    // without all their properties?

    this.app.get(
      '/autocomplete-ingredient-name/:startOfName',
      (req, res) => {
        // req.params will include properties with the names
        // of params I have defined with :paramName in my route/url
        let start = req.params.startOfName.toLowerCase();
        // require at least two characters
        if(start.length < 2){
          res.json({error: 'Please provide at least two characters...'});
          return;
        }
        // filter ingredients so that only those with a Namn
        // matching start are left, then map from obj to obj.Namn
        let result = this.ingredients.filter(
          ingredient => ingredient.Namn.toLowerCase().indexOf(start) == 0
        ).map(
          ingredient => ingredient.Namn
        );
        res.json(result);
      }
    );

    this.app.get(
      '/recipe-by-name/:name', 
      async (req, res) => {
        let recipe = await Recipe.readFromFile(req.params.name)
        res.json(recipe);
      }
    );

    this.app.post(
      '/recipe', 
      async (req, res) => {
        let recipe = new Recipe(req.body);
        let result = await recipe.writeToFile();
        res.json(result);
      }
    );

  }

}