//RecipeFormHandler.showCategories();

$('#search-button').on('click', 
$(this).RecipeFormHandler(search)); //Done
$('#search-value').on('focus', RecipeFormHandler.autoCompleteSearch); //Done

$(document).keypress( function(e){
    let searchValue = $('#search-value').val();
    if(e.key === "Enter"){
        console.log("You've pressed the enter key!");
    }
    RecipeFormHandler.search;
});


$('#search-result').on('click', function (e) {
    let text = $(e.target).text();
    RecipeFormHandler.showRecipe(text);
});

