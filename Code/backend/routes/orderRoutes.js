const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const allowRoles = require("../middleware/role");
const { uploadPayment } = require("../middleware/upload");
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  updateOrderStatus,
  trackByLR,
} = require("../controllers/orderController");

router.use(protect);

router.post("/", allowRoles("client"), uploadPayment.single("paymentScreenshot"), createOrder);
router.get("/", getOrders);
router.get("/track/:lrNumber", trackByLR);
router.get("/:id", getOrderById);
router.put("/:id", updateOrder);
router.put("/:id/status", allowRoles("admin"), updateOrderStatus);

module.exports = router;
