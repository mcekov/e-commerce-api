const Review = require('../models/Review');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { createTokenUser, attachCookiesToResponse, checkPermissions } = require('../utils');

const createReview = async (req, res) => {
  res.send('create');
};

const getAllReviews = async (req, res) => {
  res.send('getAllReviews');
};

const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params;
  res.send(`getSingleReview - ${reviewId}`);
};

const updateReview = async (req, res) => {
  res.send('updateReview');
};

const deleteReview = async (req, res) => {
  res.send('deleteReview');
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
};
