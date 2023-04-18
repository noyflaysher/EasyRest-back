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

exports.addDish = addDish;
