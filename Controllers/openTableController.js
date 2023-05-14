const HttpError = require("../Models/HttpError");
const OpenTable = require("../Models/OpenTable");
const Dish = require("../Models/Dish");
const Drink = require("../Models/Drink");
const Resturant = require("../Models/Resturant");
/*
  numTable:1
  numberOfPeople:1
  gluten:true
  lactuse:true
  isVagan:true
  isVegi:true
  others:string
  notes:String
  ResturantName:string
*/
const openTable = async (req, res, next) => {
  const {
    numTable,
    numberOfPeople,
    gluten,
    lactuse,
    isVagan,
    isVegi,
    others,
    notes,
    ResturantName,
  } = req.body;
  let isExist;
  try {
    isExist = await OpenTable.find({ numTable: numTable });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find any Dish for this category.",
      500
    );
    return next(error);
  }
  if (isExist.length > 0) {
    const error = new HttpError("Table is not available", 500);
    return next(error);
  }
  let changedAvaTable;
  let validTable = false;
  try {
    changedAvaTable = await Resturant.find({ "tableArr.tableNum": numTable });
    for (let i = 0; i < changedAvaTable[0].tableArr.length; i++) {
      if (changedAvaTable[0].tableArr[i].tableNum == numTable) {
        changedAvaTable[0].tableArr[i].available = false;
        validTable = true;
        break;
      }
    }
  } catch (err) {}

  if (validTable == false) {
    const error = new HttpError("Table is not available", 500);
    return next(error);
  }

  try {
    await changedAvaTable[0].save();
  } catch (err) {
    const error = new HttpError("Somethiing went wrong", 500);
    return next(error);
  }
  const openTable = new OpenTable({
    numTable,
    openTime: new Date(),
    udate: new Date(),
    numberOfPeople,
    TotalPrice: 0,
    avgPerPerson: 0,
    dishArray: [],
    drinkArray: [],
    fire: false,
    gluten,
    lactuse,
    isVagan,
    isVegi,
    others,
    notes,
    askedForwaiter: false,
    ResturantName,
    leftToPay: 0,
  });

  try {
    await openTable.save();
  } catch (err) {
    const error = new HttpError(
      "Creating table failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ Table: openTable.toObject({ getters: true }) });
};
/*
  "tableId":
  "dishArray":[{
      "dishid":"643ef91662cdc37f5379e502" ,
      "amount":1,
      "firstOrMain":"F",
      "changes":[String] array
      "allTogether":true
  }],
  "drinkArray":[{
          "drinkId":"6460cedaf22beb1e5ac0f591" ,
          "amount":4,
          "changes":[]
         }]
*/
const addDishesToTable = async (req, res, next) => {
  const { tableId, dishArray, drinkArray } = req.body;
  let isExist;
  try {
    isExist = await OpenTable.findById(tableId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find any Dish for this category.",
      500
    );
    return next(error);
  }
  if (!isExist) {
    const error = new HttpError("Table is not available", 500);
    return next(error);
  }

  let Totalprice = isExist.TotalPrice;
  let leftPrice = isExist.leftToPay;
  let orderDish = isExist.dishArray;
  let orderDrinks = isExist.drinkArray;
  let dish, dishId;

  for (let i = 0; i < dishArray.length; i++) {
    try {
      dishId = dishArray[i].dishid;
      dish = await Dish.findById(dishId);

      let price = dish.dishPrice * dishArray[i].amount;
      Totalprice += price;
      leftPrice += price;
      orderDish.push({
        dishId: dish,
        amount: dishArray[i].amount,
        firstOrMain: dishArray[i].amount,
        ready: false,
        allTogether: dishArray[i].allTogether,
        changes: dishArray[i].changes,
        price: price,
        orderTime: new Date(),
      });
    } catch (err) {
      const error = new HttpError(
        "Something went wrong, could not find any Dish for this category.",
        500
      );
      return next(error);
    }
  }

  let drink, drinkId;
  for (let i = 0; i < drinkArray.length; i++) {
    try {
      drinkId = drinkArray[i].drinkId;
      drink = await Drink.findById(drinkId);
      let price = drink.drinkPrice * drinkArray[i].amount;
      Totalprice += price;
      leftPrice += price;
      console.log(price);
      orderDrinks.push({
        drinkId: drink,
        amount: drinkArray[i].amount,
        ready: false,
        changes: drinkArray[i].changes,
        price: price,
      });
    } catch (err) {
      const error = new HttpError(
        "Something went wrong, could not find any Drink for this category.",
        500
      );
      return next(error);
    }
  }

  isExist.udate = new Date();
  isExist.dishArray = orderDish;
  isExist.drinkArray = orderDrinks;
  isExist.TotalPrice = Totalprice;
  isExist.leftToPay = leftPrice;
  isExist.avgPerPerson = Totalprice / isExist.numberOfPeople;
  console.log(isExist);
  try {
    await isExist.save();
  } catch (err) {
    const error = new HttpError("update table failed, please try again.", 500);
    return next(error);
  }

  res.status(201).json({ update: isExist.toObject({ getters: true }) });
};
/*
  tableId:
*/
const FireTable = async (req, res, next) => {
  const { tableId } = req.body;
  let isExist;
  try {
    isExist = await OpenTable.findById(tableId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find any table for this id.",
      500
    );
    return next(error);
  }
  if (!isExist) {
    const error = new HttpError("Table is  available", 500);
    return next(error);
  }

  isExist.udate = new Date();
  isExist.fire = true;

  try {
    await isExist.save();
  } catch (err) {
    const error = new HttpError("update table failed, please try again.", 500);
    return next(error);
  }

  res.status(201).json({ update: isExist.toObject({ getters: true }) });
};
/*
  tableId: string
  updates: {
    numTable:1
    numberOfPeople:1
    gluten:true
    lactuse:true
    isVagan:true
    isVegi:true
    others:string
    notes:String
    ResturantName:string
  }
*/
const updateTable = async (req, res, next) => {
  const { tableId, updates } = req.body;

  let existingTable;
  try {
    existingTable = await OpenTable.findById(tableId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find the table.",
      500
    );
    return next(error);
  }

  if (!existingTable) {
    const error = new HttpError("Table not found.", 404);
    return next(error);
  }

  for (const key in updates) {
    if (updates.hasOwnProperty(key)) {
      existingTable[key] = updates[key];
    }
  }

  try {
    await existingTable.save();
  } catch (err) {
    const error = new HttpError(
      "Updating the table failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(200).json({
    message: "Table updated successfully.",
    table: existingTable.toObject({ getters: true }),
  });
};

const GetAllTables = async (req, res, next) => {
  let tables;
  try {
    tables = await OpenTable.find({});
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find any table.",
      500
    );
    return next(error);
  }
  res.json(tables);
};

const AskedForwaiter = async (req, res, next) => {
  const { tableId } = req.body;
  let isExist;
  try {
    isExist = await OpenTable.findById(tableId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find any table for this id.",
      500
    );
    return next(error);
  }
  if (!isExist) {
    const error = new HttpError("Table is  available", 500);
    return next(error);
  }

  isExist.udate = new Date();
  isExist.askedForwaiter = true;

  try {
    await isExist.save();
  } catch (err) {
    const error = new HttpError("update table failed, please try again.", 500);
    return next(error);
  }

  setTimeout(async () => {
    isExist.askedForwaiter = false;
    try {
      await isExist.save();
    } catch (err) {
      const error = new HttpError(
        "update table failed, please try again.",
        500
      );
      return next(error);
    }
  }, 10000);

  res.status(201).json({ update: isExist.toObject({ getters: true }) });
};

exports.openTable = openTable;
exports.addDishesToTable = addDishesToTable;
exports.FireTable = FireTable;
exports.updateTable = updateTable;
exports.GetAllTables = GetAllTables;
exports.AskedForwaiter = AskedForwaiter;
