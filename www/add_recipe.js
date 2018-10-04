let recipeName;
let recipePeople;
let category;
let instructionArray = [];
let ingredientArray = [];
let imageUrl;
let recipeNew;

//---------------------------
//Functions for buttons
//----------------------------


//-----------------
//Category
//------------------
$('#category-form').submit((event) => {
    event.preventDefault();
})
$('#add_category').on('click', () => {
    console.log('CLICKED');

    let categoryForm = $('#category-form').serialize();

    $.post('http://localhost:3000/add-category', categoryForm)
        .done(function (data) {

            $('.clear-input').val('');
            $('#recipe-category').prop('selectedIndex', 0);
            $('#preview-category').empty()
            if (data) {
                $('#preview-category').append($('<p>' + data + '</p>'));
            }
        });
})