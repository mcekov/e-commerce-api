const createProduct = async (req, res) => {
  res.send('create product');
};

const updateProduct = async (req, res) => {
  res.send('upload product');
};

const deleteProduct = async (req, res) => {
  res.send('delete product');
};

const uploadImage = async (req, res) => {
  res.send('upload product');
};

const getAllProducts = async (req, res) => {
  res.send('get all products');
};

const getSingleProduct = async (req, res) => {
  res.send('get single products');
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
  getAllProducts,
  getSingleProduct,
};
