const express = require("express");
const dishController = require("../Controllers/dishController");

const router = express.Router();
//router.get("/addDish/:restName"); //  כל המנות לפי המסעדה
router.post("/addDish", dishController.addDish); // הוספת מנה
//router.post("/getByCategory"); // כל המנות לפי קטגוריה
//router.post("/getBySensitivity"); //  כל המנות לפי הרגושיות

module.exports = router;
