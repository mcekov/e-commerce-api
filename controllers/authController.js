const User = require('../models/User');
const Token = require('../models/Token');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const {
  attachCookiesToResponse,
  createTokenUser,
  sendVerificationEmail,
  sendResetPasswordEmail,
} = require('../utils');

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

  let refreshToken = '';

  const existingToken = await Token.findOne({ user: user._id });

  if (existingToken) {
    const { isValid } = existingToken;

    if (!isValid) {
      throw new CustomError.BadRequestError(MESSAGES.invalidCredentials);
    }

    refreshToken = existingToken.refreshToken;
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });
    res.status(StatusCodes.OK).json({ user: tokenUser });
    return;
  }

  refreshToken = crypto.randomBytes(40).toString('hex');
  const userAgent = req.headers['user-agent'];
  const ip = req.ip;
  const userToken = { refreshToken, ip, userAgent, user: user._id };

  await Token.create(userToken);

  attachCookiesToResponse({ res, user: tokenUser, refreshToken });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logout = async (req, res) => {
  await Token.findOneAndDelete({ user: req.user.userId });
  res.cookie('accessToken', 'logout', { httpOnly: true, expires: new Date(Date.now()) });
  res.cookie('refreshToken', 'logout', { httpOnly: true, expires: new Date(Date.now()) });

  res.status(StatusCodes.OK).json({ message: MESSAGES.logoutUserMessage });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new CustomError.BadRequestError(MESSAGES.invalidEmail);
  }

  const user = await User.findOne({ email: email });
  if (user) {
    const passwordToken = crypto.randomBytes(70).toString('hex');

    // Send email
    const origin = 'http://localhost:5173';
    await sendResetPasswordEmail({
      name: user.name,
      email: user.email,
      token: passwordToken,
      origin,
    });

    const tenMinutes = 1000 * 60 * 10;
    const passwordTokenExpDate = new Date(Date.now() + tenMinutes);

    user.passwordToken = passwordToken;
    user.passwordTokenExpDate = passwordTokenExpDate;
    await user.save();
  }

  res.status(StatusCodes.OK).json({ message: 'Please check your email for reset password link' });
};

const resetPassword = async (req, res) => {
  const { token, email, password } = req.body;

  if (!token || !email || !password) {
    throw new CustomError.BadRequestError(MESSAGES.emptyValues);
  }

  const user = await User.findOne({ email });

  if (user) {
    const currentDate = new Date();

    if (user.passwordToken === token && user.passwordTokenExpDate > currentDate) {
      user.password = password;
      user.passwordToken = null;
      user.passwordTokenExpDate = null;

      await user.save();
    }
  }

  res.status(StatusCodes.OK).json({ message: 'Reset password' });
};

module.exports = { register, login, logout, verifyEmail, forgotPassword, resetPassword };
