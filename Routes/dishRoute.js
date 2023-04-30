const express = require("express");
const dishController = require("../Controllers/dishController");

const router = express.Router();
router.get("/categoryList", dishController.GetCategoryList);
router.post("/addDish", dishController.addDish); // הוספת מנה
router.post("/getByCategory", dishController.GetDishByCategory); // כל המנות לפי קטגוריה
//router.post("/getBySensitivity"); //  כל המנות לפי הרגושיות

module.exports = router;
