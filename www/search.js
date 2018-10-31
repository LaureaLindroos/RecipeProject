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
let calculatePortions;

function displayRecipeData(data) {
    let display = $('<section></section>');
    display.addClass('display');
    $("#search-result").append(display);
    
    let title = $('<h4></h4>');
    title.text(data.name);
    display.append(title);

    let imageDisplay = $('<div></div>')
    display.append(imageDisplay);
    let image= $(`<img src="${data.urlToImg}" class="img-thumbnail">`)
    imageDisplay.append(image);

    calculatePortions = data.portions;

    let portions = $(`<select id="selectPortions">
    <option selected value="${data.portions}">${data.portions}</option>
    <option value="1">1</option>
    <option value="2">2</option>
    <option value="4">4</option>
    <option value="8">8</option>
  </select>`)
    display.append(portions);

    let ingredientTable = $('<table id="ingredientsTable"></table>');
    let tableHead = $(`<thead>
    <tr>
      <th scope="col">Namn</th>
      <th scope="col">Antal</th>
      <th scope="col">Enhet</th>
    </tr>
  </thead>`)
    ingredientTable.append(tableHead);
    let tableBody = $(`<tbody></tbody`)



    data.ingredients.forEach((ingredient) => {
        let ingredientLi = $(`<tr>
        <td>${ingredient.name}</td>
        <td id="measurementCalc">${ingredient.units}</td>
        <td>${ingredient.measuringUnit}</td>
      </tr>`);
        tableBody.append(ingredientLi);
    })
    ingredientTable.append(tableBody);
    display.append(ingredientTable);

    let instructionsOlList = $('<ol></ol>');
    display.append(instructionsOlList);
    data.instructions.forEach((instruction) => {
        let instructionLi = $('<li></li>');
        instructionLi.text(instruction);
        instructionsOlList.append(instructionLi);
    })

    $('#search-result').empty();
    $('section.display').remove();
    $('#search-result').append(display);
    

}
//--------------------
//Calculate portions
//--------------------
$('#search-result').on('change', '#selectPortions', function () {

    let newPortions = $('#selectPortions').val();

    let change = + parseFloat((parseFloat(newPortions) / parseFloat(portionsCalc)));
    portionsCalc = newPortions;
    $('#ingredientsTable tr').each(function () {
        $(this).find('#measurementCalc').each(function () {
            let currentMeasurement = parseFloat($(this).text());
            let newMeasurement = parseFloat((Math.ceil((currentMeasurement * change) * 2) / 2).toFixed(2));
            newMeasurement = newMeasurement.toString();
            $(this).text(newMeasurement.replace((".", ",")));
           
        })

    })
})


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
    function getNutritionData(ingredient){
        
    }
   



    //----------------------------
    //Nutrition
    //---------------------------
    //Display Nutrition

    function findingNutrition(ingredient) {
        ingredient.forEach((ing) => {
            getNutrition(ing);
        }
        )
    }
    function getNutrition(ingredient) {
        $.get('http://localhost:3000/ingredients/' + ingredient.name.replace(/%/g, '_'), (data) => {
    
            nutritionCalculation(data, ingredient);
        });
    }
    
    const findNutrient = nutrientName => (nutrient) => nutrient.Namn.toLowerCase().includes(nutrientName);

    //Calculations for nutritional data

    function nutritionCalculation(nutrition, ingredient) {
        let kolesterol = nutrition.Naringsvarden.Naringsvarde.find(findNutrient("kolesterol"));
        let energi = nutrition.Naringsvarden.Naringsvarde.find(findNutrient("energi"));
        let kolhydrat = nutrition.Naringsvarden.Naringsvarde.find(findNutrient("kolhydrat"));
        let fett = nutrition.Naringsvarden.Naringsvarde.find(findNutrient("fett"));
        let fettMatt = nutrition.Naringsvarden.Naringsvarde.find(findNutrient("summa mättade fettsyror"));
        let fettOmatt = nutrition.Naringsvarden.Naringsvarde.find(findNutrient("summa enkelomättade fettsyror"));
        let fettFlero = nutrition.Naringsvarden.Naringsvarde.find(findNutrient("summa fleromättade fettsyror"));
        let sackaros = nutrition.Naringsvarden.Naringsvarde.find(findNutrient("sackaros"));
        let monoSac = nutrition.Naringsvarden.Naringsvarde.find(findNutrient("monosackarider"));
        let diSac = nutrition.Naringsvarden.Naringsvarde.find(findNutrient("disackarider"));
        let salt = nutrition.Naringsvarden.Naringsvarde.find(findNutrient("salt"));
    
        let multiplyToGetNutrition = parseFloat((ingredient.gramPerPortion / 100).toFixed(2))
        displayFat(fett.Varde, fettMatt.Varde, fettOmatt.Varde, fettFlero.Varde, multiplyToGetNutrition);
        displaySugar(sackaros.Varde, monoSac.Varde, diSac.Varde, multiplyToGetNutrition);
        displayCarbohydrates(kolhydrat.Varde, multiplyToGetNutrition);
        displayCholesterol(kolesterol.Varde, multiplyToGetNutrition);
        displayEnergy(energi.Varde, multiplyToGetNutrition);
        displaySalt(salt.Varde, multiplyToGetNutrition);
    }
    function displaySalt(salt, multiply) {
        prevSumSalt = $('#sumSalt').text();
    
        let sum1 = +((parseFloat(prevSumSalt) + ((parseFloat(salt)) * multiply)).toFixed(2));
        sum1 = sum1.toString();
        $('#sumSalt').text((sum1.replace(".", ",")));
    
    }
    
    function displaySugar(sackaros, monoSac, diSac, multiply) {
        prevSumSackaros = $('#sumSackaros').text();
        prevSumMono = $('#sumMono').text();
        prevSumDi = $('#sumDi').text();
    
        let sum1 = +((parseFloat(prevSumSackaros) + ((parseFloat(sackaros)) * multiply)).toFixed(2));
        sum1 = sum1.toString();
        $('#sumSackaros').text((sum1.replace(".", ",")));
    
        let sum2 = +((parseFloat(prevSumMono) + ((parseFloat(monoSac)) * multiply)).toFixed(2));
        sum2 = sum2.toString();
        $('#sumMono').text((sum2.replace(".", ",")));
    
        let sum3 = +((parseFloat(prevSumDi) + ((parseFloat(diSac)) * multiply)).toFixed(2));
        sum3 = sum3.toString();
        $('#sumDi').text((sum3.replace(".", ",")));
    
    }
    
    function displayFat(fett, fettMatt, fettOmatt, fettFlero, multiply) {
        prevSumFett = $('#sumFett').text();
        prevSumFettMatt = $('#sumMattade').text();
        prevSumFettOmatt = $('#sumEnkel').text();
        prevSumFettFlero = $('#sumFlero').text();
    
        let sum1 = +((parseFloat(prevSumFett) + ((parseFloat(fett)) * multiply)).toFixed(2));
        sum1 = sum1.toString();
        $('#sumFett').text((sum1.replace(".", ",")));
    
        let sum2 = +((parseFloat(prevSumFettMatt) + ((parseFloat(fettMatt)) * multiply)).toFixed(2));
        sum2 = sum2.toString();
        $('#sumMattade').text((sum2.replace(".", ",")));
    
        let sum3 = +((parseFloat(prevSumFettOmatt) + ((parseFloat(fettOmatt)) * multiply)).toFixed(2));
        sum3 = sum3.toString();
        $('#sumEnkel').text((sum3.replace(".", ",")));
    
        let sum4 = +((parseFloat(prevSumFettFlero) + ((parseFloat(fettFlero)) * multiply)).toFixed(2));
        sum4 = sum4.toString();
        $('#sumFlero').text((sum4.replace(".", ",")));
    }
    
    function displayCarbohydrates(carb, multiply) {
    
        prevSum = $('#sumKolhydrat').text();
    
    
        let sum = +((parseFloat(prevSum) + ((parseFloat(carb)) * multiply)).toFixed(2));
    
        sum = sum.toString();
    
        $('#sumKolhydrat').text((sum.replace(".", ",")));
    }
    
    function displayCholesterol(chol, multiply) {
    
        let prevSum = $('#sumKolesterol').text();
    
        let sum = +((parseFloat(prevSum) + ((parseFloat(chol)) * multiply)).toFixed(2));
    
        sum = sum.toString();
        $('#sumKolesterol').text((sum.replace(".", ",")));
    }
    
    function displayEnergy(ener, multiply) {
        let prevSum = $('#sumEnergi').text();
    
        let sum = +((parseFloat(prevSum) + ((parseFloat(ener)) * multiply)).toFixed(2));
    
        sum = sum.toString();
        $('#sumEnergi').text((sum.replace(".", ",")));
    }
    
    function emptyNutrients() {
        $('#sumEnergi').text(0);
        $('#sumKolesterol').text(0);
        $('#sumKolhydrat').text(0);
        $('#sumFett').text(0);
        $('#sumMattade').text(0);
        $('#sumEnkel').text(0);
        $('#sumFlero').text(0);
        $('#sumSackaros').text(0);
        $('#sumMono').text(0);
        $('#sumDi').text(0);
        $('#sumSalt').text(0);
    }

    



