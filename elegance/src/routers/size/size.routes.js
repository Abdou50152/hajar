const { body } = require("express-validator");
const {
  httpCreateSize,
  httpGetAllSizes,
  httpGetSizeById,
  httpUpdateSize,
  httpDeleteSizeById,
} = require("./size.controller");

const router = require("express").Router();

// GET all sizes
router.get("/", httpGetAllSizes);

// GET size by ID
router.get("/:id", httpGetSizeById);

// POST create new size
router.post(
  "/",
  body("name")
    .trim()
    .notEmpty()
    .isString()
    .withMessage("Name must be a valid string"),
  body("description")
    .trim()
    .optional()
    .isString()
    .withMessage("Description must be a string"),
  httpCreateSize
);

// PUT update size
router.put(
  "/:id",
  body("name")
    .trim()
    .notEmpty()
    .isString()
    .withMessage("Name must be a valid string"),
  body("description")
    .trim()
    .optional()
    .isString()
    .withMessage("Description must be a string"),
  httpUpdateSize
);

// DELETE size by ID
router.delete("/:id", httpDeleteSizeById);

// 404 fallback
router.use((req, res) => {
  res.status(404).json({ message: "Route not Found !" });
});

module.exports = router;
