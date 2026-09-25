const Order = require("../models/Order");

// Generates a unique LR number in the format ALR-YYYY-0001
const generateLRNumber = async () => {
  const year = new Date().getFullYear();
  const prefix = `ALR-${year}-`;

  const lastOrder = await Order.findOne({ lrNumber: { $regex: `^${prefix}` } })
    .sort({ lrNumber: -1 })
    .lean();

  let nextSeq = 1;
  if (lastOrder && lastOrder.lrNumber) {
    const lastSeq = parseInt(lastOrder.lrNumber.split("-")[2], 10);
    if (!isNaN(lastSeq)) nextSeq = lastSeq + 1;
  }

  const seqStr = String(nextSeq).padStart(4, "0");
  return `${prefix}${seqStr}`;
};

module.exports = generateLRNumber;
