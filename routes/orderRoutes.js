const express = require('express');
const router = express.Router();

const { authenticateUser, authorizePermissions } = require('../middleware/authentication');

const {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
} = require('../controllers/orderController');

router.route('/').get(getAllOrders).post([authenticateUser], createOrder).patch(updateOrder);
router.route('/:id').get([authenticateUser], getSingleOrder);

router.route('/:id/user').get(getCurrentUserOrders);

module.exports = router;
