const HttpError = require("../Models/HttpError");
const Dish = require("../Models/Dish");

const addDish = async (req, res, next) => {
  const {
    dishName,
    dishCategory,
    dishDescription,
    dishImage,
    possibleChanges,
    prepBar,
    estimatedPrepTimeRegular,
    estimatedPrepTimeDuringRushHour,
    isGlutenFree,
    isVegan,
    isVegetarian,
    isLactoseFree,
    dishPrice,
    ResturantName,
  } = req.body;

  const createdProduct = new Dish({
    dishName,
    dishCategory,
    dishDescription,
    dishImage,
    possibleChanges,
    prepBar,
    estimatedPrepTimeRegular,
    estimatedPrepTimeDuringRushHour,
    isGlutenFree,
    isVegan,
    isVegetarian,
    isLactoseFree,
    dishPrice,
    ResturantName,
  });

  try {
    console.log(createdProduct);
    await createdProduct.save();
  } catch (err) {
    const error = new HttpError(
      "Creating Product failed, please try again. 111",
      500
    );
    return next(error);
  }

  res.status(201).json({ product: createdProduct.toObject({ getters: true }) });
  /*
  const {
    dishName,
    // dishCategory,
    // dishDescription,
    // dishImage,
    // possibleChanges,
    // prepBar,
    // estimatedPrepTimeRegular,
    // estimatedPrepTimeDuringRushHour,
    // isGlutenFree,
    // isVegan,
    // isVegetarian,
    // isLactoseFree,
    // dishPrice,
    // ResturantName,
  } = req.body;

  const createdDish = new Dish({
    dishName,
    // dishCategory,
    // dishDescription,
    // dishImage,
    // possibleChanges,
    // prepBar,
    // estimatedPrepTimeRegular,
    // estimatedPrepTimeDuringRushHour,
    // isGlutenFree,
    // isVegan,
    // isVegetarian,
    // isLactoseFree,
    // dishPrice,
    // ResturantName,
  });
  console.log(createdDish);
  try {
    await createdDish.save();
  } catch (err) {
    const error = new HttpError(
      "Creating Product failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ dish: createdDish.toObject({ getters: true }) });
  */
};

const GetDishByCategory = async (req, res, next) => {
  const { dishCategory } = req.body;
  let DishArr;
  try {
    DishArr = await Dish.find({ dishCategory: dishCategory });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find any Dish for this category.",
      500
    );
    return next(error);
  }
  res.json(DishArr);
};

const GetCategoryList = async (req, res, next) => {
  let categoryArr;
  try {
    categoryArr = await Dish.distinct("dishCategory");
    // categoryArr = await categoryArr.distinct(dishCategory);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not get category.",
      500
    );
    return next(error);
  }
  res.json(categoryArr);
};

exports.addDish = addDish;
exports.GetDishByCategory = GetDishByCategory;
exports.GetCategoryList = GetCategoryList;
