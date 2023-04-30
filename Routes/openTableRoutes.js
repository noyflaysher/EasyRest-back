const express = require("express");
const openTableCpntroller = require("../Controllers/openTableController");

const router = express.Router();
router.post("/open", openTableCpntroller.openTable);
router.post("/addToOrder", openTableCpntroller.addDishesToTable);

module.exports = router;
