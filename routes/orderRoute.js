const express = require("express");
const {newOrder, getSingleOrder, myOrders, allOrders, updateOrderStatus, deleteOrder} = require("../controller/orderController");
const { isAuthUser, authorizedRole } = require("../middleware/auth");

const router = express.Router();


router.route("/order/new").post(isAuthUser, newOrder);

router.route("/order/:id").get(isAuthUser, authorizedRole("admin"), getSingleOrder);

router.route("/orders/me").get(isAuthUser, myOrders);

router.route("/admin/orders").get(isAuthUser,authorizedRole("admin"), allOrders);

router.route("/admin/order/:id").put(isAuthUser,authorizedRole("admin"), updateOrderStatus);


router.route("/admin/order/:id").delete(isAuthUser, authorizedRole("admin"), deleteOrder);


module.exports= router;
