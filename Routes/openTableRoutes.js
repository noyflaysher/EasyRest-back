const express = require("express");
const openTableCpntroller = require("../Controllers/openTableController");

const router = express.Router();
router.get("/openTable", openTableCpntroller.openTable); //  כל המנות לפי המסעדה
router.post("/addDishesToTable", dishController.addDish); // הוספת מנה
router.post("/getByCategory", dishController.GetDishByCategory); // כל המנות לפי קטגוריה
//router.post("/getBySensitivity"); //  כל המנות לפי הרגושיות

module.exports = router;
