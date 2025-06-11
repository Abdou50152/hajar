const { body, validationResult } = require("express-validator");
const express = require("express");
const router = express.Router();

const {
  httpCreateOrderProducts,
  httpGetAllOrderProducts,
  httpGetOrderProductsById,
  httpUpdateOrderProducts,
  httpDeleteOrderProductsById,
} = require("./orderProducts.controller");

// Middleware pour gérer les erreurs de validation
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// GET all order-products
router.get("/", httpGetAllOrderProducts);

// GET single order-product by ID
router.get("/:id", httpGetOrderProductsById);

// POST create new order-product
router.post(
  "/",
  [
    body("orderId")
      .notEmpty()
      .withMessage("Order ID is required")
      .isInt({ min: 1 })
      .withMessage("Order ID must be a valid integer"),
    body("productId")
      .notEmpty()
      .withMessage("Product ID is required")
      .isInt({ min: 1 })
      .withMessage("Product ID must be a valid integer"),
    body("quantity")
      .notEmpty()
      .withMessage("Quantity is required")
      .isInt({ min: 1 })
      .withMessage("Quantity must be a positive integer"),
    body("price")
      .notEmpty()
      .withMessage("Price is required")
      .isFloat({ min: 0 })
      .withMessage("Price must be a valid number"),
    validate,
  ],
  httpCreateOrderProducts
);

// PUT update order-product
router.put(
  "/:id",
  [
    body("orderId")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Order ID must be a valid integer"),
    body("productId")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Product ID must be a valid integer"),
    body("quantity")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Quantity must be a positive integer"),
    body("price")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Price must be a valid number"),
    validate,
  ],
  httpUpdateOrderProducts
);

// DELETE order-product by ID
router.delete("/:id", httpDeleteOrderProductsById);

// Fallback 404
router.use((req, res) => {
  res.status(404).json({ message: "Route not found!" });
});

module.exports = router;
