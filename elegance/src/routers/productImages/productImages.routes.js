const { body } = require("express-validator");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  httpGetProductImages,
  httpUploadProductImage,
  httpUpdateProductImage,
  httpDeleteProductImage,
  httpDeleteAllProductImages,
  httpSetPrimaryImage,
  httpUploadMultipleProductImages
} = require("./productImages.controller");

const router = require("express").Router();

// Configure multer for file uploads
const uploadsDir = path.join(__dirname, "../../../uploads/products");

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'product-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed"));
  }
});

// Get all images for a product
router.get("/products/:productId/images", httpGetProductImages);

// Upload product image (single)
router.post(
  "/products/:productId/images", 
  upload.single('image'),
  body("isPrimary").optional().isBoolean().withMessage("isPrimary must be a boolean"),
  body("order").optional().isInt().withMessage("order must be an integer"),
  httpUploadProductImage
);

// Upload multiple product images
router.post(
  "/products/:productId/images/bulk", 
  upload.array('images', 10), // Allow up to 10 images at once
  httpUploadMultipleProductImages
);

// Update product image
router.put(
  "/images/:imageId",
  body("isPrimary").optional().isBoolean().withMessage("isPrimary must be a boolean"),
  body("order").optional().isInt().withMessage("order must be an integer"),
  httpUpdateProductImage
);

// Delete product image
router.delete("/images/:imageId", httpDeleteProductImage);

// Delete all images for a product
router.delete("/products/:productId/images", httpDeleteAllProductImages);

// Set primary image
router.put("/products/:productId/images/:imageId/primary", httpSetPrimaryImage);

router.use((req, res) => {
  res.status(404).json({ message: "Product Images Route not Found!" });
});

module.exports = router;
