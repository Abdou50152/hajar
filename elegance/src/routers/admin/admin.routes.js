const { body } = require("express-validator");
const {
  httpCreateAdmin,
  httpGetAllAdmins,
  httpGetAdminById,
  httpUpdateAdmin,
  httpDeleteAdminById,
} = require("./admin.controller");

const router = require("express").Router();

// GET all admins
router.get("/", httpGetAllAdmins);

// GET admin by ID
router.get("/:id", httpGetAdminById);

// POST create new admin
router.post(
  "/",
  body("full_name")
    .trim()
    .notEmpty()
    .isString()
    .withMessage("Full name is not valid"),
  body("phone")
    .trim()
    .notEmpty()
    .isMobilePhone()
    .withMessage("Phone is not valid"),
  body("email")
    .trim()
    .notEmpty()
    .isEmail()
    .withMessage("Email is not valid"),
  body("password")
    .trim()
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("status")
    .trim()
    .notEmpty()
    .isIn(["active", "inactive"])
    .withMessage("Status must be 'active' or 'inactive'"),
  httpCreateAdmin
);

// PUT update admin
router.put(
  "/:id",
  body("full_name")
    .trim()
    .notEmpty()
    .isString()
    .withMessage("Full name is not valid"),
  body("phone")
    .trim()
    .notEmpty()
    .isMobilePhone()
    .withMessage("Phone is not valid"),
  body("email")
    .trim()
    .notEmpty()
    .isEmail()
    .withMessage("Email is not valid"),
  body("status")
    .trim()
    .notEmpty()
    .isIn(["active", "inactive"])
    .withMessage("Status must be 'active' or 'inactive'"),
  httpUpdateAdmin
);

// DELETE admin by ID
router.delete("/:id", httpDeleteAdminById);

// 404 fallback
router.use((req, res) => {
  res.status(404).json({ message: "Route not Found !" });
});
router.get("/", (req, res) => {
  res.json({ message: "Admin route is working!" });
});

module.exports = router;
