const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const resturantScheama = new Schema({
  tableArr: [
    {
      tableNum: { type: Number, require: true },
      available: { type: Boolean, require: true },
    },
  ],
  resturntName: { type: String, require: true },
  seats: { type: Number, require: true },
  dinersAmount: { type: Number, require: true },
  KitchenEmplyees: { type: Number, require: true },
});

module.exports = mongoose.model("Res", resturantScheama);
