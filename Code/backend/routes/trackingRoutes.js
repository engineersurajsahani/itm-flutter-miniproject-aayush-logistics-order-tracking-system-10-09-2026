const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const allowRoles = require("../middleware/role");
const { addTrackingUpdate, getTrackingHistory } = require("../controllers/trackingController");

router.use(protect);

router.post("/:orderId", allowRoles("admin"), addTrackingUpdate);
router.get("/:orderId", getTrackingHistory);

module.exports = router;
