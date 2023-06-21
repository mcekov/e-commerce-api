const Order = require('../models/Order');
const CustomError = require('../errors');
const { StatusCodes } = require('http-status-codes');
const Product = require('../models/Product');

const getAllOrders = async (req, res) => {
  res.send('get all orders');
};
const getSingleOrder = async (req, res) => {
  res.send('get order');
};
const getCurrentUserOrders = async (req, res) => {
  res.send('get current user orders');
};

const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = 'someRandomValue';
  return { client_secret, amount };
};

const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body;
  let orderItems = [];
  let subtotal = 0;

  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.BadRequestError('No cart items provided');
  }

  if (!tax || !shippingFee) {
    throw new CustomError.BadRequestError('Please provide tax and shipping fee');
  }

  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product });

    if (!dbProduct) {
      throw new CustomError.NotFoundError(`No product with id ${item.product}`);
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

  res.status(StatusCodes.CREATED).json({ order, clientSecret: order.clientSecret });
};
const updateOrder = async (req, res) => {
  res.send('update order');
};

module.exports = { getAllOrders, getSingleOrder, getCurrentUserOrders, createOrder, updateOrder };
