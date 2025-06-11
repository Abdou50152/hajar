const { body } = require("express-validator");
const {
  httpCreateOrder,
  httpGetAllOrders,
  httpGetOrderById,
  httpUpdateOrder,
  httpDeleteOrderById,
} = require("./orders.controller");

const router = require("express").Router();

// GET all orders
router.get("/", httpGetAllOrders);

// GET order by ID
router.get("/:id", httpGetOrderById);

// POST create new order
router.post(
  "/",
  body("reference")
    .trim()
    .notEmpty()
    .withMessage("Reference is required"),
  body("date")
    .notEmpty()
    .isISO8601()
    .withMessage("Date must be a valid ISO8601 date"),
  body("total")
    .notEmpty()
    .isNumeric()
    .withMessage("Total must be a number"),
  body("status")
    .trim()
    .notEmpty()
    .isIn(["new", "confirmed", "pending", "shipped", "refunded"])
    .withMessage(
      "Status must be one of: new, confirmed, pending, shipped, refunded"
    ),
  httpCreateOrder
);

// PUT update order
router.put(
  "/:id",
  body("reference")
    .trim()
    .notEmpty()
    .withMessage("Reference is required"),
  body("date")
    .notEmpty()
    .isISO8601()
    .withMessage("Date must be a valid ISO8601 date"),
  body("total")
    .notEmpty()
    .isNumeric()
    .withMessage("Total must be a number"),
  body("status")
    .trim()
    .notEmpty()
    .isIn(["new", "confirmed", "pending", "shipped", "refunded"])
    .withMessage(
      "Status must be one of: new, confirmed, pending, shipped, refunded"
    ),
  httpUpdateOrder
);

// DELETE order by ID
router.delete("/:id", httpDeleteOrderById);

// Fallback route
router.use((req, res) => {
  res.status(404).json({ message: "Route not Found !" });
});

module.exports = router;
