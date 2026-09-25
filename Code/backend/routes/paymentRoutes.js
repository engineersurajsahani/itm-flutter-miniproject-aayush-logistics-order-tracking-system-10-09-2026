const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const allowRoles = require("../middleware/role");
const { getPendingPayments, verifyPayment, rejectPayment } = require("../controllers/paymentController");

router.use(protect, allowRoles("admin"));

router.get("/pending", getPendingPayments);
router.put("/:orderId/verify", verifyPayment);
router.put("/:orderId/reject", rejectPayment);

module.exports = router;
