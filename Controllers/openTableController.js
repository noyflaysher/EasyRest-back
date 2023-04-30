const HttpError = require("../Models/HttpError");
const OpenTable = require("../Models/OpenTable");
const Dish = require("../Models/Dish");

/*
  numTable:1
  numberOfPeople:1
  gluten:true
  lactuse:true
  isVagan:true
  isVegi:true
  others:string
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

  const openTable = new OpenTable({
    numTable,
    openTime: new Date(),
    udate: new Date(),
    numberOfPeople,
    TotalPrice: 0,
    avgPerPerson: 0,
    dishArray: [],
    fire: false,
    gluten,
    lactuse,
    isVagan,
    isVegi,
    others,
    askedForwaiter: false,
    ResturantName,
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
  tableId:
  dishArray:[{
      "dishid":"643ef91662cdc37f5379e502" ,
      "amount":1,
      "firstOrMain":"F",
      "allTogether":true
  }]
*/
const addDishesToTable = async (req, res, next) => {
  const { tableId, dishArray } = req.body;
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

  let Totalprice = 0;
  let orderDish = [];
  let dish, dishId;
  //  let dishArray = JSON.stringify(dishArray_);
  for (let i = 0; i < dishArray.length; i++) {
    try {
      dishId = dishArray[i].dishid;
      console.log(dishId);
      dish = await Dish.findById(dishId);
      console.log(dish);
      let price = dish.dishPrice * dishArray[i].amount;
      Totalprice += price;
      orderDish.push({
        dishId: dish,
        amount: dishArray[i].amount,
        firstOrMain: dishArray[i].amount,
        ready: false,
        allTogether: dishArray[i].allTogether,
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

  isExist.udate = new Date();
  isExist.dishArray = orderDish;
  isExist.TotalPrice = Totalprice;
  isExist.avgPerPerson = Totalprice / isExist.numberOfPeople;

  try {
    await isExist.save();
  } catch (err) {
    const error = new HttpError("update table failed, please try again.", 500);
    return next(error);
  }

  res.status(201).json({ update: isExist.toObject({ getters: true }) });
};

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

exports.openTable = openTable;
exports.addDishesToTable = addDishesToTable;
exports.FireTable = FireTable;
