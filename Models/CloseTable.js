const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const closeTableSchema = new Schema({
  numTable: { type: Number, require: true },
  openTime: { type: Date, require: true },
  closeTime: { type: Date, require: true },
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
  payment: [
    {
      paymentMethod: { type: String, require: true },
      amountPaid: { type: Number, require: true },
    },
  ],
  gluten: { type: Boolean, require: true },
  lactuse: { type: Boolean, require: true },
  isVagan: { type: Boolean, require: true },
  isVegi: { type: Boolean, require: true },
  others: { type: String, require: true },
  ResturantName: { type: String, require: true },
});

module.exports = mongoose.model("closeTable", closeTableSchema);
