const HttpError = require("../Models/HttpError");
const OpenTable = require("../Models/OpenTable");
const Dish = require("../Models/Dish");
const Drink = require("../Models/Drink");
const Resturant = require("../Models/Resturant");
const OnProcess = require("../Models/DishOnProcess");
const AVGTime = require("../Models/AVGTime");
const AllPreperationTime = require("../Models/AllPreperationTime");
const AVGTime = require("../Models/AVGTime");

// help function
const checkAmount = (numberOfPeople) => {
  if (numberOfPeople >= 0 && numberOfPeople < 0.25) {
    peoplePer = 1;
  }
  if (numberOfPeople >= 0.25 && numberOfPeople < 0.5) {
    peoplePer = 2;
  }
  if (numberOfPeople >= 0.5 && numberOfPeople < 0.75) {
    peoplePer = 3;
  }
  if (numberOfPeople >= 0.75 && numberOfPeople <= 1) {
    peoplePer = 4;
  }
  return peoplePer;
};
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
    changedAvaTable[0].dinersAmount += numberOfPeople;
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
    askedForBill: false,
    ResturantName,
    leftToPay: 0,
    payment: [],
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
      "firstOrMain":"F" / "M",
      "changes":[String] array
      "allTogether":true/false
  }],
  "drinkArray":[{
          "drinkId":"6460cedaf22beb1e5ac0f591" ,
          "amount":4,
          "changes":[string] array
         }]
*/
const addDishesToTable = async (req, res, next) => {
  const { tableId, dishArray, drinkArray } = req.body;
  let isExist;
  // check if table exists
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
  let numTable = isExist.numTable;
  let dish,
    dishId,
    dishOnline,
    onprocess,
    peoplePer,
    numberOfPeople,
    drink,
    prepBar,
    estimatedPrepTimeOBJ,
    estimatedTime,
    drinkId;
  // check guest amount

  let changedAvaTable;
  try {
    changedAvaTable = await Resturant.find({ "tableArr.tableNum": numTable });
    //אחוז היושבים במסעדה
    numberOfPeople = changedAvaTable[0].dinersAmount / changedAvaTable[0].seats;
    // add employees
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find any resturant.",
      500
    );
    return next(error);
  }
  peoplePer = checkAmount(numberOfPeople);

  // create the dish array with all the detailes
  for (let i = 0; i < dishArray.length; i++) {
    try {
      // app id
      dishId = dishArray[i].dishid;
      // web id
      if (dishId.length === undefined) {
        dishId = dishArray[i].id;
      }
      dish = await Dish.findById(dishId);
      // check how much dishes is on process.
      prepBar = dish.prepBar;
      onprocess = await OnProcess.find({ prepBar: prepBar });
      if (onprocess == undefined) dishOnline = 0;
      else dishOnline = onprocess.length;

      let price = dish.dishPrice * dishArray[i].amount; // dish price
      Totalprice += price; // add to total price (order)
      leftPrice += price; // add to left to pay

      estimatedPrepTimeOBJ = await AVGTime.find({
        dishId: dish,
        amount: dishArray[i].amount,
        prepBar: prepBar,
        numOfKitchenEmployees: 0,
        PercentagePeople: peoplePer,
        dishesBefore: dishOnline,
      });

      if (estimatedPrepTimeOBJ == undefined) {
        if (peoplePer == 3 || peoplePer == 4)
          estimatedTime = dish.estimatedPrepTimeDuringRushHour;
        else estimatedTime = dish.estimatedPrepTimeRegular;
      } else {
        estimatedTime =
          estimatedPrepTimeOBJ.AvgLastTimes *
          (1 - estimatedPrepTimeOBJ.ErrorPercentageLastTimes);
      }

      orderDish.push({
        dishId: dish,
        amount: dishArray[i].amount,
        firstOrMain: dishArray[i].firstOrMain,
        ready: false,
        allTogether: dishArray[i].allTogether,
        changes: dishArray[i].changes,
        price: price,
        orderTime: new Date(),
        dishOnline: dishOnline,
        estimatedPrepTime: estimatedTime,
      });
    } catch (err) {
      const error = new HttpError(
        "Something went wrong, could not find any Dish for this category.",
        500
      );
      return next(error);
    }
  }
  // drinks
  for (let i = 0; i < drinkArray.length; i++) {
    try {
      drinkId = drinkArray[i].drinkId;
      if (drinkId.length === undefined) {
        drinkId = drinkArray[i].id;
      }
      drink = await Drink.findById(drinkId);
      let price = drink.drinkPrice * drinkArray[i].amount;
      Totalprice += price;
      leftPrice += price;
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

  try {
    await isExist.save();
  } catch (err) {
    const error = new HttpError("update table failed, please try again.", 500);
    return next(error);
  }

  for (let i = 0; i < isExist.dishArray.length; i++) {
    if (
      (isExist.dishArray[i].firstOrMain =
        "F" && isExist.dishArray[i].ready == false)
    ) {
      let orderID = isExist.dishArray[i]._id.toString();
      let check;
      try {
        check = await OnProcess.find({ orderId: orderID });
      } catch (err) {}
      if (check.length == 0) {
        const onProcess = new OnProcess({
          orderId: orderID,
          dishId: isExist.dishArray[i].dishId,
          estimatedTime: isExist.dishArray[i].estimatedPrepTime,
          orderTime: isExist.dishArray[i].orderTime,
          readyTime: null,
          beginInline: isExist.dishArray[i].dishOnline,
          amount: isExist.dishArray[i].amount,
          Rest: isExist.ResturantName,
          prepBar: prepBar,
          PerOfPeople: peoplePer,
          numOfKitchenEmployees: 0, // change !!!
        });
        try {
          await onProcess.save();
        } catch (err) {}
      }
    }
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

  res.status(201).json({ fire: isExist.toObject({ getters: true }) });
};
/*
u can send all of this or part of this:
  tableId: 643ef91662cdc37f5379e502
  Table: {
    numberOfPeople:1
    TotalPrice:number
    avgPerPerson: number
    dishArray:[]
    drinkArray:[]
    fire: boolean
    gluten:true
    lactuse:true
    isVagan:true
    isVegi:true
    others:string
    notes:String
    ResturantName:string
    leftToPay: number
    payment:[]
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
// get
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
/* 
{
  tableId: 
}
*/
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
    } catch (err) {}
  }, 3000);

  res.status(201).json({ update: isExist.toObject({ getters: true }) });
};
/* 
{
  tableId: 
}
*/
const AskedForBill = async (req, res, next) => {
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
  isExist.askedForBill = true;

  try {
    await isExist.save();
  } catch (err) {
    const error = new HttpError("update table failed, please try again.", 500);
    return next(error);
  }

  res.status(201).json({ update: isExist.toObject({ getters: true }) });
};

