const express = require("express");
const openTableController = require("../Controllers/openTableController");

const router = express.Router();
router.post("/open", openTableController.openTable);
router.post("/addToOrder", openTableController.addDishesToTable);
router.post("/fire", openTableController.FireTable);
router.patch("/updateTable", openTableController.updateTable);
router.post("/AskedForwaiter", openTableController.AskedForwaiter);
router.get("/getTables", openTableController.GetAllTables);
router.post("/AskedForBill", openTableController.AskedForBill);
router.get("/RemoveDishOnProcess", openTableController.RemoveAll);

module.exports = router;
