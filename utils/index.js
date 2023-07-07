const { createJWT, isTokenValid, attachCookiesToResponse } = require('./jwt');
const createTokenUser = require('./createTokenUtils');
const checkPermissions = require('./checkPermissions');
const stripe = require('./stripe');

const sendVerificationEmail = require('./sendVerificationEmail');

module.exports = {
  createJWT,
  isTokenValid,
  createTokenUser,
  checkPermissions,
  attachCookiesToResponse,
  stripe,
  sendVerificationEmail,
};
