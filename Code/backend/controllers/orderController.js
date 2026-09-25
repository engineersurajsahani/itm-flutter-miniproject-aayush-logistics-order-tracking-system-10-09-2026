const Order = require("../models/Order");
const TrackingUpdate = require("../models/TrackingUpdate");

const RATE_PER_KG = { "Mini Truck": 8, "Pickup": 7, "Tempo": 6, "Truck": 5, "Container": 4 };
const BASE_FARE = { "Mini Truck": 500, "Pickup": 600, "Tempo": 800, "Truck": 1500, "Container": 3000 };

const calculateCharge = (weightKg, vehicleType) => {
  const base = BASE_FARE[vehicleType] || 500;
  const rate = RATE_PER_KG[vehicleType] || 8;
  return Math.round(base + weightKg * rate);
};

// @route POST /api/orders  (client)
exports.createOrder = async (req, res) => {
  try {
    const parseIfString = (val) => {
      if (typeof val === "string") {
        try { return JSON.parse(val); } catch { return val; }
      }
      return val;
    };

    const pickupDetails = parseIfString(req.body.pickupDetails);
    const deliveryDetails = parseIfString(req.body.deliveryDetails);
    const goodsDetails = parseIfString(req.body.goodsDetails);
    const { vehicleType, paymentMethod, paymentReference } = req.body;

    if (!pickupDetails || !deliveryDetails || !goodsDetails || !vehicleType || !paymentMethod) {
      return res.status(400).json({ success: false, message: "Missing required booking details" });
    }

    const estimatedAmount = calculateCharge(Number(goodsDetails.weightKg) || 0, vehicleType);

    const order = await Order.create({
      clientId: req.user._id,
      pickupDetails,
      deliveryDetails,
      goodsDetails,
      vehicleType,
      estimatedAmount,
      paymentMethod,
      paymentReference,
      paymentScreenshot: req.file ? `/uploads/payments/${req.file.filename}` : undefined,
      paymentStatus: "Pending Verification",
      shipmentStatus: "Booked",
    });

    res.status(201).json({ success: true, order, message: "Your booking will receive an LR Number after admin payment verification." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route GET /api/orders
exports.getOrders = async (req, res) => {
  try {
    const filter = req.user.role === "admin" ? {} : { clientId: req.user._id };

    if (req.query.status) filter.shipmentStatus = req.query.status;
    if (req.query.search) {
      const s = req.query.search;
      filter.$or = [
        { lrNumber: { $regex: s, $options: "i" } },
        { "pickupDetails.city": { $regex: s, $options: "i" } },
        { "deliveryDetails.city": { $regex: s, $options: "i" } },
      ];
    }
    if (req.query.from || req.query.to) {
      filter.createdAt = {};
      if (req.query.from) filter.createdAt.$gte = new Date(req.query.from);
      if (req.query.to) filter.createdAt.$lte = new Date(req.query.to);
    }

    const orders = await Order.find(filter)
      .populate("clientId", "name email phone")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route GET /api/orders/:id
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("clientId", "name email phone");
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    if (req.user.role !== "admin" && String(order.clientId._id) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const trackingHistory = await TrackingUpdate.find({ orderId: order._id }).sort({ updatedAt: 1 });

    res.json({ success: true, order, trackingHistory });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route GET /api/orders/track/:lrNumber
exports.trackByLR = async (req, res) => {
  try {
    const order = await Order.findOne({ lrNumber: req.params.lrNumber }).populate("clientId", "name email phone");
    if (!order) return res.status(404).json({ success: false, message: "No shipment found with this LR number" });

    if (req.user.role !== "admin" && String(order.clientId._id) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const trackingHistory = await TrackingUpdate.find({ orderId: order._id }).sort({ updatedAt: 1 });
    res.json({ success: true, order, trackingHistory });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route PUT /api/orders/:id  (admin: edit order; client: edit own order before In Transit)
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    const isOwner = String(order.clientId) === String(req.user._id);
    if (req.user.role !== "admin" && !isOwner) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    if (req.user.role !== "admin") {
      const lockedStatuses = ["In Transit", "Delivered", "Cancelled"];
      if (lockedStatuses.includes(order.shipmentStatus)) {
        return res.status(400).json({ success: false, message: `Order cannot be edited once it is ${order.shipmentStatus}` });
      }
    }

    const allowedFields = req.user.role === "admin"
      ? ["pickupDetails", "deliveryDetails", "goodsDetails", "vehicleType", "driverName", "vehicleNumber", "estimatedDeliveryDate", "estimatedAmount"]
      : ["pickupDetails", "deliveryDetails", "goodsDetails", "vehicleType"];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) order[field] = req.body[field];
    });

    await order.save();
    res.json({ success: true, order, message: "Order updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route PUT /api/orders/:id/status (admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { shipmentStatus } = req.body;
    const validStatuses = ["Booked", "Payment Verified", "Picked Up", "In Transit", "Delivered", "Cancelled"];
    if (!validStatuses.includes(shipmentStatus)) {
      return res.status(400).json({ success: false, message: "Invalid shipment status" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    order.shipmentStatus = shipmentStatus;
    await order.save();

    res.json({ success: true, order, message: `Shipment status updated to ${shipmentStatus}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.calculateCharge = calculateCharge;
