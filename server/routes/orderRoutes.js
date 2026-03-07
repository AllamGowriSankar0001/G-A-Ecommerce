const router = require("express").Router();
const Auth = require("../middleware/AuthVerify");
const { createOrder, getMyOrders } = require("../controllers/orderController");

router.post("/create", Auth, createOrder);
router.get("/my", Auth, getMyOrders);

module.exports = router;

