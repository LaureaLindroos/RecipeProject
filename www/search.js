//Searching for recipe
 $('#search-button').click(()  =>{
    let searchValue = $('#search-value').val();
    getRecipes(searchValue);
})
function getRecipes(searchValue){
    
    $.get('http://localhost:3000/recipes/' + searchValue, (data) => {
        $('#search-result').empty();
        data.forEach(writeRecipes);
            
    });
    
}
function writeRecipes(recipe) {

    
    $('#search-result').append(`<h4> ${recipe.name} </h4>`);
    $('#search-result').append(`<h5> ${recipe.instructions}</h5>`);
    let ingredients;
    for(let i of recipe.ingredients){
        $('#search-result').append(`<h5> ${i.name}</h5>`);
    }

}

/* $('#search-button').on('click', async function(){
    let searchinput = $('#search-value').val().toLowerCase();
    recipes = await $.getJSON('/recipe.json').catch(console.err);
    let match = false;
    let result;
    for(let r of recipes){
        if(searchinput == r.name.toLowerCase()){
            console.log(r.name)
            match = true;
            result = r;
        }    
    }
    if(match){
        $('#search-result').text(result.name);
        $('#search-result').append('<br>');
    
        let ingredientlist;
        for(let i of result.ingredientlist){
            $('#search-result').append(i.name + " ");
            $('#search-result').append(i.units);
            $('#search-result').append(i.measuringUnit);
            $('#search-result').append('<br>');
        }
    }
    else{
     $('#search-result').text("Inget recept med det namnet hittades");
    }
}); */
