const HttpError = require("../Models/HttpError");
const OpenTable = require("../Models/OpenTable");

const openTable = async (req, res, next) => {
  const { numTable, numberOfPeople, sensitivities, ResturantName } = req.body;
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
  if (!isExist) {
    const error = new HttpError("Table is not available", 500);
    return next(error);
  }

  const openTable = new Dish({
    numTable,
    openTime: new Date(),
    numberOfPeople,
    TotalPrice: 0,
    avgPerPerson: 0,
    dishArray: [],
    sensitivities,
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

const addDishesToTable = async (req, res, next) => {
  const { numTable, numberOfPeople, sensitivities, ResturantName } = req.body;
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
  if (!isExist) {
    const error = new HttpError("Table is not available", 500);
    return next(error);
  }

  const openTable = new Dish({
    numTable,
    openTime: new Date(),
    numberOfPeople,
    TotalPrice: 0,
    avgPerPerson: 0,
    dishArray: [],
    sensitivities,
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

exports.openTable = openTable;
