const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const closeTableSchema = new Schema({
  numTable: { type: Number, require: true },
  openTime: { type: Date, require: true },
  CloseTime: { type: Date, require: true },
  numberOfPeople: { type: Number, require: true },
  TotalPrice: { type: Number, require: true },
  pTip: { type: Number, require: true },
  avgPerPerson: { type: Number, require: true },
  dishArray: [
    {
      dishId: { type: mongoose.Types.ObjectId, require: true, ref: "Dishes" },
      amount: { type: Number, require: true },
      firstOrMain: { type: String, require: true },
      ready: { type: Boolean, require: true },
      readyTime: { type: Date, require: false, default: null },
      allTogether: { type: Boolean, require: true },
      price: { type: Number, require: true },
      orderTime: { type: Date, require: true },
    },
  ],
  payment: [{ type: String, require: true }],
  notes: { type: String, require: true },
});

module.exports = mongoose.model("openTable", closeTableSchema);
