const HttpError = require("../Models/HttpError");
const Resturant = require("../Models/Resturant");

const AddResturant = async (req, res, next) => {
  const { tableArr, resturntName, seats, KitchenEmplyees } = req.body;
  const Res = new Resturant({
    tableArr,
    resturntName,
    seats,
    dinersAmount: 0,
    KitchenEmplyees,
  });
  try {
    await Res.save();
  } catch (err) {
    const error = new HttpError("Creating res failed, please try again.", 500);
    return next(error);
  }
  res.status(201).json({ Resturant: Res.toObject({ getters: true }) });
};

const getTable = async (req, res, next) => {
  const { resID } = req.body;
  let isExist;
  try {
    isExist = await Resturant.findById(resID);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find any res ",
      500
    );
    return next(error);
  }
  if (!isExist) {
    const error = new HttpError("res is not exist", 500);
    return next(error);
  }
  let tables = isExist.tableArr;
  res.status(201).json({ tables });
};
/*
{
  resID:
  KitchenEmplyees: number
}
*/
const UpdateEmployees = async (req, res, next) => {
  const { resID, KitchenEmplyees } = req.body;
  let isExist;
  try {
    isExist = await Resturant.findById(resID);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find any res ",
      500
    );
    return next(error);
  }
  if (!isExist) {
    const error = new HttpError("res is not exist", 500);
    return next(error);
  }
  isExist.KitchenEmplyees = KitchenEmplyees;
  try {
    await isExist.save();
  } catch (err) {}

  res.status(201).json({ KitchenEmplyees: KitchenEmplyees });
};
exports.AddResturant = AddResturant;
exports.getTable = getTable;
exports.UpdateEmployees = UpdateEmployees;
