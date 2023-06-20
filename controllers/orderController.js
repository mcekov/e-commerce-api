const Order = require('../models/Order');
const CustomError = require('../errors');
const { StatusCodes } = require('http-status-codes');

const getAllOrders = (req, res) => {
  res.send('get all orders');
};
const getSingleOrder = (req, res) => {
  res.send('get order');
};
const getCurrentUserOrders = (req, res) => {
  res.send('get current user orders');
};
const createOrder = (req, res) => {
  res.send('create order');
};
const updateOrder = (req, res) => {
  res.send('update order');
};

module.exports = { getAllOrders, getSingleOrder, getCurrentUserOrders, createOrder, updateOrder };
