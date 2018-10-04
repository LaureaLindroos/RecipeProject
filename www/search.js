//Searching for recipe

//-------------------------------------
//function for  search field and button
//--------------------------------------
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

//--------------------------
//Fetch data from JSON-file
//-------------------------
function getRecipes(searchValue){
    
    $.get('http://localhost:3000/recipes/' + searchValue, (data) => {
        $('#search-result').empty();
        data.forEach(listRecipes);
        $('#resultAc').empty();
    });
    
}
//--------------
//Autocomplete
//---------------
$("#resultAc").click(function (event) {
    var target = $(event.target);
    if (target.is("li")) {
        $('#search-value').val(target.text());
        getRecipes(target.text());
    }
});
$('#search-value').keyup(function () {
    $('#result').html('');
    $('#resultAc').empty();
    $('#search-result').empty();
    let searchValue = $('#search-value').val();
    if (searchValue.length > 1) {
        getAutocomplete(searchValue);
    }
})

function getAutocomplete(searchValue) {
    $.get('http://localhost:3000/recipes/' + searchValue, (data) => {
        data.forEach(listAc);
    });

}

//----------------------
//Listing autocomplete
//---------------------
function listAc(recipe) {
    $('#resultAc').append(`<li class="list-group-item">${recipe.name}</li> `);
}

//----------------------
//Listing the result(s)
//-----------------------
function listRecipes(recipe) {
    $('#search-result').append(`<h3> <li class="searchResult" data-value="${recipe.name}">${recipe.name}</li> </h3>`);
}

//-------------------------
//Filter the results
//------------------------
$("#select-category").click(function (event) {
    var target = $(event.target);
    if (target.is("option")) {
        console.log(target.text())
        filterCategories(target.text());
    }
});


function filterCategories(category) {
    console.log(category);
    $.get('http://localhost:3000/recipes-by-category/' + category, (data) => {
        $('#search-result').empty();
        data.forEach(listRecipes);
    });
}


//----------------
//Click on result 
//----------------
$('#search-result').click(function (event) {
    var target = $(event.target);

    if (target.is("li")) {
        getRecipeData(target.text());
        console.log("Click!!!");
    }
});

//------------------------------
//Display  recipe data on page
//-------------------------------
function getRecipeData(name) {
    $.get('http://localhost:3000/recipe-list/' + name, (data) => {
        $('#search-result').empty();
        $('#resultAc').empty();
        displayRecipeData(data);
        findingNutrition(data.ingredients);
    });
}

function displayRecipeData(data) {
    let display = $('<section></section>');
    display.addClass('display');
    $("#search-result").append(display);
    
    let title = $('<h4></h4>');
    title.text(data.name);
    display.append(title);

    let portions = $(`<div class=row><p>Antal portioner: </p><p>${data.portions}</p></div>`)
    display.append(portions);

    let ingredientUlList = $('<ul></ul>');
    display.append(ingredientUlList);
    data.ingredients.forEach((ingredient) => {
        let ingredientLi = $('<li></li>');
        ingredientLi.text(ingredient.name + ' ' + ingredient.units + ' ' + ingredient.measuringUnit);
        ingredientUlList.append(ingredientLi);

    })

    let instructionsOlList = $('<ol></ol>');
    display.append(instructionsOlList);
    data.instructions.forEach((instruction) => {
        let instructionLi = $('<li></li>');
        instructionLi.text(instruction);
        instructionsOlList.append(instructionLi);
    })

    let imageDisplay = $('<div></div>')
    display.append(imageDisplay);
    let image= $(`<img src="${data.urlToImg}" class="img-thumbnail">`)
    imageDisplay.append(image);

    $('#search-result').empty();
    $('section.display').remove();
    $('#search-result').append(display);
    

}



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
    



