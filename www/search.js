//Searching for recipe

//function for button
 $('#search-button').click(()  =>{
    let searchValue = $('#search-value').val();
    getRecipes(searchValue);
})
$(document).keypress( function(e){
    let searchValue = $('#search-value').val();
    if(e.key === "Enter"){
        console.log("You've pressed the enter key!");
        getRecipes(searchValue);
    }
})
//Fetch data from JSON-file
function getRecipes(searchValue){
    
    $.get('http://localhost:3000/recipes/' + searchValue, (data) => {
        $('#search-result').empty();
        data.forEach(writeRecipes);
            
    });
    
}
//Display data on page
function writeRecipes(recipe) {

    
    $('#search-result').append(`<h4> ${recipe.name} </h4>`);
    $('#search-result').append(`<h5> ${recipe.instructions}</h5>`);

    //To search for ingredients we have to go to an object within the object in JSON file
    let ingredients;
    for(let i of recipe.ingredients){
        $('#search-result').append(`<h5> ${i.name}</h5>`);
    }

}

