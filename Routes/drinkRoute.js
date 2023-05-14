const express = require('express');
const drinkController = require('../Controllers/drinkController');

const router = express.Router();
router.get('/getDrinks', drinkController.getAllDrinks);
router.post('/addDrink', drinkController.addDrink); // add drink
router.get('/getById', drinkController.getDrinkById); // get by id

module.exports = router;
