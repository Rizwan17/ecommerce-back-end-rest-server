const express = require("express");
//const {  } = require('../controller/category');
const { requireSignin, adminMiddleware } = require("../common-middleware");
const {
  createProduct,
  getProductsBySlug,
  getProductDetailsById,
  deleteProductById,
  getProducts,
} = require("../controller/product");
const router = express.Router();

router.post("/product/create", requireSignin, adminMiddleware, createProduct);
router.get("/products/:slug", getProductsBySlug);
router.get("/product/:productId", getProductDetailsById);
router.delete(
  "/product/deleteProductById",
  requireSignin,
  adminMiddleware,
  deleteProductById
);
router.post(
  "/product/getProducts",
  requireSignin,
  adminMiddleware,
  getProducts
);

module.exports = router;
