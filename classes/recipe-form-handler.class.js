const Ingredient = require('./ingredient.class');

module.exports = class RecipeFormHandler {

    static autoCompleteSearch() {
        let list = RecipeHandler.getRecipeList();
        $('#search-value').autocomplete({
            source: list
        });
    }
    static search() {
        let field = $("#searchfield");
        let input = field.val();
        field.val('');
        RecipeFormHandler.showRecipe(input);
    }
    static showRecipe(recipeName) {

        //get recipe object
        let recipe = RecipeHandler.getRecipe(recipeName);
        let foundRecipe = recipe._name != undefined ? true : false;
    }
    static submitRecipe() {

        let recList = RecipeHandler.getRecipeList();

        let recipe = new Recipe();
        let ingredients = [];

        let okToSave = true;
        

        //check if recipe already exist
        recipe.name = RecipeFormHandler.capFirstLetter($('#recipe-name').val());
        if (recList.includes(recipe.name)) {
            if (confirm(`Du skriver över befintligt recept: ${recipe.name}`)) {
                okToSave = true;
                editRecipe = true;
            } else {
                okToSave = false;
            }
        }
        if (okToSave) {
            //Format and set recipe from inputs
            let categoryinput = $('#recipe-category').val();
            recipe.description = $('#recipe-instruction').val();
            if (categoryinput != undefined && categoryinput != '') {
                recipe.categories = categoryinput.split(',').map(string => RecipeFormHandler.capFirstLetter(string));
            } else {
                recipe.categories = undefined;
            }
            recipe.portions = $('#recipe-portions').val();
            if ($('#recipe-img').val() != '') {
                recipe.img = $('#recipe-img').val();
            }

            $('#ingredient-name').each(function () {
                let $this = $(this);
                let ingredient = new Ingredient();
                $this.children('#ingredient-name').each(function () {
                    let input = $(this);
                    let val = input.val();
                    if (val != undefined && val != "") {
                        if (input.attr('name') == "ingredient_name") {
                            ingredient.name = RecipeFormHandler.capFirstLetter(val);
                        } else if (input.attr('name') == "ingredient") {
                            ingredient.id = val;
                        } else if (input.attr('name') == "amount") {
                            ingredient.amount = val;
                        } else if (input.attr('name') == "unit") {
                            ingredient.unit = val;
                        } else if (input.attr('name') == "gram") {
                            //if unit is gram, fill 'gram' with amount
                            if (ingredient.unit != 'g') {
                                ingredient.gram = val;
                            } else {
                                ingredient.gram = ingredient.amount;
                            }
                        }
                    }
                });
                //if ingredient exist, check if all inputs is filled out for each ingredient.
                if (ingredient != undefined) {
                    //if ingredient exists and all fields are filled, go ahead and push ingredient to ingr list
                    if (ingredient.name != undefined && ingredient.amount != undefined && ingredient.id != undefined && (ingredient.gram != undefined || ingredient.unit == 'g')) {
                        ingredients.push(ingredient);
                        //if ingredient exist and not all fields is filled out, alert! all but unit
                    } else if (ingredient.name != undefined || ingredient.amount != undefined || ingredient.id != undefined || ingredient.gram != undefined) {
                        alert('Du måste fylla i alla 3 fält för varje ingredient!');
                        throw (new Error(`Du måste fylla i alla 3 fält för varje ingredient!`));
                    }

                }
            });

            recipe.ingredients = RecipeHandler.setNutritionValues(ingredients);
            RecipeHandler.submitRecipe(recipe);
            location.assign('/');
        }
    }
}