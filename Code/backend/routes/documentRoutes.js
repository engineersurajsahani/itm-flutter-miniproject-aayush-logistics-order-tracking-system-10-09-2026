const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const allowRoles = require("../middleware/role");
const { uploadDocument } = require("../middleware/upload");
const { uploadDocument: uploadDocumentCtrl, getDocuments, deleteDocument } = require("../controllers/documentController");

router.use(protect);

router.post("/:orderId", allowRoles("admin"), uploadDocument.single("file"), uploadDocumentCtrl);
router.get("/:orderId", getDocuments);
router.delete("/:documentId", allowRoles("admin"), deleteDocument);

module.exports = router;
