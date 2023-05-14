const express = require("express");
const closeTableController = require("../Controllers/closeTableController");

const router = express.Router();

router.post("/payment", closeTableController.payment);
router.get("/getCloseTables", closeTableController.GetAllCloseTables);

module.exports = router;
