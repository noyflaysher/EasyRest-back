const HttpError = require('../Models/HttpError');
const Drink = require('../Models/Drink');

const addDrink = async (req, res, next) => {
  const {
    drinkName,
    drinkCategory,
    drinkDescription,
    drinkImage,
    possibleChanges,
    drinkPrice,
    ResturantName,
  } = req.body;

  const createdProduct = new Drink({
    drinkName,
    drinkCategory,
    drinkDescription,
    drinkImage,
    possibleChanges,
    drinkPrice,
    ResturantName,
  });

  try {
    console.log(createdProduct);
    await createdProduct.save();
  } catch (err) {
    const error = new HttpError(
      'Creating Product failed, please try again. 111',
      500
    );
    return next(error);
  }

  res.status(201).json({ product: createdProduct.toObject({ getters: true }) });
};

const getDrinkByCategory = async (req, res, next) => {
    const { drinkCategory } = req.body;
    let DrinkArr;
    try {
        DrinkArr = await Drink.find({
            drinkCategory: drinkCategory,
      });
    } catch (err) {
      const error = new HttpError(
        "Something went wrong, could not find any Dish for this category.",
        500
      );
      return next(error);
    }
    res.json(DrinkArr);
  };
  
  const getCategoryList = async (req, res, next) => {
    try {
      categoryArr = await Drink.distinct("drinkCategory");
    } catch (err) {
      const error = new HttpError(
        "Something went wrong, could not get category.",
        500
      );
      return next(error);
    }
    res.json(categoryArr);
  };

exports.addDrink = addDrink;
exports.getDrinkByCategory = getDrinkByCategory;
exports.getCategoryList = getCategoryList;
