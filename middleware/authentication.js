const Token = require('../models/Token');
const { MESSAGES } = require('../constants/messages');
const CustomError = require('../errors');
const { isTokenValid, attachCookiesToResponse } = require('../utils');

const authenticateUser = async (req, res, next) => {
  const { refreshToken, accessToken } = req.signedCookies;

  try {
    if (accessToken) {
      const payload = isTokenValid(accessToken);
      req.user = payload.user;
      return next();
    }

    const payload = isTokenValid(refreshToken);

    const existingToken = await Token.findOne({
      user: payload.user.userId,
      refreshToken: payload.refreshToken,
    });

    if (!existingToken || !existingToken?.isValid) {
      throw new CustomError.UnauthenticatedError(MESSAGES.authenticationInvalid);
    }

    attachCookiesToResponse({ res, user: payload.user, refreshToken: existingToken.refreshToken });

    req.user = payload.user;
    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError(MESSAGES.invalidToken);
  }
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(MESSAGES.authorizeError);
    }
    next();
  };
};

module.exports = {
  authenticateUser,
  authorizePermissions,
};
