const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dishRoute = require('./Routes/dishRoute');
const drinkRoute = require('./Routes/drinkRoute');
const openTableRoute = require('./Routes/openTableRoutes');
const resturantRoute = require('./Routes/resturantRoute');
const closeTableRoute = require('./Routes/closeTableRoute');
const app = express();
const path = require('path');

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
});

app.use(express.static(path.join(__dirname + '/public')));

/************* Routes **************/
app.use('/dish', dishRoute);
app.use('/drink', drinkRoute);
app.use('/openTable', openTableRoute);
app.use('/res', resturantRoute);
app.use('/closeTable', closeTableRoute);

app.use((req, res, next) => {
  const error = new HttpError('Could  not find this route', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});

/************** Connection *************/
mongoose
  .connect(
    'mongodb+srv://easyRest:121197@cluster0.61aruej.mongodb.net/Dish?retryWrites=true&w=majority'
  )
  .then(() => {
    app.listen(process.env.PORT || 3001, () =>
      console.log('listen to port 3001')
    );
  })
  .catch((err) => console.log(err));
