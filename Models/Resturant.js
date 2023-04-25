const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const resturantScheama = new Schema({
  tableArr: [
    {
      tableNum: { type: Number, require: true },
      available: { type: Boolean, require: true },
    },
  ],
  resturntName: { type: Date, require: true },
  seats: { type: Number, require: true },
  TotalPrice: { type: Number, require: true },
  avgPerPerson: [{ type: Number, require: true }],
  dishArray: [
    {
      dish: { type: mongoose.Types.ObjectId, require: true, ref: "Dishes" },
      amount: { type: Number, require: true },
      price: { type: Number, require: true },
    },
  ],
});

module.exports = mongoose.model("openTable", openTableSchema);
