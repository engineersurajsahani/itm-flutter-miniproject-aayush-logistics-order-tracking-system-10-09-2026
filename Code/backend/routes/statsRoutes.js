const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const allowRoles = require("../middleware/role");
const { clientStats, adminStats, listClients } = require("../controllers/statsController");

router.use(protect);

router.get("/client", allowRoles("client"), clientStats);
router.get("/admin", allowRoles("admin"), adminStats);
router.get("/clients", allowRoles("admin"), listClients);

module.exports = router;
