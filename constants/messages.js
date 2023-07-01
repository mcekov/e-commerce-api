const MESSAGES = {
  /**** AUTH CONTROLLER ****/
  emailVerificationMessage: 'Please verify your email',
  verificationFailed: 'Verification failed',
  emailVerifiedSuccess: 'Email verified',
  accountCreatedSuccess: 'Success! Please check your email to verify account',
  emailExist: 'Email already exists',
  emptyEmailOrPassword: 'Please provide email and password',
  invalidCredentials: 'Invalid credentials',
  logoutUserMessage: 'User logged out',
  /**** ORDER CONTROLLER ****/
  invalidOrder: 'No order with id',
  emptyCart: 'No cart items provided',
  emptyTaxOrShipping: 'Please provide tax and shipping fee',
  /**** PRODUCT CONTROLLER ****/
  invalidProduct: 'No product with id',
  removedProductSuccess: 'Success! Product removed',
  /**** REVIEW CONTROLLER ****/
  alreadySubmittedReview: 'Already submitted review for this product',
  invalidReview: 'No review with id',
  removedReviewSuccess: 'Success! Review removed',
  /**** USER CONTROLLER ****/
  invalidUser: 'No user with id',
  emptyUserValues: 'Please provide all values',
  invalidCredentials: 'Invalid credentials',
  passwordUpdateSuccess: 'Success! Password updated.',
  /**** MIDDLEWARE Authentication ****/
  invalidToken: 'Please Login to continue',
  authorizeError: 'Unauthorized action.',
  /**** MIDDLEWARE Error Handler ****/
  somethingWentWrong: 'Something went wrong try again later',
  duplicateValue: 'Duplicate value entered for',
  invalidItem: 'No item found with id',
  /**** MIDDLEWARE Not Found ****/
  invalidRoute: 'Route does not exist',
  /**** MIDDLEWARE Check Permissions ****/
  unauthorizedAccess: 'Not authorized to access this route',
};

module.exports = { MESSAGES };
