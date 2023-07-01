const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { attachCookiesToResponse, createTokenUser } = require('../utils');
const { MESSAGES } = require('../constants/messages');

const register = async (req, res) => {
  const { email, name, password } = req.body;

  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError(MESSAGES.emailExist);
  }

  /* First reg. user is ADMIN */
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? 'admin' : 'user';

  const verificationToken = 'fake token';

  const user = await User.create({ name, email, password, role, verificationToken });

  res.status(StatusCodes.CREATED).json({
    message: MESSAGES.accountCreatedSuccess,
    verificationToken: user.verificationToken,
  });

  /* const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.CREATED).json({ user: tokenUser }); */
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError(MESSAGES.emptyEmailOrPassword);
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.BadRequestError(MESSAGES.invalidCredentials);
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.BadRequestError(MESSAGES.invalidCredentials);
  }

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logout = async (req, res) => {
  res.cookie('token', 'logout', { httpOnly: true, expires: new Date(Date.now()) });

  res.status(StatusCodes.OK).json({ message: MESSAGES.logoutUserMessage });
};

module.exports = { register, login, logout };
