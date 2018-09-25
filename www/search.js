$('#search-button').click(()  =>{
    let searchValue = $('#search-value').val();
    getRecipes(searchValue);
})
function getRecipes(searchValue){
    $.get('http://localhost:3000/recipes/' + searchValue, (data) => {
        $('#search-result').empty();
        data.forEach(addRecipes);
            
    });
}
function addRecipes(recipe) {
    
    $('#search-result').append(`<h4> ${recipe.name} </h4>`, `<p> ${recipe.description}</p>`);
}
