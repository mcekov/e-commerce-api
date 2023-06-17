const Product = require('../models/Product');
const CustomError = require('../errors');
const { StatusCodes } = require('http-status-codes');

const path = require('path');

const createProduct = async (req, res) => {
  req.body.user = req.user.userId;

  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};

const updateProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw new CustomError.NotFoundError(`No product with id: ${productId}`);
  }

  res.status(StatusCodes.OK).send({ product });
};

const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findOne({ _id: productId });

  if (!product) {
    throw new CustomError.NotFoundError(`No product with id: ${productId}`);
  }

  await product.remove();
  res.status(StatusCodes.OK).send({ message: 'Product removed' });
};

const uploadImage = async (req, res) => {
  if (!req.files) {
    throw new CustomError.BadRequestError(`No file uploaded`);
  }

  const productImage = req.files.image;
  const maxSize = 1024 * 1024;

  if (!productImage.mimetype.startsWith('image')) {
    throw new CustomError.BadRequestError(`Please upload image`);
  }

  if (productImage.size > maxSize) {
    throw new CustomError.BadRequestError(`Please upload image smaller than 1 mb`);
  }

  const imagePath = path.join(__dirname, `../public/uploads/${productImage.name}`);
  await productImage.mv(imagePath);

  res.status(StatusCodes.OK).send({ message: 'Ahoy', image: `/uploads/${productImage.name}` });
};

const getAllProducts = async (req, res) => {
  const products = await Product.find({});
  res.status(StatusCodes.OK).json({ products });
};

const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findOne({ _id: productId });

  if (!product) {
    throw new CustomError.NotFoundError(`No product with id: ${productId}`);
  }

  res.status(StatusCodes.OK).send({ product });
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
  getAllProducts,
  getSingleProduct,
};
