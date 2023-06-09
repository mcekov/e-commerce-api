const { createJWT, isTokenValid, attachCookiesToResponse } = require('./jwt');
const createTokenUser = require('./createTokenUtils');
const checkPermissions = require('./checkPermissions');
const stripe = require('./stripe');

const sendVerificationEmail = require('./sendVerificationEmail');
const sendResetPasswordEmail = require('./sendResetPasswordEmail');

const createHash = require('../utils/createHash');

module.exports = {
  createJWT,
  isTokenValid,
  createTokenUser,
  checkPermissions,
  attachCookiesToResponse,
  stripe,
  sendVerificationEmail,
  sendResetPasswordEmail,
  createHash,
};
