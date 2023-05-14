const express = require("express");
const openTableController = require("../Controllers/openTableController");

const router = express.Router();
router.post("/open", openTableController.openTable);
router.post("/addToOrder", openTableController.addDishesToTable);
router.post("/fire", openTableController.FireTable);
router.post("/AskedForwaiter", openTableController.AskedForwaiter);
router.get("/getTables", openTableController.GetAllTables);

module.exports = router;
