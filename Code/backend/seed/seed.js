require("dotenv").config();
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const Order = require("../models/Order");
const TrackingUpdate = require("../models/TrackingUpdate");
const Document = require("../models/Document");

const generateInvoicePdf = (fileName = "sample-invoice.pdf") => {
  const uploadsDir = path.join(__dirname, "..", "uploads", "documents");
  fs.mkdirSync(uploadsDir, { recursive: true });

  const targetPath = path.join(uploadsDir, fileName);
  const doc = new PDFDocument({ size: "A4", layout: "portrait", margin: 0 });
  const stream = fs.createWriteStream(targetPath);
  doc.pipe(stream);

  const pageWidth = 595;
  const pageHeight = 842;
  const margin = 36;
  const contentX = 36;
  const contentWidth = 523;
  const contentRight = 559;

  const tableX = 36;
  const columns = {
    description: { x: 36, width: 230 },
    quantity: { x: 266, width: 70 },
    rate: { x: 336, width: 105 },
    amount: { x: 441, width: 118 },
  };

  const totalBoxX = 340;
  const totalBoxWidth = 219;

  doc.fillColor("#EAF1F8").rect(0, 0, pageWidth, pageHeight).fill();

  doc.fillColor("#0F172A").rect(contentX, 34, contentWidth, 78).fill();
  doc.fillColor("#FFFFFF").font("Helvetica-Bold").fontSize(22).text("AAYUSH LOGISTICS", contentX + 16, 52, {
    width: 250,
    height: 24,
    lineBreak: false,
  });
  doc.fillColor("#DDEEFF").font("Helvetica").fontSize(8.5).text("Reliable Transport & Delivery Services", contentX + 16, 76, {
    width: 240,
    height: 12,
    lineBreak: false,
  });
  doc.fillColor("#FFFFFF").font("Helvetica-Bold").fontSize(18).text("TAX INVOICE", 430, 52, {
    width: 105,
    align: "right",
    lineBreak: false,
  });

  const infoY = 134;
  const infoCardHeight = 82;
  const infoCardWidth = (contentWidth - 18) / 2;
  const leftInfoX = contentX;
  const rightInfoX = contentX + infoCardWidth + 18;

  doc.fillColor("#F1F5F9").roundedRect(leftInfoX, infoY, infoCardWidth, infoCardHeight, 8).fill();
  doc.fillColor("#0F172A").font("Helvetica-Bold").fontSize(10).text("Invoice No.", leftInfoX + 14, infoY + 14, { width: 70 });
  doc.fillColor("#0F172A").font("Helvetica").fontSize(9.5).text("INV-2026-0001", leftInfoX + 110, infoY + 14, { width: 90 });
  doc.fillColor("#0F172A").font("Helvetica-Bold").fontSize(10).text("LR Number", leftInfoX + 14, infoY + 31, { width: 70 });
  doc.fillColor("#0F172A").font("Helvetica").fontSize(9.5).text("ALR-2026-0001", leftInfoX + 110, infoY + 31, { width: 100 });
  doc.fillColor("#0F172A").font("Helvetica-Bold").fontSize(10).text("Booking Date", leftInfoX + 14, infoY + 48, { width: 75 });
  doc.fillColor("#0F172A").font("Helvetica").fontSize(9.5).text("15 Sep 2026", leftInfoX + 110, infoY + 48, { width: 90 });

  doc.fillColor("#F1F5F9").roundedRect(rightInfoX, infoY, infoCardWidth, infoCardHeight, 8).fill();
  doc.fillColor("#0F172A").font("Helvetica-Bold").fontSize(10).text("Invoice Date", rightInfoX + 14, infoY + 14, { width: 70 });
  doc.fillColor("#0F172A").font("Helvetica").fontSize(9.5).text("15 Sep 2026", rightInfoX + 110, infoY + 14, { width: 90 });
  doc.fillColor("#0F172A").font("Helvetica-Bold").fontSize(10).text("Payment Status", rightInfoX + 14, infoY + 31, { width: 90 });
  doc.fillColor("#2FBF6C").roundedRect(rightInfoX + 110, infoY + 28, 48, 17, 4).fill();
  doc.fillColor("#FFFFFF").font("Helvetica-Bold").fontSize(8.5).text("PAID", rightInfoX + 116, infoY + 31, { width: 36, align: "center", lineBreak: false });
  doc.fillColor("#0F172A").font("Helvetica-Bold").fontSize(10).text("Delivery Status", rightInfoX + 14, infoY + 49, { width: 90 });
  doc.fillColor("#2FBF6C").roundedRect(rightInfoX + 110, infoY + 46, 72, 17, 4).fill();
  doc.fillColor("#FFFFFF").font("Helvetica-Bold").fontSize(8.5).text("DELIVERED", rightInfoX + 114, infoY + 49, { width: 64, align: "center", lineBreak: false });

  const clientY = infoY + infoCardHeight + 18;
  const clientCardHeight = 110;

  doc.fillColor("#F1F5F9").roundedRect(leftInfoX, clientY, infoCardWidth, clientCardHeight, 8).fill();
  doc.fillColor("#0F172A").font("Helvetica-Bold").fontSize(11).text("Bill To", leftInfoX + 16, clientY + 12, { width: 80 });
  doc.fillColor("#0F172A").font("Helvetica-Bold").fontSize(15).text("Kshitija Renuke", leftInfoX + 16, clientY + 28, { width: 180 });
  doc.fillColor("#0F172A").font("Helvetica").fontSize(9.5).text("+91 98765 43210", leftInfoX + 16, clientY + 48, { width: 150 });
  doc.fillColor("#0F172A").font("Helvetica").fontSize(9.3).text("123, Shanti Nagar, Pune, Maharashtra – 411001, India", leftInfoX + 16, clientY + 66, { width: 200 });

  doc.fillColor("#F1F5F9").roundedRect(rightInfoX, clientY, infoCardWidth, clientCardHeight, 8).fill();
  doc.fillColor("#0F172A").font("Helvetica-Bold").fontSize(11).text("Shipment Information", rightInfoX + 16, clientY + 12, { width: 150 });
  doc.fillColor("#0F172A").font("Helvetica-Bold").fontSize(9.2).text("From", rightInfoX + 16, clientY + 30, { width: 30 });
  doc.fillColor("#0F172A").font("Helvetica").fontSize(9.2).text("Mumbai, Maharashtra", rightInfoX + 52, clientY + 30, { width: 130 });
  doc.fillColor("#0F172A").font("Helvetica-Bold").fontSize(9.2).text("To", rightInfoX + 16, clientY + 46, { width: 20 });
  doc.fillColor("#0F172A").font("Helvetica").fontSize(9.2).text("Pune, Maharashtra", rightInfoX + 52, clientY + 46, { width: 130 });
  doc.fillColor("#0F172A").font("Helvetica-Bold").fontSize(9.2).text("Goods Type", rightInfoX + 16, clientY + 62, { width: 60 });
  doc.fillColor("#0F172A").font("Helvetica").fontSize(9.2).text("Electronics", rightInfoX + 92, clientY + 62, { width: 80 });
  doc.fillColor("#0F172A").font("Helvetica-Bold").fontSize(9.2).text("Weight", rightInfoX + 16, clientY + 78, { width: 50 });
  doc.fillColor("#0F172A").font("Helvetica").fontSize(9.2).text("120 kg", rightInfoX + 92, clientY + 78, { width: 50 });
  doc.fillColor("#0F172A").font("Helvetica-Bold").fontSize(9.2).text("Vehicle Type", rightInfoX + 150, clientY + 62, { width: 68 });
  doc.fillColor("#0F172A").font("Helvetica").fontSize(9.2).text("Mini Truck", rightInfoX + 224, clientY + 62, { width: 70 });
  doc.fillColor("#0F172A").font("Helvetica-Bold").fontSize(9.2).text("Driver Name", rightInfoX + 150, clientY + 78, { width: 68 });
  doc.fillColor("#0F172A").font("Helvetica").fontSize(9.2).text("Ramesh Patil", rightInfoX + 224, clientY + 78, { width: 70 });

  const tableY = clientY + clientCardHeight + 18;
  const tableHeight = 154;
  const tableTop = tableY;

  doc.fillColor("#F1F5F9").roundedRect(tableX, tableY, contentWidth, tableHeight, 8).fill();
  doc.fillColor("#0F172A").font("Helvetica-Bold").fontSize(9).text("Description", columns.description.x + 12, tableTop + 12, { width: columns.description.width - 12, lineBreak: false });
  doc.fillColor("#0F172A").font("Helvetica-Bold").fontSize(9).text("Quantity", columns.quantity.x + 4, tableTop + 12, { width: columns.quantity.width, align: "center", lineBreak: false });
  doc.fillColor("#0F172A").font("Helvetica-Bold").fontSize(9).text("Rate", columns.rate.x + 6, tableTop + 12, { width: columns.rate.width - 6, align: "right", lineBreak: false });
  doc.fillColor("#0F172A").font("Helvetica-Bold").fontSize(9).text("Amount", columns.amount.x + 2, tableTop + 12, { width: columns.amount.width - 2, align: "right", lineBreak: false });
  doc.strokeColor("#D7E4F4").lineWidth(1).moveTo(tableX, tableTop + 28).lineTo(contentRight, tableTop + 28).stroke();

  const chargeRows = [
    { description: "Transport Charge", qty: "1", rate: "₹ 4,000", amount: "₹ 4,000" },
    { description: "Handling Charge", qty: "1", rate: "₹ 320", amount: "₹ 320" },
    { description: "GST (18%)", qty: "1", rate: "₹ 400", amount: "₹ 400" },
  ];

  chargeRows.forEach((row, index) => {
    const rowY = tableTop + 36 + index * 32;
    doc.fillColor("#0F172A").font("Helvetica").fontSize(9).text(row.description, columns.description.x + 12, rowY, { width: columns.description.width - 12, lineBreak: false });
    doc.fillColor("#0F172A").font("Helvetica").fontSize(9).text(row.qty, columns.quantity.x, rowY, { width: columns.quantity.width, align: "center", lineBreak: false });
    doc.fillColor("#0F172A").font("Helvetica").fontSize(9).text(row.rate, columns.rate.x, rowY, { width: columns.rate.width, align: "right", lineBreak: false });
    doc.fillColor("#0F172A").font("Helvetica").fontSize(9).text(row.amount, columns.amount.x, rowY, { width: columns.amount.width, align: "right", lineBreak: false });
    doc.strokeColor("#D7E4F4").moveTo(tableX, rowY + 14).lineTo(contentRight, rowY + 14).stroke();
  });

  const totalsY = tableY + tableHeight + 18;
  doc.fillColor("#0F172A").font("Helvetica-Bold").fontSize(9).text("Remarks", tableX, totalsY, { width: 60 });
  doc.fillColor("#0F172A").font("Helvetica").fontSize(9).text("Goods delivered in good condition.", tableX + 70, totalsY, { width: 190, lineBreak: false });

  const totalBoxY = totalsY + 26;
  const totalBoxHeight = 52;
  doc.fillColor("#F1F5F9").roundedRect(totalBoxX, totalBoxY, totalBoxWidth, totalBoxHeight, 8).fill();
  doc.fillColor("#0F172A").font("Helvetica-Bold").fontSize(9).text("Subtotal", totalBoxX + 18, totalBoxY + 12, { width: 110, align: "left", lineBreak: false });
  doc.fillColor("#0F172A").font("Helvetica").fontSize(9).text("₹ 4,320", totalBoxX + 130, totalBoxY + 12, { width: 70, align: "right", lineBreak: false });
  doc.fillColor("#0F172A").font("Helvetica-Bold").fontSize(9).text("GST (18%)", totalBoxX + 18, totalBoxY + 28, { width: 110, align: "left", lineBreak: false });
  doc.fillColor("#0F172A").font("Helvetica").fontSize(9).text("₹ 400", totalBoxX + 130, totalBoxY + 28, { width: 70, align: "right", lineBreak: false });

  doc.fillColor("#2563EB").roundedRect(totalBoxX, totalBoxY + 52, totalBoxWidth, 28, 8).fill();
  doc.fillColor("#FFFFFF").font("Helvetica-Bold").fontSize(11).text("Grand Total", totalBoxX + 18, totalBoxY + 59, { width: 120, align: "left", lineBreak: false });
  doc.fillColor("#FFFFFF").font("Helvetica-Bold").fontSize(11).text("₹ 4,720", totalBoxX + 110, totalBoxY + 59, { width: 90, align: "right", lineBreak: false });

  const footerY = 780;
  doc.fillColor("#0F172A").font("Helvetica-Bold").fontSize(10).text("Thank you for choosing Aayush Logistics.", contentX, footerY, { width: 250, lineBreak: false });
  doc.fillColor("#0F172A").font("Helvetica").fontSize(8.5).text("This is a computer-generated invoice.", 355, footerY, { width: 200, align: "right", lineBreak: false });

  doc.end();
  return `/uploads/documents/${fileName}`;
};

