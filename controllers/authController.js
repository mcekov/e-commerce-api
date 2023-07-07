const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { attachCookiesToResponse, createTokenUser, sendVerificationEmail } = require('../utils');

const { MESSAGES } = require('../constants/messages');

const crypto = require('crypto');

const register = async (req, res) => {
  const { email, name, password } = req.body;

  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError(MESSAGES.emailExist);
  }

  /* First reg. user is ADMIN */
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? 'admin' : 'user';

  const verificationToken = crypto.randomBytes(40).toString('hex');

  const user = await User.create({ name, email, password, role, verificationToken });
  const origin = 'http://localhost:5173';

  await sendVerificationEmail({
    name: user.name,
    email: user.email,
    verificationToken: user.verificationToken,
    origin,
  });

  res.status(StatusCodes.CREATED).json({
    message: MESSAGES.accountCreatedSuccess,
  });
};

const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body;

  const userWithEmail = await User.findOne({ email });

  if (!userWithEmail) {
    throw new CustomError.UnauthenticatedError(MESSAGES.verificationFailed);
  }

  if (userWithEmail.verificationToken === '') {
    throw new CustomError.UnauthenticatedError(MESSAGES.alreadyVerified);
  }

  if (userWithEmail.verificationToken !== verificationToken) {
    throw new CustomError.UnauthenticatedError(MESSAGES.verificationFailed);
  }

  userWithEmail.isVerified = true;
  userWithEmail.verified = Date.now();
  userWithEmail.verificationToken = '';

  await userWithEmail.save();

  res.status(StatusCodes.OK).json({ message: MESSAGES.emailVerifiedSuccess });
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

  if (!user.isVerified) {
    throw new CustomError.BadRequestError(MESSAGES.emailVerificationMessage);
  }

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logout = async (req, res) => {
  res.cookie('token', 'logout', { httpOnly: true, expires: new Date(Date.now()) });

  res.status(StatusCodes.OK).json({ message: MESSAGES.logoutUserMessage });
};

module.exports = { register, login, logout, verifyEmail };
