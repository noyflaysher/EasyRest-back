const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const openTableSchema = new Schema({
  numTable: { type: Number, require: true },
  openTime: { type: Date, require: true },
  numberOfPeople: { type: Number, require: true },
  TotalPrice: { type: Number, require: true },
  avgPerPerson: [{ type: Number, require: true }],
  dishArray: [
    {
      dish: { type: mongoose.Types.ObjectId, require: true, ref: "Dishes" },
      amount: { type: Number, require: true },
      price: { type: Number, require: true },
    },
  ],
  sensitivities: [{ type: String, require: true }],
  askedForwaiter: { type: Boolean, require: true },
  ResturantName: { type: String, require: true },
});

module.exports = mongoose.model("openTable", openTableSchema);
