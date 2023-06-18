const Review = require('../models/Review');
const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');
const CustomApiError = require('../errors');
const { checkPermissions } = require('../utils');

const { ObjectId } = require('mongodb');

const createReview = async (req, res) => {
  const { product: productId } = req.body;
  const isValidProduct = await Product.findOne({ productId });

  if (!isValidProduct) {
    throw new CustomError.NotFoundError(`Product with id ${productId}`);
  }

  const alreadySubmitted = await Review.findOne({ product: productId, user: req.user.userId });
  if (alreadySubmitted) {
    throw new CustomError.BadRequestError(`Already submitted review for this product`);
  }

  req.body.user = req.user.userId;

  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
};

const getAllReviews = async (req, res) => {
  const reviews = await Review.find({});

  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params;
  let newID = reviewId.toString();

  /*  try {
    const review = await Review.findOne({ _id: _id });
    res.status(StatusCodes.OK).json({ review });
  } catch (error) {
    throw new CustomApiError.NotFoundError(`No review with id ${reviewId}`);
  } */
  const review = await Review.findOne({ _id: newID });
  if (!review) {
    throw new CustomApiError.NotFoundError(`No review with id ${reviewId}`);
  }
  res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res) => {
  res.send('updateReview');
};

const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;

  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    throw new CustomError.NotFoundError(`There is no review with id: ${reviewId}`);
  }

  checkPermissions(req.user, review.user);
  await review.remove();
  res.status(StatusCodes.OK).json({ msg: 'Success! Review removed' });
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
};
