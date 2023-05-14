const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DishSchema = new Schema({
  dishName: { type: String, require: true }, // שם מנה
  dishCategory: { type: String, require: true }, //קטגוריית המנה
  dishDescription: { type: String, require: true }, // תיאור
  dishImage: { type: String, require: true }, // תמונה
  possibleChanges: [{ type: String, require: true }], // שינויים אפשריים ממנה
  prepBar: { type: String, require: true }, // פס הכנה במטבח
  estimatedPrepTimeRegular: { type: Number, require: true }, // זמן משוער לא בעומס
  estimatedPrepTimeDuringRushHour: { type: Number, require: true }, // זמן משוער בעומס
  isGlutenFree: { type: Boolean, default: false },
  isVegan: { type: Boolean, default: false },
  isVegetarian: { type: Boolean, default: false },
  isLactoseFree: { type: Boolean, default: false },
  dishPrice: { type: Number, require: true },
  ResturantName: { type: String, require: true },
  orderAmount: { type: Number, require: true },
});

module.exports = mongoose.model("Dishes", DishSchema);

/*
,
    "dishCategory":"starter",
    "dishDescription":"Locally prepared onion soup. rich in flavors.",
    "dishImage":"https://img.mako.co.il/2016/01/24/shutterstoc_c.jpg",
    "possibleChanges":["No croutons - no gluten","No cheese- lactose free, vegan"],
    "prepBar":"Checker",
    "estimatedPrepTimeRegular":5,
    "estimatedPrepTimeDuringRushHour":10,
    "isGlutenFree":true,
    "isVegan":true,
    "isVegetarian":true,
    "isLactoseFree":true,
    "dishPrice": 59,
    "ResturantName": "MyRest"
    */
