const express = require('express');
const router = express.Router();

const { authenticateUser, authorizePermissions } = require('../middleware/authentication');

const {
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
  getAllProducts,
} = require('../controllers/userController');

router.route('/allProducts', getAllProducts);

module.exports = router;
