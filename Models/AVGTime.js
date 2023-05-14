const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AvgTime = new Schema({
  dishId: { type: mongoose.Types.ObjectId, require: true, ref: "Dishes" },
  amount: { type: Number, require: true },
  prepBar: { type: String, require: true },
  numOfKitchenEmployees: { type: Number, require: true },
  PercentagePeople: { type: Number, require: true },
  dishesBefore: { type: Number, require: true },
  AvgLastTimes: { type: Number, require: true },
  AvgDiffLastTimes: { type: Number, require: true },
  ErrorPercentageLastTimes: { type: Number, require: true },
});

module.exports = mongoose.model("AvgTime", AvgTime);