const run = async () => {
  await connectDB();
  console.log("Clearing existing data...");
  await Promise.all([
    User.deleteMany({}),
    Order.deleteMany({}),
    TrackingUpdate.deleteMany({}),
    Document.deleteMany({}),
  ]);

  console.log("Creating users...");
  const admin = await User.create({
    name: "Aayush Sharma",
    email: "admin@aayushlogistics.com",
    phone: "9876543210",
    password: "admin123",
    role: "admin",
  });

  const client1 = await User.create({
    name: "Kshitija Patil",
    email: "kshitija@example.com",
    phone: "9822011223",
    password: "client123",
    role: "client",
  });

  const client2 = await User.create({
    name: "Rohan Mehta",
    email: "rohan@example.com",
    phone: "9911223344",
    password: "client123",
    role: "client",
  });

  console.log("Creating orders...");

  const orders = [
    {
      clientId: client1._id,
      lrNumber: "ALR-2026-0001",
      pickupDetails: { address: "MG Road, Shivajinagar", city: "Pune", contactName: "Kshitija Patil", contactNumber: "9822011223", pickupDate: new Date("2025-08-24"), lat: 18.5204, lng: 73.8567 },
      deliveryDetails: { address: "Andheri East", city: "Mumbai", receiverName: "Vikas Rao", receiverPhone: "9833344556", lat: 19.076, lng: 72.8777 },
      goodsDetails: { category: "Electronics", description: "Laptops and accessories", weightKg: 120, numPackages: 6, estimatedValue: 250000 },
      vehicleType: "Truck",
      estimatedAmount: 2100,
      paymentMethod: "UPI",
      paymentReference: "UPI2026081234",
      paymentStatus: "Verified",
      shipmentStatus: "In Transit",
      driverName: "Suresh Yadav",
      vehicleNumber: "MH12 AB 3456",
      estimatedDeliveryDate: new Date("2025-08-28"),
      currentLocation: { name: "Lonavala, Maharashtra", lat: 18.7546, lng: 73.4062, updatedAt: new Date("2025-08-25T11:20:00") },
    },
    {
      clientId: client2._id,
      lrNumber: "ALR-2026-0002",
      pickupDetails: { address: "Karol Bagh", city: "Delhi", contactName: "Rohan Mehta", contactNumber: "9911223344", pickupDate: new Date("2025-08-22"), lat: 28.6519, lng: 77.1909 },
      deliveryDetails: { address: "Whitefield", city: "Bangalore", receiverName: "Ananya Iyer", receiverPhone: "9845567788", lat: 12.9698, lng: 77.75 },
      goodsDetails: { category: "Machinery", description: "Industrial spare parts", weightKg: 800, numPackages: 12, estimatedValue: 500000 },
      vehicleType: "Container",
      estimatedAmount: 6200,
      paymentMethod: "Bank Transfer",
      paymentReference: "TXN99887766",
      paymentStatus: "Verified",
      shipmentStatus: "Picked Up",
      driverName: "Manoj Kumar",
      vehicleNumber: "DL8C CA 1122",
      estimatedDeliveryDate: new Date("2025-08-29"),
      currentLocation: { name: "Karol Bagh, Delhi", lat: 28.6519, lng: 77.1909, updatedAt: new Date("2025-08-22T18:30:00") },
    },
    {
      clientId: client1._id,
      lrNumber: "ALR-2026-0003",
      pickupDetails: { address: "Bandra West", city: "Mumbai", contactName: "Kshitija Patil", contactNumber: "9822011223", pickupDate: new Date("2025-08-18"), lat: 19.0596, lng: 72.8295 },
      deliveryDetails: { address: "Navrangpura", city: "Ahmedabad", receiverName: "Priya Shah", receiverPhone: "9909988776", lat: 23.0338, lng: 72.5622 },
      goodsDetails: { category: "Clothing", description: "Garment bulk consignment", weightKg: 300, numPackages: 20, estimatedValue: 150000 },
      vehicleType: "Truck",
      estimatedAmount: 2900,
      paymentMethod: "UPI",
      paymentReference: "UPI2026080987",
      paymentStatus: "Verified",
      shipmentStatus: "Delivered",
      driverName: "Ramesh Patil",
      vehicleNumber: "MH04 GT 7788",
      estimatedDeliveryDate: new Date("2025-08-20"),
      currentLocation: { name: "Navrangpura, Ahmedabad", lat: 23.0338, lng: 72.5622, updatedAt: new Date("2025-08-20T15:00:00") },
    },
    {
      clientId: client2._id,
      lrNumber: "ALR-2026-0004",
      pickupDetails: { address: "T Nagar", city: "Chennai", contactName: "Rohan Mehta", contactNumber: "9911223344", pickupDate: new Date("2025-08-16"), lat: 13.0418, lng: 80.2341 },
      deliveryDetails: { address: "Gachibowli", city: "Hyderabad", receiverName: "Kiran Reddy", receiverPhone: "9866554433", lat: 17.4401, lng: 78.3489 },
      goodsDetails: { category: "Machinery", description: "CNC machine parts", weightKg: 950, numPackages: 8, estimatedValue: 700000 },
      vehicleType: "Container",
      estimatedAmount: 6800,
      paymentMethod: "Bank Transfer",
      paymentReference: "TXN11228899",
      paymentStatus: "Verified",
      shipmentStatus: "Delivered",
      driverName: "Arjun Nair",
      vehicleNumber: "TN09 BQ 4521",
      estimatedDeliveryDate: new Date("2025-08-18"),
      currentLocation: { name: "Gachibowli, Hyderabad", lat: 17.4401, lng: 78.3489, updatedAt: new Date("2025-08-18T13:10:00") },
    },
    {
      clientId: client1._id,
      pickupDetails: { address: "Salt Lake Sector 5", city: "Kolkata", contactName: "Kshitija Patil", contactNumber: "9822011223", pickupDate: new Date("2025-08-17"), lat: 22.5726, lng: 88.4341 },
      deliveryDetails: { address: "Kothrud", city: "Pune", receiverName: "Nikhil Joshi", receiverPhone: "9822993344", lat: 18.5074, lng: 73.8077 },
      goodsDetails: { category: "Other", description: "Retail goods consignment", weightKg: 200, numPackages: 15, estimatedValue: 90000 },
      vehicleType: "Tempo",
      estimatedAmount: 2000,
      paymentMethod: "Cash",
      paymentReference: "",
      paymentStatus: "Pending Verification",
      shipmentStatus: "Booked",
    },
  ];

  const createdOrders = await Order.insertMany(orders);

  console.log("Creating tracking history for in-transit order...");
  const order1 = createdOrders[0];
  await TrackingUpdate.insertMany([
    { orderId: order1._id, locationName: "Pune Warehouse", latitude: 18.5204, longitude: 73.8567, status: "Booked", remarks: "Order confirmed", updatedAt: new Date("2025-08-24T10:15:00") },
    { orderId: order1._id, locationName: "Pune Warehouse", latitude: 18.5204, longitude: 73.8567, status: "Picked Up", remarks: "Goods picked up from sender", updatedAt: new Date("2025-08-24T18:30:00") },
    { orderId: order1._id, locationName: "Lonavala, Maharashtra", latitude: 18.7546, longitude: 73.4062, status: "In Transit", remarks: "In transit towards Mumbai", updatedAt: new Date("2025-08-25T11:20:00") },
  ]);

  const order3 = createdOrders[2];
  await TrackingUpdate.insertMany([
    { orderId: order3._id, locationName: "Mumbai Warehouse", latitude: 19.0596, longitude: 72.8295, status: "Booked", remarks: "Order confirmed", updatedAt: new Date("2025-08-18T09:00:00") },
    { orderId: order3._id, locationName: "Mumbai Warehouse", latitude: 19.0596, longitude: 72.8295, status: "Picked Up", remarks: "Goods picked up", updatedAt: new Date("2025-08-18T14:00:00") },
    { orderId: order3._id, locationName: "Vadodara, Gujarat", latitude: 22.3072, longitude: 73.1812, status: "In Transit", remarks: "Highway transit", updatedAt: new Date("2025-08-19T10:00:00") },
    { orderId: order3._id, locationName: "Navrangpura, Ahmedabad", latitude: 23.0338, longitude: 72.5622, status: "Delivered", remarks: "Delivered to receiver", updatedAt: new Date("2025-08-20T15:00:00") },
  ]);

  console.log("Creating sample document for delivered order...");
  const sampleDocumentUrl = generateInvoicePdf();
  await Document.create({
    orderId: order3._id,
    documentType: "Invoice",
    fileName: "sample-invoice.pdf",
    fileUrl: sampleDocumentUrl,
  });

  console.log("Seed complete.");
  console.log("Admin login: admin@aayushlogistics.com / admin123");
  console.log("Client login: kshitija@example.com / client123");
  console.log("Client login: rohan@example.com / client123");

  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
