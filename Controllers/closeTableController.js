const HttpError = require('../Models/HttpError');
const CloseTable = require('../Models/CloseTable');
const OpenTable = require('../Models/OpenTable');
const Resturant = require('../Models/Resturant');

/* 
tableId:  id 
payment:[{
    paymentMethod: String (Card, Cash)
    amountPaid: number
}],
discount: number
*/
const payment = async (req, res, next) => {
  const { tableId, payment, discount } = req.body;
  let opentbl;
  try {
    opentbl = await OpenTable.findById(tableId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find any table.',
      500
    );
    return next(error);
  }
  //

  if (opentbl === undefined || !opentbl || opentbl.length == 0) {
    const error = new HttpError('Table is not exist', 500);
    return next(error);
  }
  let paid = 0;
  for (let i = 0; i < payment.length; i++) {
    paid += payment[i].amountPaid;
  }
  if (paid < opentbl.leftToPay - discount) {
    opentbl.leftToPay -= paid;
    let paymentArr = opentbl.payment;
    for (let i = 0; i < payment.length; i++) {
      paymentArr.push(payment[i]);
    }
    opentbl.payment = paymentArr;
    try {
      await opentbl.save();
    } catch (err) {}
    res.status(201).json({ Table: opentbl.toObject({ getters: true }) });
  } else {
    let isExist = opentbl;
    let tip = paid - opentbl.leftToPay - discount;
    let paymentArr = isExist.payment;
    for (let i = 0; i < payment.length; i++) {
      paymentArr.push(payment[i]);
    }
    const closeTable = new CloseTable({
      numTable: isExist.numTable,
      openTime: isExist.openTime,
      closeTime: new Date().toLocaleString('en-US', {
        timeZone: israelTimeZone,
      }),
      numberOfPeople: isExist.numberOfPeople,
      TotalPrice: isExist.TotalPrice,
      pTip: tip,
      avgPerPerson: isExist.avgPerPerson,
      dishArray: isExist.dishArray,
      payment: paymentArr,
      gluten: isExist.gluten,
      lactuse: isExist.lactuse,
      isVagan: isExist.isVagan,
      isVegi: isExist.isVegi,
      others: isExist.others,
      notes: isExist.notes,
      ResturantName: isExist.ResturantName,
      discount,
    });

    try {
      await closeTable.save();
    } catch (err) {
      const error = new HttpError(
        'Creating Close table failed, please try again.',
        500
      );
      return next(error);
    }
    try {
      await OpenTable.findByIdAndRemove(tableId);
    } catch (err) {
      const error = new HttpError(
        'remove open table failed, please try again.',
        500
      );
      return next(error);
    }

    let changedAvaTable;
    let numTable = isExist.numTable;
    let numberOfPeople = isExist.numberOfPeople;

    try {
      changedAvaTable = await Resturant.find({ 'tableArr.tableNum': numTable });
      for (let i = 0; i < changedAvaTable[0].tableArr.length; i++) {
        if (changedAvaTable[0].tableArr[i].tableNum == numTable) {
          changedAvaTable[0].tableArr[i].available = true;
          break;
        }
      }
      changedAvaTable[0].dinersAmount -= numberOfPeople;
      await changedAvaTable[0].save();
    } catch (err) {}
    res.status(201).json({ Table: closeTable.toObject({ getters: true }) });
  }
};

const GetAllCloseTables = async (req, res, next) => {
  let tables;
  try {
    tables = await CloseTable.find({});
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find any table.',
      500
    );
    return next(error);
  }
  res.json(tables);
};

const RemoveAll = async (req, res, next) => {
  let tables;
  try {
    tables = await CloseTable.find({});
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find any table.',
      500
    );
    return next(error);
  }
  try {
    for (let i = 0; i < tables.length; i++) await tables[i].remove();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not remove table.',
      500
    );
    return next(error);
  }

  res.json({ remove });
};
exports.payment = payment;
exports.GetAllCloseTables = GetAllCloseTables;
exports.RemoveAll = RemoveAll;
