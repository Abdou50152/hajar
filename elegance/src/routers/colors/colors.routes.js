const { body } = require("express-validator");
const {
  httpCreateColor,
  httpGetAllColors,
  httpGetColorById,
  httpUpdateColor,
  httpDeleteColorById,
} = require("./colors.controller");

const router = require("express").Router();

// GET all colors
router.get("/", httpGetAllColors);

// GET color by ID
router.get("/:id", httpGetColorById);

// POST create new color
router.post(
  "/",
  body("name")
    .trim()
    .notEmpty()
    .isString()
    .withMessage("Name must be a valid string"),
  body("code")
    .trim()
    .notEmpty()
    .isString()
    .withMessage("Code must be a valid string"),
  httpCreateColor
);

// PUT update color
router.put(
  "/:id",
  body("name")
    .trim()
    .notEmpty()
    .isString()
    .withMessage("Name must be a valid string"),
  body("code")
    .trim()
    .notEmpty()
    .isString()
    .withMessage("Code must be a valid string"),
  httpUpdateColor
);

// DELETE color by ID
router.delete("/:id", httpDeleteColorById);

// 404 fallback
router.use((req, res) => {
  res.status(404).json({ message: "Route not Found !" });
});

module.exports = router;
