async function createProduct(req, res) {
  res.send("createProduct");
}

async function getAllProducts(req, res) {
  res.send("getAllProducts");
}

async function getSingleProduct(req, res) {
  res.send("getSingleProduct");
}

async function updateProduct(req, res) {
  res.send("updateProduct");
}

async function deleteProduct(req, res) {
  res.send("deleteProduct");
}

async function uploadProductImage(req, res) {
  res.send("uploadProductImage");
}

export {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
};
