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
      dish: { type: mongoose.Types.ObjectId, require: true, ref: "Dishes" },
      amount: { type: Number, require: true },
      price: { type: Number, require: true },
    },
  ],
  payment: [{ type: String, require: true }],
});

module.exports = mongoose.model("openTable", closeTableSchema);
