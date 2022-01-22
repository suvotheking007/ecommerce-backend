const express = require("express");
const categoryController = require("../../../src/controllers/categoryController");
const productController = require("../../../src/controllers/productController");
const orderController = require("../../../src/controllers/orderController");
const userController = require("../../../src/controllers/userController");

const router = express.Router();

router.post("/category/all", categoryController.listCategories);
router.post("/product/all", productController.listProducts);
router.post("/product/add", productController.addProduct);
router.post("/order/details", orderController.getOrderDetails);
router.post("/order/add", orderController.createOrder);
router.post("/order/edit", orderController.editOrder);
router.post("/user/signup", userController.signup);
router.post("/user/login", userController.login);
router.post("/user/register", userController.register);

module.exports = router;
