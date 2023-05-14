const HttpError = require('../Models/HttpError');
const Resturant = require('../Models/Resturant');

const AddResturant = async (req, res, next) => {
  const { tableArr, resturntName, seats } = req.body;
  const Res = new Resturant({
    tableArr,
    resturntName,
    seats,
  });
  try {
    await Res.save();
  } catch (err) {
    const error = new HttpError('Creating res failed, please try again.', 500);
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
      'Something went wrong, could not find any res ',
      500
    );
    return next(error);
  }
  if (!isExist) {
    const error = new HttpError('res is not exist', 500);
    return next(error);
  }
  let tables = isExist.tableArr;
  res.status(201).json([tables]);
};

exports.AddResturant = AddResturant;
exports.getTable = getTable;
