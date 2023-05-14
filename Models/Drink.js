const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DrinkSchema = new Schema({
  drinkName: { type: String, require: true }, // שם המשקה
  drinkCategory: { type: String, require: true }, // קטגוריה
  drinkDescription: { type: String, require: true }, // תיאור
  drinkImage: { type: String, require: true }, // תמונה
  possibleChanges: [{ type: String, require: true }], // שינויים אפשריים בשתיה
  drinkPrice: { type: Number, require: true },
  ResturantName: { type: String, require: true },
});

module.exports = mongoose.model("Drinks", DrinkSchema);

/*
,
    "drinkName": "Cola",
    "drinkCategory": "soft drink",
    "dishDescription":"CocaCola.",
    "drinkImage":"https://alcohol123.co.il/wp-content/uploads/2020/03/%D7%A7%D7%95%D7%9C%D7%94-%D7%A8%D7%92%D7%99%D7%9C%D7%94-3%D7%96%D7%9B%D7%95%D7%9B%D7%99%D7%AA.jpg",
    "possibleChanges":[],
    "drinkPrice": 13,
    "ResturantName": "MyRest"
    */
