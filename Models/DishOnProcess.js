const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const dishOnProcess = new Schema({
  orderId: { type: String, require: true },
  dishId: { type: mongoose.Types.ObjectId, require: true, ref: "Dishes" },
  estimatedTime: { type: Number, require: true },
  orderTime: { type: Date, require: true },
  readyTime: { type: Date, require: true },
  beginInline: { type: Number, require: true },
  amount: { type: Number, require: true },
  Rest: { type: String, require: true },
  prepBar: { type: String, require: true },
  PerOfPeople: { type: Number, require: true },
  numOfKitchenEmployees: { type: Number, require: true },
});

module.exports = mongoose.model("onProcess", dishOnProcess);
