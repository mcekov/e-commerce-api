const Order = require('../models/Order');
const CustomError = require('../errors');
const { StatusCodes } = require('http-status-codes');
const Product = require('../models/Product');
const { checkPermissions } = require('../utils');
const { MESSAGES } = require('../constants/messages');

const { fakeStripeAPI } = require('../utils/stripe');

const getAllOrders = async (req, res) => {
  const orders = await Order.find({});

  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};
const getSingleOrder = async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id });

  if (!order) {
    throw new CustomError.BadRequestError(`${MESSAGES.invalidOrder}: ${req.params.id}`);
  }

  checkPermissions(req.user, order.user);

  res.status(StatusCodes.OK).json({ order });
};
const getCurrentUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.userId });

  if (!orders) {
    throw new CustomError.BadRequestError(`${MESSAGES.invalidOrder}: ${req.params.id}`);
  }

  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};
const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body;
  let orderItems = [];
  let subtotal = 0;

  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.BadRequestError(MESSAGES.emptyCart);
  }

  if (!tax || !shippingFee) {
    throw new CustomError.BadRequestError(MESSAGES.emptyTaxOrShipping);
  }

  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product });

    if (!dbProduct) {
      throw new CustomError.NotFoundError(`${MESSAGES.invalidOrder}: ${item.product}`);
    }

    const { name, price, image, _id } = dbProduct;

    const orderItem = {
      name,
      amount: item.amount,
      price,
      image,
      product: _id,
    };

    orderItems = [...orderItems, orderItem];

    subtotal += item.amount * price;
  }

  // Calc total
  const total = tax + shippingFee + subtotal;
  // Get client secret
  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: 'usd',
  });

  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.client_secret,
    user: req.user.userId,
  });

  res.status(StatusCodes.CREATED).json({ order });
};
const updateOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const { paymentIntentId } = req.body;

  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new CustomError.BadRequestError(`${MESSAGES.invalidOrder}: ${req.params.id}`);
  }

  checkPermissions(req.user, order.user);

  order.paymentIntentId = paymentIntentId;
  order.status = 'paid';
  await order.save();

  res.status(StatusCodes.OK).json({ order });
};

module.exports = { getAllOrders, getSingleOrder, getCurrentUserOrders, createOrder, updateOrder };