// remove all dishOnProcess
const RemoveAll = async (req, res, next) => {
  let dishArray;
  try {
    dishArray = await OnProcess.find({});
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find any table.",
      500
    );
    return next(error);
  }
  try {
    for (let i = 0; i < dishArray.length; i++) await dishArray[i].remove();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not remove dishOnProcess.",
      500
    );
    return next(error);
  }

  res.json({ remove });
};
/*{orderId: STRING} */

const DishIsReady = async (req, res, next) => {
  const { orderId } = req.body;
  let isExists;
  try {
    isExists = await OnProcess.find({ orderId: orderId });
  } catch (err) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }
  if ((isExists.length = 0)) {
    const error = new HttpError("order doesnt exists", 500);
    return next(error);
  }

  const AllPrepDishTime = new AllPreperationTime({
    dishId: isExists.dishId,
    amount: isExists.amount,
    prepBar: isExists.prepBar,
    numOfKitchenEmployees: isExists.numOfKitchenEmployees,
    PercentageOfTotal: isExists.PerOfPeople,
    dishesBefore: isExists.beginInline,
    estTimeMinute: isExists.estimatedTime,
    realTimeMinutes: Number(orderTime - Date()), // chech
    ErrorPercentage:
      (isExists.estimatedTime - Number(orderTime - Date())) /
      isExists.estimatedTime,
  });
  // add to AllPreptome
  try {
    await AllPrepDishTime.save();
  } catch (err) {
    const error = new HttpError("Something went wrong add all dishes", 500);
    return next(error);
  }
  // remove from dish on process
  try {
    await isExists.remove();
  } catch (err) {
    const error = new HttpError("Something went wrong remove onprocess", 500);
    return next(error);
  }
  // add to avg
  // get all match dish & amount & number employes & number of people & dish before
  // do avg to real time
  // do avg to the mistake
  // i dont know how to calc the Error Percentage
  // if there are no dishes that match, add this detailes.

  let avg;
  try {
    avg = await AVGTime.find({
      dishId: AllPrepDishTime.dishId,
      amount: AllPrepDishTime.amount,
      prepBar: AllPrepDishTime.prepBar,
      numOfKitchenEmployees: AllPrepDishTime.numOfKitchenEmployees,
      PercentagePeople: AllPrepDishTime.PercentageOfTotal,
      dishesBefore: AllPrepDishTime.dishesBefore,
    });
  } catch (err) {}

  if (avg == undefined) {
    const AVGTimeDish = new AVGTime({
      dishId: isExists.dishId,
      amount: isExists.amount,
      prepBar: isExists.prepBar,
      numOfKitchenEmployees: isExists.numOfKitchenEmployees,
      PercentageOfTotal: isExists.PerOfPeople,
      dishesBefore: isExists.beginInline,
      AvgLastTimes: isExists.estimatedTime,
      realTimeMinutes: AllPrepDishTime.realTimeMinutes,
      AvgDiffLastTimes: ABS(
        AllPrepDishTime.realTimeMinutes - AllPrepDishTime.estTimeMinute
      ),
      ErrorPercentageLastTimes: AllPrepDishTime.ErrorPercentage,
    });
    await AVGTimeDish.save();
  } else {
  }
  res
    .status(201)
    .json({ AllPrepDishTime: AllPrepDishTime.toObject({ getters: true }) });
};

exports.openTable = openTable;
exports.addDishesToTable = addDishesToTable;
exports.FireTable = FireTable;
exports.updateTable = updateTable;
exports.GetAllTables = GetAllTables;
exports.AskedForwaiter = AskedForwaiter;
exports.AskedForBill = AskedForBill;
exports.RemoveAll = RemoveAll;
