const express = require("express");
const { getAllProducts, createProduct, updateProducts, deleteProduct, getProductDetails, createReview,
     getProductReviews, deleteReview } = require("../controller/productController");
const { isAuthUser, authorizedRole } = require("../middleware/auth");

const router = express.Router();

router.route("/products").get(  getAllProducts);

router.route("/admin/products/new").post(isAuthUser , authorizedRole("admin"),createProduct);

router.route("/admin/products/:id").put(isAuthUser,  authorizedRole("admin"), updateProducts)
.delete(isAuthUser , authorizedRole("admin"), deleteProduct);

router.route("/products/:id").get(getProductDetails);

router.route("/review").put(isAuthUser, createReview);

router.route("/reviews").get(getProductReviews).delete(isAuthUser,deleteReview)

module.exports = router