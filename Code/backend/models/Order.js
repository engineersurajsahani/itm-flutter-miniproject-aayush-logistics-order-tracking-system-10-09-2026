const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    lrNumber: { type: String, unique: true, sparse: true },

    pickupDetails: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      contactName: { type: String, required: true },
      contactNumber: { type: String, required: true },
      pickupDate: { type: Date, required: true },
      lat: Number,
      lng: Number,
    },

    deliveryDetails: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      receiverName: { type: String, required: true },
      receiverPhone: { type: String, required: true },
      lat: Number,
      lng: Number,
    },

    goodsDetails: {
      category: {
        type: String,
        enum: ["Electronics", "Furniture", "Clothing", "Food", "Machinery", "Other"],
        required: true,
      },
      description: String,
      weightKg: { type: Number, required: true },
      numPackages: { type: Number, required: true, default: 1 },
      estimatedValue: Number,
    },

    vehicleType: {
      type: String,
      enum: ["Mini Truck", "Pickup", "Tempo", "Truck", "Container"],
      required: true,
    },

    estimatedAmount: { type: Number, required: true },

    paymentMethod: { type: String, enum: ["Cash", "UPI", "Bank Transfer"], required: true },
    paymentReference: { type: String },
    paymentScreenshot: { type: String },
    paymentStatus: {
      type: String,
      enum: ["Pending Verification", "Verified", "Rejected"],
      default: "Pending Verification",
    },
    rejectionReason: { type: String },

    shipmentStatus: {
      type: String,
      enum: ["Booked", "Payment Verified", "Picked Up", "In Transit", "Delivered", "Cancelled"],
      default: "Booked",
    },

    driverName: String,
    vehicleNumber: String,
    estimatedDeliveryDate: Date,

    currentLocation: {
      name: String,
      lat: Number,
      lng: Number,
      updatedAt: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
