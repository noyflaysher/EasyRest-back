const HttpError = require('../Models/HttpError');
const Drink = require('../Models/Drink');

const addDrink = async (req, res, next) => {
  const {
    drinkName,
    drinkDescription,
    drinkImage,
    possibleChanges,
    drinkPrice,
    ResturantName,
  } = req.body;

  const createdProduct = new Drink({
    drinkName,
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

const getAllDrinks = async (req, res, next) => {
  let drinks;
  try {
    drinks = await Drink.find(
      {},
      'drinkName drinkDescription drinkImage possibleChanges drinkPrice ResturantName'
    );
  } catch (err) {
    return next(
      new HttpError('Fatching products failed, please try again later.', 500)
    );
  }

  res.json({
    products: drinks.map((drink) => drink.toObject({ getters: true })),
  });
};

const getDrinkById = async (req, res, next) => {
  const drinkId = req.params.pid;
  let drink;
  try {
    drink = await Drink.findById(drinkId);
  } catch (err) {
    return next(
      new HttpError('Something went wrong, could not find a product.', 500)
    );
  }

  if (!product) {
    return next(
      new HttpError('Could not find a product for the provided id.', 404)
    );
  }

  res.json({ product: drink.toObject({ getters: true }) });
};

exports.addDrink = addDrink;
exports.getAllDrinks = getAllDrinks;
exports.getDrinkById = getDrinkById;
