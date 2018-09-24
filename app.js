// Require the express module
const express = require('express');

// Create a new web server
const app = express();

// Tell the web server to serve files
// from the www folder
app.use(express.static('www'));

// Important: Tell the web server to accept
// post and puts with a JSON body
app.use(express.json({extended: false}));

// Start the web server on port 3000
app.listen(3000,() => console.log('Listening on port 3000'));

// Require the Ingredient class
const Ingredient = require('./classes/ingredient.class');

// Require the livsmedelsdata
let ingredients = require('./json/livsmedelsdata.json');
// "Classify" all items as instances of Ingredient
ingredients = ingredients.map(obj => new Ingredient(obj));

// To think about:
// Ingredients from livsmedelsdata are probably
// not the same as ingredients within a recipe...
// maybe we should name the class(es) differently,
// when/if we eventually create a class for ingredients
// in a recipe???

// Require the Routes class - that sets all 
// REST-like routes
let Routes = require('./classes/routes.class');
new Routes(app, ingredients);