const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    documentType: {
      type: String,
      enum: ["Invoice", "Delivery Receipt", "Bill", "PDF Document"],
      required: true,
    },
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Document", documentSchema);
