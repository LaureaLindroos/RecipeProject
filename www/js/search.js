//Searching for recipe

//functions for button
 $('#search-button').click(()  =>{
    let searchValue = $('#search-value').val();
    getRecipes(searchValue);
});

   $(document).keypress( function(e){
    let searchValue = $('#search-value').val();
    if(e.key === "Enter"){
        console.log("You've pressed the enter key!");
    }
    getRecipes(searchValue);
});

  //Autocomplete the search
 /* $('#search-value').keyup(function(){
    $('#result').html('');
    $('#resultAc').empty();
    $('#search-result').empty();
    let searchValue = $('#search-value').val();
    if(searchValue.length >1){
    getRecipeList(searchValue);
    
    }
});*/  
function autoCompleteSearch() {
    let list = RecipeHandler.getRecipeList();
    $('#search-value').autocomplete({
        source: list
    });
}


function getRecipes(searchValue){
    
    $.get('http://localhost:3000/recipes/' + searchValue, (data) => {
        $('#search-result').empty();
        data.Foreach(writeRecipes);
        $('#resultAc').empty();
            
    });
     
}

function writeRecipes(recipe) {
    $('#search-result').append(`<h4> <a class="result-list" href="#" data-value="${recipe.name}"> ${recipe.name}</a> </h4>`/* , `<p> ${recipe.description}</p>` */);
}

function recipeList(recipe){
    $('#search-result').append(`<li  class="list-group-item" id="selected-recipe">${recipe.name}</li> `);

}
$('.result-list').click(()=>{
    let showRecipe = $(this).dataset.val();
    console.log(showRecipe);
});

$('#selected-recipe').click(()=>{
    let searchVal= $('#selected-recipe').val;
    console.log(searchVal);
});

$( "#resultAc" ).click(function( event ) {
    var target = $( event.target );
    if ( target.is( "li" ) ) {
      var searchVal = $(this).text();
      $('#search-value').val(searchVal);
      getRecipes(searchVal);
    }
  });


