const Product = require('../models/Product');
const { CustomAPIError } = require('../errors');
const { StatusCodes } = require('http-status-codes');

const createProduct = async (req, res) => {
  req.body.user = req.user.userId;

  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};

const updateProduct = async (req, res) => {
  res.send('upload product');
};

const deleteProduct = async (req, res) => {
  res.send('delete product');
};

const uploadImage = async (req, res) => {
  res.send('upload image product');
};

const getAllProducts = async (req, res) => {
  res.send('get all products');
};

const getSingleProduct = async (req, res) => {
  res.status(StatusCodes.OK).send(req.body);
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
  getAllProducts,
  getSingleProduct,
};
