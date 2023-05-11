const HttpError = require("../Models/HttpError");
const CloseTable = require("../Models/CloseTable");
const OpenTable = require("../Models/OpenTable");
/* 
tableId:  id 
payment:[{
    paymentMethod: String (Card, Cash)
    amountPaid: number
}],
pTip: number  כמה אחוז הטיפ 
*/
const payment = async (req, res, next) => {
  const { tableId, payment, pTip } = req.body;
  let opentbl;
  try {
    opentbl = await OpenTable.findById(tableId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find any table.",
      500
    );
    return next(error);
  }
  if ((opentbl.length = 0)) {
    const error = new HttpError("Table is not exist", 500);
    return next(error);
  }
  let paid = 0;
  for (let i = 0; i < payment.length; i++) {
    paid += payment[i].amountPaid;
  }

  if (paid < opentbl.leftToPay) {
    opentbl.leftToPay -= paid;
    try {
      await opentbl.save();
      res.status(201).json({ Table: opentbl.toObject({ getters: true }) });
    } catch (err) {}
  }
  let isExist = opentbl;

  const closeTable = new CloseTable({
    numTable: isExist.numTable,
    openTime: isExist.openTime,
    closeTime: new Date(),
    numberOfPeople: isExist.numberOfPeople,
    TotalPrice: isExist.TotalPrice,
    pTip,
    avgPerPerson: isExist.avgPerPerson,
    dishArray: isExist.dishArray,
    payment,
    gluten: isExist.gluten,
    lactuse: isExist.lactuse,
    isVagan: isExist.isVagan,
    isVegi: isExist.isVegi,
    others: isExist.others,
    ResturantName: isExist.ResturantName,
  });

  try {
    await closeTable.save();
  } catch (err) {
    const error = new HttpError(
      "Creating Close table failed, please try again.",
      500
    );
    return next(error);
  }

  try {
    await OpenTable.findByIdAndRemove(tableId);
  } catch (err) {
    const error = new HttpError(
      "remove open table failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ Table: closeTable.toObject({ getters: true }) });
};
exports.payment = payment;
