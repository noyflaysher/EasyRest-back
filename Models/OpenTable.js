const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const openTableSchema = new Schema({
  numTable: { type: Number, require: true },
  openTime: { type: Date, require: true },
  udate: { type: Date, require: true },
  numberOfPeople: { type: Number, require: true },
  TotalPrice: { type: Number, require: true },
  avgPerPerson: { type: Number, require: true },
  dishArray: [
    {
      dishId: { type: mongoose.Types.ObjectId, require: true, ref: "Dishes" },
      amount: { type: Number, require: true },
      firstOrMain: { type: String, require: true },
      changes: [{ type: String, require: true }],
      ready: { type: Boolean, require: true },
      readyTime: { type: Date, require: false, default: null },
      allTogether: { type: Boolean, require: true },
      price: { type: Number, require: true },
      orderTime: { type: Date, require: true },
    },
  ],
  drinkArray: [
    {
      drinkId: { type: mongoose.Types.ObjectId, require: true, ref: "Drinks" },
      amount: { type: Number, require: true },
      changes: [{ type: String, require: true }],
      ready: { type: Boolean, require: true },
      price: { type: Number, require: true },
    },
  ],
  fire: { type: Boolean, require: true },
  gluten: { type: Boolean, require: true },
  lactuse: { type: Boolean, require: true },
  isVagan: { type: Boolean, require: true },
  isVegi: { type: Boolean, require: true },
  others: { type: String, require: true },
  notes: { type: String, require: true },
  askedForwaiter: { type: Boolean, require: true },
  ResturantName: { type: String, require: true },
  leftToPay: { type: Number, require: true },
  payment: [
    {
      paymentMethod: { type: String, require: true },
      amountPaid: { type: Number, require: true },
    },
  ],
});

module.exports = mongoose.model("openTable", openTableSchema);
