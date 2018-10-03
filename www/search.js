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
$('#search-value').keyup(function () {
    $('#result').html('');
    $('#resultAc').empty();
    $('#search-result').empty();
    let searchValue = $('#search-value').val();
    if (searchValue.length > 1) {
        getAutocomplete(searchValue);
    }
})
//Fetch data from JSON-file
function getRecipes(searchValue){
    
    $.get('http://localhost:3000/recipes/' + searchValue, (data) => {
        $('#search-result').empty();
        data.forEach(listRecipes);

        $('#resultAc').empty();
    });
    
}
//Autocomplete
$("#resultAc").click(function (event) {
    var target = $(event.target);
    if (target.is("li")) {
        $('#search-value').val(target.text());
        getRecipes(target.text());
    }
});

function getAutocomplete(searchValue) {
    $.get('http://localhost:3000/recipes/' + searchValue, (data) => {
        data.forEach(listAc);
    });

}
//Listing autocomplete
function listAc(recipe) {
    $('#resultAc').append(`<li class="list-group-item">${recipe.name}</li> `);
}
//Listing the result in form of list with clickable links
function listRecipes(recipe) {
    console.log("Hej");
    $('#search-result').append(`<li class="searchResult" data-value="${recipe.name}">${recipe.name}</li>`);
}
//Display data on page
/*function writeRecipes(recipe) {

    
     /*$('#search-result').append(`<h4> ${recipe.name} </h4>`);
    $('#search-result').append(`<h5> ${recipe.instructions}</h5>`);

    //To search for ingredients we have to go to an object within the object in JSON file
    let ingredients;
    for(let i of recipe.ingredients){
        $('#search-result').append(`<h5> ${i.name}</h5>`);
    } */

    //Filter
    //According to category
    $("#select-category").click(function (event) {
        var target = $(event.target);
        if (target.is("option")) {
            console.log(target.text());
            filterCategories(target.text());
        }
    });
    function filterCategories(category) {
        console.log(category);
        $.get('http://localhost:3000/recipes-by-category/' + category, (data) => {
            $('#search-result').empty();
            console.log(data);
            data.forEach(listRecipes);
        });
    }
    $("#select-category").on("change", function(){
        let category = $("#select-category").val();
        console.log($("#select-category").val());
        filterCategories(category);
    })
    



