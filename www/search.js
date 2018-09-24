$('#search-button').click(()  =>{
    let searchValue = $('#search-value').val();
    getRecipes(searchValue);
})
function getRecipes(searchValue){
    $.get('http://localhost:3000/recipes/' + searchValue, (data) => {
        data.array.forEach(element => {
            
        });(addRecipes);
            
    });
}
function addRecipes(recipeName) {
    $('#search-result').empty();
    $('#search-result').append(`<h4> ${recipeName} </h4>`);
}