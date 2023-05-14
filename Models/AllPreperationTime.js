const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AllPrepTime = new Schema({
  dishId: { type: mongoose.Types.ObjectId, require: true, ref: "Dishes" },
  amount: { type: Number, require: true },
  prepBar: { type: String, require: true },
  numOfKitchenEmployees: { type: Number, require: true },
  numOfPeople: { type: Number, require: true },
  PercentageOfTotal: { type: Number, require: true },
  dishesBefore: { type: Number, require: true },
  estTimeMinute: { type: Number, require: true },
  realTimeMinutes: { type: Number, require: true },
  ErrorPercentage: { type: Number, require: true },
});

module.exports = mongoose.model("AllPrepTime", AllPrepTime);
