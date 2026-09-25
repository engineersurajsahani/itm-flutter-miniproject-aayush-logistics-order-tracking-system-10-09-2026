const multer = require("multer");
const path = require("path");
const fs = require("fs");

const makeStorage = (subfolder) => {
  const dir = path.join(__dirname, "..", "uploads", subfolder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, dir),
    filename: (req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${unique}${path.extname(file.originalname)}`);
    },
  });
};

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|pdf/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  if (ext) return cb(null, true);
  cb(new Error("Only images and PDF files are allowed"));
};

const uploadPayment = multer({
  storage: makeStorage("payments"),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const uploadDocument = multer({
  storage: makeStorage("documents"),
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

module.exports = { uploadPayment, uploadDocument };
