const express = require("express");
const openTableCpntroller = require("../Controllers/openTableController");

const router = express.Router();
router.get("/categoryList", dishController.GetCategoryList); //  כל המנות לפי המסעדה
router.post("/addDish", dishController.addDish); // הוספת מנה
router.post("/getByCategory", dishController.GetDishByCategory); // כל המנות לפי קטגוריה
//router.post("/getBySensitivity"); //  כל המנות לפי הרגושיות

module.exports = router;
