const { StatusCodes } = require('http-status-codes');
const { MESSAGES } = require('../constants/messages');
const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);
  let customError = {
    // set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || MESSAGES.somethingWentWrong,
  };
  if (err.name === 'ValidationError') {
    customError.message = Object.values(err.errors)
      .map((item) => item.message)
      .join(',');
    customError.statusCode = 400;
  }
  if (err.code && err.code === 11000) {
    customError.message = `Duplicate value entered for ${Object.keys(
      err.keyValue,
    )} field, please choose another value`;
    customError.statusCode = 400;
  }
  if (err.name === 'CastError') {
    customError.message = `${MESSAGES.invalidItem}: ${err.value}`;
    customError.statusCode = 404;
  }

  return res.status(customError.statusCode).json({ message: customError.message });
};

module.exports = errorHandlerMiddleware;
