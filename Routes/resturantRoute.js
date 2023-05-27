const express = require("express");
const resturantController = require("../Controllers/resturantController");

const router = express.Router();
router.post("/add", resturantController.AddResturant);
router.post("/getTableAavailable", resturantController.getTable);
router.post("/UpdateEmployees", resturantController.UpdateEmployees);

module.exports = router;
