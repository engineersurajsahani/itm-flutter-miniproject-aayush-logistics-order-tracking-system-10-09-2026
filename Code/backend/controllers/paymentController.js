const Order = require("../models/Order");
const generateLRNumber = require("../utils/generateLR");

// @route GET /api/payments/pending (admin)
exports.getPendingPayments = async (req, res) => {
  try {
    const orders = await Order.find({ paymentStatus: "Pending Verification" })
      .populate("clientId", "name email phone")
      .sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route PUT /api/payments/:orderId/verify (admin)
exports.verifyPayment = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    if (!order.lrNumber) {
      order.lrNumber = await generateLRNumber();
    }
    order.paymentStatus = "Verified";
    order.shipmentStatus = "Payment Verified";
    await order.save();

    res.json({ success: true, order, message: `Payment verified. LR Number ${order.lrNumber} generated.` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route PUT /api/payments/:orderId/reject (admin)
exports.rejectPayment = async (req, res) => {
  try {
    const { reason } = req.body;
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    order.paymentStatus = "Rejected";
    order.rejectionReason = reason || "Payment could not be verified";
    await order.save();

    res.json({ success: true, order, message: "Payment rejected" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
