const fs = require("fs");
const path = require("path");
const Order = require("../models/Order");
const Document = require("../models/Document");

// @route POST /api/documents/:orderId (admin)
exports.uploadDocument = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    if (order.shipmentStatus !== "Delivered") {
      return res.status(400).json({ success: false, message: "Documents can only be uploaded for delivered orders" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const { documentType } = req.body;
    const doc = await Document.create({
      orderId: order._id,
      documentType,
      fileName: req.file.originalname,
      fileUrl: `/uploads/documents/${req.file.filename}`,
    });

    res.status(201).json({ success: true, document: doc });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route GET /api/documents/:orderId
exports.getDocuments = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    if (req.user.role !== "admin" && String(order.clientId) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const documents = await Document.find({ orderId: req.params.orderId }).sort({ uploadedAt: -1 });
    res.json({ success: true, documents });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route DELETE /api/documents/:documentId (admin)
exports.deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.documentId);
    if (!doc) return res.status(404).json({ success: false, message: "Document not found" });

    const filePath = path.join(__dirname, "..", doc.fileUrl);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await doc.deleteOne();
    res.json({ success: true, message: "Document deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
