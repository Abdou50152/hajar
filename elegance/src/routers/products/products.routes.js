const { body } = require("express-validator");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  httpCreateProducts,
  httpGetAllProducts,
  httpUpdateProducts,
  httpGetProductsById,
  httpDeleteProductsById,
  httpGetProductColors,
  httpAddColorToProduct,
  httpRemoveColorFromProduct,
  httpGetProductSizes,
  httpAddSizeToProduct,
  httpRemoveSizeFromProduct,
  httpUploadProductImage
} = require("./products.controller");

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
  
  router.get("/", httpGetAllProducts);
  router.get("/:id", httpGetProductsById);
  router.post(
    "/",
    body("stock")
  .notEmpty()
  .isInt()
  .withMessage("stock is required"),body("price")
  .notEmpty()
  .isFloat({ min: 0})
  .withMessage("price is required"),body("description")
  .trim()
  .notEmpty()
  .isString()
  .withMessage("description is not valid"),body("name")
  .trim()
  .notEmpty()
  .isString()
  .withMessage("name is not valid"),
    httpCreateProducts
  );
  
  router.put(
    "/:id",
    body("stock")
  .notEmpty()
  .isInt()
  .withMessage("stock is required"),body("price")
  .notEmpty()
  .isFloat({ min: 0})
  .withMessage("price is required"),body("description")
  .trim()
  .notEmpty()
  .isString()
  .withMessage("description is not valid"),body("name")
  .trim()
  .notEmpty()
  .isString()
  .withMessage("name is not valid"),
    httpUpdateProducts
  );
  
  router.delete("/:id", httpDeleteProductsById);

  // Product colors routes
  router.get("/:id/colors", httpGetProductColors);
  router.post("/:id/colors", body("colorId").isInt().withMessage("colorId must be an integer"), httpAddColorToProduct);
  router.delete("/:id/colors/:colorId", httpRemoveColorFromProduct);

  // Product sizes routes
  router.get("/:id/sizes", httpGetProductSizes);
  router.post("/:id/sizes", body("sizeId").isInt().withMessage("sizeId must be an integer"), httpAddSizeToProduct);
  router.delete("/:id/sizes/:sizeId", httpRemoveSizeFromProduct);

  // Product image upload route
  router.post("/:id/image", upload.single('image'), httpUploadProductImage);
  
  router.use((req, res) => {
    res.status(404).json({ message: "Route not Found !" });
  });
  
  module.exports = router;
  