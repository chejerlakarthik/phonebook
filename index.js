const express = require("express");
const morgan = require("morgan");
const requestId = require('express-request-id');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const uuid = require('uuid');

const phoneRoutes = require('./api/routes/phone')

const app = express();
const PORT = process.env.PORT || 4000;

mongoose.connect(
  "mongodb+srv://" +
    `${process.env.MONGO_USER}:${process.env.MONGO_SECRET}` +
    "@cluster0-izrwx.mongodb.net/test?retryWrites=true&w=majority",
  { useNewUrlParser: true, useFindAndModify: false }
);

// Set the requestId header for each HTTP request
app.use(
  requestId({
    setHeader: true
  })
);

app.use(morgan("combined"));
app.use(bodyParser.json());

// routes
app.use('/phones', phoneRoutes)

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
});
