const Recipe = require('./recipe_handler.class');

const fs = require('fs');
const path = require('path');
const recipePath = path.join(__dirname, '../json/recipe.json');
let recipes = require(recipePath);

module.exports = class Routes {



  constructor(app, ingredients) {
    this.app = app;
    this.ingredients = ingredients;
    this.setRoutes();
  }

  

  setRoutes(){
//-------------------------    
//Autocomplete Ingredients
//-------------------------
this.app.get(
  '/autocomplete-ingredient-name/:startOfName',
  (req, res) => {


    let start = req.params.startOfName.toLowerCase();

    if (start.length < 2) {
      res.json({ error: 'Please provide at least two characters...' });
      return;
    }
    let ingredients = require('../json/livsmedelsdata.json') || [];

    let result = ingredients.filter((ingredient) => {
      return ingredient.Namn.toLowerCase().includes(start)
    })

    res.json(result);
  }
);
    //------------------
    //Filtering recipe
    //------------------
    this.app.get(
      '/recipes-by-category/:category',
      async (req, res) => {
        let valCategory = req.params.category.toLowerCase();
        console.log(valCategory);
        let categories = require('../json/recipe.json') || [];

        categories = categories.filter((recipe) => {
          console.log(recipe.category);
          if (recipe.category.toLowerCase() == valCategory) {
            console.log("added to list");
            return recipe.name.toLowerCase();
          }
        })
        res.json(categories);
      }
    );
  



   
    //--------------------------
    //Searching through recipes
    //--------------------------
    this.app.get(
      '/autocomplete-recipe-name/:startOfName',
      (req, res) => {
        let value = req.params.startOfName.toLowerCase();

        if(value.lenght < 2) {
          res.json({error: 'please provide at least 2 characters.'});
          return;

        }
        let result =this.recipes.filter(
          recipe = recipe.Namn.toLowerCase().indexOf(start) == 0
        ).map(
          recipe => recipe.name
        );
        res.json(result);
      }
    );

        this.app.get(
          '/recipes/:partOfRecipeName',
          async (req, res) => {
            let value = req.params.partOfRecipeName.toLowerCase();
    
            if (value.length < 2) {
              res.json({ error: 'Please provide at least two characters...' });
              return;
            }
    
            let recipes = require('../json/recipe.json') || [];
            
            recipes = recipes.filter((recipe) =>{
              return recipe.name.toLowerCase().includes(value)
            })
    
            res.json(recipes);
          }
        );
      

    this.app.get(
      '/recipe-by-name/:name', 
      async (req, res) => {
        let recipe = await RecipeHandler.readFromFile(req.params.name);
        res.json(recipe);
      }
    );

    this.app.post(
      '/recipe', 
      async (req, res) => {
        let recipe = new RecipeHandler(req.body);
        let result = await recipe.writeToFile();
        res.json(result);
      }
    );
    //-------------------------------
    //to get single recipe from list
    //-------------------------------
    
        this.app.get(
          '/recipe-list/:name',
          
             async (req, res) => {
              
              let value = req.params.name.toLowerCase();
              if (value.length === 0) {
                res.json({ error: 'No recipe name' });
                return;
              }
              let recipes = require('../json/recipe.json');
      
              let recipe = recipes.find((recipe) => recipe.name.toLowerCase().includes(value));
      
              res.json(recipe);
              console.log(recipe);
            } 
          );
        }
      }

      /* this.app.post(
        '/add-name', (req, res) => {
        console.log(req.body);
        let newName = req.body.recipe_name;
  
        console.log('New name added: ', newName);
        this.recipeObj.name = newName;
  
        res.json(this.recipeObj.name);
      }); */
      //find nutrition
    /* this.app.get(
      '/ingredients/:ingredient',
      (req, res) => {

        let ingredients = req.params.ingredient.toLowerCase();

        let ingredientDb = require('../json/livsmedelsdata.json') || [];

        let result = ingredientDb.find((ing) => ing.Namn.toLowerCase()===ingredients);

        res.json(result);

      }
    ); */
        
          
        