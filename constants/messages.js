const MESSAGES = {
  /**** AUTH CONTROLLER ****/
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
};

module.exports = { MESSAGES };
