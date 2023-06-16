const createProduct = (req, res) => {
  res.send('create product');
};

const updateProduct = (req, res) => {
  res.send('upload product');
};

const deleteProduct = (req, res) => {
  res.send('delete product');
};

const uploadImage = (req, res) => {
  res.send('upload product');
};

const getAllProducts = (req, res) => {
  res.send('get all products');
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
  getAllProducts,
};
