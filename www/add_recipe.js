let recipeName;
let portions;
let category;
let instructionArray = [];
let ingredientArray = [];
let imageUrl;
let recipeNew;

//ADD category
$('#recipe-category').on("change", function () {

    category = $('#recipe-category').val();
    console.log("category added");

})
//ADD Portions
function addPortions() {
    portions = $('#recipe-portions').val();
    console.log("portions added");

}
///NAME
function addName() {
    recipeName = $('#recipe-name').val();
    console.log("name added");
}


//INSTRUCTIONSPART OF FORM
$('#add_instruction').click(function () {
    let instruction = $('#recipe-instruction').val();
    if (instruction == "") {
        alert("Du måste skriva något i instruktionsrutan")
    }
    else {
        $('#recipe-instruction').val("")
        instructionArray = instructionArray.concat(instruction);
        $('#display-instructions').append(`<li>${instruction}</li>`);
        console.log(instruction, "added");
    }
})

//INGREDIENTS PART OF FORM
$('#ingredient-name').keyup(function () {
    let searchValue = $('#ingredient-name').val();
    $('#ingredientAc').empty();

    if (searchValue.length > 1) {
        getAutocomplete(searchValue);
    }
})

function getAutocomplete(searchValue) {
    $.get('http://localhost:3000/autocomplete-ingredient-name/' + searchValue, (data) => {
        data.forEach(listAc);
    });

}

function listAc(ingredient) {
    $('#ingredientAc').append(`<li class="list-group-item">${ingredient.Namn}</li> `);
}

$("#ingredientAc").click(function (event) {
    var target = $(event.target);
    if (target.is("li")) {
        $('#ingredient-name').val(target.text());
    }
    $('#ingredientAc').empty();
});

$('#measure-unit').on("change", function () {
    if ($(this).val() === "g") {
        $('#grams').val($('#NoOfUnits').val());
    }
})

////////////////////////ADDING INGREDIENTS/////////////////
$('#add_ingredient').click(function () {
    let name = $('#ingredient-name').val();
    let unit = $('#NoOfUnits').val();
    let measuringUnit = $('#measure-unit').val();
    let unitEquivalentInGrams = $('#grams').val();
    if (name == "" || unit == "" || measuringUnit == "" || unitEquivalentInGrams == "") {
        alert("Du måste fylla i alla ingrediensfälten!")
    }
    else {
        
        ingredientArray = ingredientArray.concat({
            name: name,
            unit: unit,
            measuringUnit: measuringUnit,
            unitEquivalentInGrams: unitEquivalentInGrams,
            unitPerPortion: unitEquivalentInGrams / portion
        });


        $('#display-ingredients').append(`<li>${name} ${unit}${measuringUnit} mängd i gram: ${unitEquivalentInGrams}</li>`);
        emptyIngredient();
    }
});

function emptyIngredient() {
    $('#ingredient-name').val('');
    $('#NoOfUnits').val('');
    $('#measure-unit').prop('selectedIndex', 0);
    $('#grams').val('');
}


///////URL ADDING
$('#add_image').click(function () {
    imageUrl = $('#imageUrl').val();
    alert("Bild tillagd!")

})

//validate
$('#submit').click(function (e) {
    e.preventDefault();
    let name = $('#recipe-name').val();
    let portions = $('#recipe-portions').val();
    let category = $('#recipe-category').val();
    let instructions = $('#display-instructions li').val();
    let ingredients = $('#ingredientsAdded li').val();
    let imageUrl = $('#recipe-image').val();

    $(".error").remove();
    if (name === "") {
        alert('Du måste fylla i receptnamn!');
    }
    if (portions === "") {
        alert('Du måste fylla i antal personer!')

    }
    if (category === "") {
        alert("Du måste välja kategori");
    }
    if (instructions === undefined) {
        alert("Du måste lägga till instruktioner")
    }
    if (ingredients === undefined) {
        alert("Du måste lägga till ingredienser!")
    }
    if (imageUrl === "") {
        alert("Du måste lägga till en bild-url!")
    }
    else ;
});
/*$('#preview-button').click(function (e) {
    e.preventDefault();
    let name = $('#recipe-name').val();
    let portions = $('#recipe-portions').val();
    let category = $('#recipe-category').val();
    let instructions = $('#display-instructions li').val();
    let ingredients = $('#ingredientsAdded li').val();
    let imageUrl = $('#recipe-image').val();

    $(".error").remove();
    if (name === "") {
        alert('Du måste fylla i receptnamn!');
    }
    if (portions === "") {
        alert('Du måste fylla i antal personer!')

    }
    if (category === "") {
        alert("Du måste välja kategori");
    }
    if (instructions === undefined) {
        alert("Du måste lägga till instruktioner")
    }
    if (ingredients === undefined) {
        alert("Du måste lägga till ingredienser!")
    }
    if (imageUrl === "") {
        alert("Du måste lägga till en bild-url!")
    }
    else (preViewRecipe());
}); */

///SEND RECIPE

function postRecipe() {
    //  let newRecipe = new AddRecipe(recipeName, recipePeople, instructionArray, ingredientArray, imageUrl);

    let newRecipe = {
        name: recipeName,
        people: recipePeople,
        instructions: instructionArray,
        ingredients: ingredientArray,
        category: category,
        urlToImage: imageUrl
    };

    addRes(newRecipe);
    preViewRecipe(newRecipe);
}
function preViewRecipe(newRecipe) {

    let display = $('<section></section>');
    display.addClass('display');
    $("#preview").append(display);

    let title = $('<h4></h4>');
    title.text(newRecipe.name);
    display.append(title);

    let portions = $(`<div class=row><p>Antal portioner: </p><p>${newRecipe.portions}</p></div>`)
    display.append(portions);

    let ingredientUlList = $('<ul></ul>');
    display.append(ingredientUlList);
    newRecipe.ingredients.forEach((ingredient) => {
        let ingredientLi = $('<li></li>');
        ingredientLi.text(ingredient.name + ' ' + ingredient.units + ' ' + ingredient.measuringUnit);
        ingredientUlList.append(ingredientLi);

    })

    let instructionsOlList = $('<ol></ol>');
    display.append(instructionsOlList);
    newRecipe.instructions.forEach((instruction) => {
        let instructionLi = $('<li></li>');
        instructionLi.text(instruction);
        instructionsOlList.append(instructionLi);
    })

    let imageDisplay = $('<div></div>')
    display.append(imageDisplay);
    let image = $(`<img src="${newRecipe.urlToImg}" class="img-thumbnail">`)
    imageDisplay.append(image);

    $('#preview').empty();
    $('section.display').remove();
    $('#preview').append(display);


}


function addRes(recipe) {

    $.ajax({
        url: 'http://localhost:3000/addrecipe',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(recipe),
        success: function (res) {
            alert("Receptet är tillagt")
            emptyForm();
        }
    })
}

function emptyForm() {
    $('#recipeName').val('');
    $('#nbrPeople').val('');
    $('#measurementSelector').prop('selectedIndex', 0);
    $('#imageUrl').val('');
    $('#instructionsAdded').empty();
    $('#ingredientsAdded').empty();
}