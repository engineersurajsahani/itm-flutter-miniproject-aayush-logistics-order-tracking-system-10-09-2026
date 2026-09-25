const Order = require("../models/Order");
const TrackingUpdate = require("../models/TrackingUpdate");

// @route POST /api/tracking/:orderId (admin)
exports.addTrackingUpdate = async (req, res) => {
  try {
    const { locationName, latitude, longitude, status, remarks } = req.body;
    if (!locationName || latitude === undefined || longitude === undefined || !status) {
      return res.status(400).json({ success: false, message: "locationName, latitude, longitude and status are required" });
    }

    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    const update = await TrackingUpdate.create({
      orderId: order._id,
      locationName,
      latitude,
      longitude,
      status,
      remarks,
    });

    order.currentLocation = { name: locationName, lat: latitude, lng: longitude, updatedAt: new Date() };
    if (status) order.shipmentStatus = status;
    await order.save();

    res.status(201).json({ success: true, update, order, message: "Tracking update added" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route GET /api/tracking/:orderId
exports.getTrackingHistory = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    if (req.user.role !== "admin" && String(order.clientId) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const history = await TrackingUpdate.find({ orderId: req.params.orderId }).sort({ updatedAt: 1 });
    res.json({ success: true, history });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
