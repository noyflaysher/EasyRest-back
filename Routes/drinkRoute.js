const express = require("express");
const drinkController = require("../Controllers/drinkController");

const router = express.Router();
router.get("/categoryList", drinkController.getCategoryList);
router.post("/addDrink", drinkController.addDrink); // add drink
router.post("/getByCategory", drinkController.getDrinkByCategory); // get by category

module.exports = router;
