const CustomError = require('../errors');
const { isTokenValid } = require('../utils');

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;
  console.log(token);

  if (!token) {
    console.log('No token');
  } else {
    console.log('yes token');
  }

  next();
};

module.exports = { authenticateUser };
