const Order = require("../models/Order");
const User = require("../models/User");

// @route GET /api/stats/client (client dashboard summary)
exports.clientStats = async (req, res) => {
  try {
    const clientId = req.user._id;
    const [total, active, delivered, pendingPayment] = await Promise.all([
      Order.countDocuments({ clientId }),
      Order.countDocuments({ clientId, shipmentStatus: { $in: ["Picked Up", "In Transit", "Payment Verified"] } }),
      Order.countDocuments({ clientId, shipmentStatus: "Delivered" }),
      Order.countDocuments({ clientId, paymentStatus: "Pending Verification" }),
    ]);

    const statusAgg = await Order.aggregate([
      { $match: { clientId: req.user._id } },
      { $group: { _id: "$shipmentStatus", count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      stats: { total, active, delivered, pendingPayment },
      statusBreakdown: statusAgg.map((s) => ({ status: s._id, count: s.count })),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route GET /api/stats/admin (admin dashboard summary)
exports.adminStats = async (req, res) => {
  try {
    const [totalClients, totalOrders, pendingPayments, activeDeliveries, delivered] = await Promise.all([
      User.countDocuments({ role: "client" }),
      Order.countDocuments({}),
      Order.countDocuments({ paymentStatus: "Pending Verification" }),
      Order.countDocuments({ shipmentStatus: { $in: ["Picked Up", "In Transit"] } }),
      Order.countDocuments({ shipmentStatus: "Delivered" }),
    ]);

    const statusAgg = await Order.aggregate([
      { $group: { _id: "$shipmentStatus", count: { $sum: 1 } } },
    ]);

    const monthAgg = await Order.aggregate([
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const ordersByMonth = monthAgg.map((m) => ({
      month: `${monthNames[m._id.month - 1]} ${m._id.year}`,
      count: m.count,
    }));

    res.json({
      success: true,
      stats: { totalClients, totalOrders, pendingPayments, activeDeliveries, delivered },
      statusBreakdown: statusAgg.map((s) => ({ status: s._id, count: s.count })),
      ordersByMonth,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route GET /api/stats/clients (admin - list of clients)
exports.listClients = async (req, res) => {
  try {
    const clients = await User.find({ role: "client" }).select("-password").sort({ createdAt: -1 });
    const withCounts = await Promise.all(
      clients.map(async (c) => {
        const orderCount = await Order.countDocuments({ clientId: c._id });
        return { ...c.toObject(), orderCount };
      })
    );
    res.json({ success: true, clients: withCounts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
