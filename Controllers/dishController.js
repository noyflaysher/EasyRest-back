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
    orderAmount: 0,
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
};

const GetDishByCategory = async (req, res, next) => {
  const { dishCategory } = req.body;
  let DishArr;
  try {
    DishArr = await Dish.find({
      dishCategory: dishCategory,
    });
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
  try {
    categoryArr = await Dish.distinct("dishCategory");
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
