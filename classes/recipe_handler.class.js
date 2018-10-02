const RecipeIngredient = require('./recipe_ingredient.class');

module.exports = class RecipeHandler {

    constructor(props) {
    
       
        Object.assign(this, props);

    }

    static async readFromFile(value){
        
        value = value.toLowerCase().replace(/![a-z]/g,'');


        // if value exists within the recipe names in the .json file, 
        // gather those recipes with a partial match in
        // a variable and send it back
        
        let filePath = Recipe.createFilePath(recipeName);
        let contents = await fs.readFile(filePath, 'utf-8');
        // if the file doesn't exist we get an error
        if(contents instanceof Error){
          return {error: contents};
        }
        // otherwise we get JSON data that
        // we'll convert to a Recipe instance
        let data = JSON.parse(contents);
        return new RecipeHandler(data);
      }

      static getIngridientList() {

        let list = [];
        let getlist = (function () {
            let getlist = null;
            $.ajax({
                type: "GET",
                async: false,
                url: '/json/livsmlist',
                success: function (response) {
                    list = response;
                }
            });
        })();
        return list;

    }

    static getRecipeList() {
        let list = [];
        let json = (function () {
            let json = null;
            $.ajax({
                type: "GET",
                async: false,
                url: '/json/searchlist',
                success: function (data) {
                    list = data;
                }
            });
        });
        json();
        return list;
    }

    static getJson(jsonFile) {
        let json = (function () {
            let json = null;
            $.ajax({
                'async': false,
                'global': false,
                'url': `/json/${jsonFile}.json`,
                'dataType': "json",
                'success': function (data) {
                    json = data;
                }
            });
        })();
        return json;
    }

    static setNutritionValues(ingredients) {
        let ingrList = null;
        let jsonIngrs = JSON.stringify(ingredients);
        $.ajax({
            async: false,
            type: "POST",
            url: '/setnutritions',
            contentType: "application/json",
            data: jsonIngrs,
            success: function (response) {
                ingrList = response;
            }
        });
        return ingrList;
    }
    static getRecipe(recepeID) {
        let recipe = new Recipe();
        let foundRecipe = false;
        let getrecipe = (function () {
            let getrecipe = null;
            $.ajax({
                type: "GET",
                async: false,
                url: `/getrecipe/${recepeID}`,
                success: function (response) {
                    if (response != false) {
                        recipe = response;
                        foundRecipe = true;
                    }
                }
            });
        })();
        if (foundRecipe == true) {
            return recipe;
        } else {
            return null
        }
    }
    static submitRecipe(recipe) {
        let recipeJson = JSON.stringify(recipe);
        $.ajax({
            type: "POST",
            url: '/submit-recipe',
            contentType: "application/json",
            data: recipeJson,
            success: function (response) {
                if (response == 'done') {
                    alert('Ditt recept är tillagt!');
                }
            }
        });
    }

}