const { body } = require("express-validator");
  const {
    httpCreateUsers,
    httpGetAllUsers,
    httpUpdateUsers,
    httpGetUsersById,
    httpDeleteUsersById,
  } = require("./users.controller");
  
  const router = require("express").Router();
  
  // GET all Users
router.get("/", httpGetAllUsers);

// GET admin by ID
router.get("/:id", httpGetUsersById);

// POST create new Users
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
 body("shipping_address")
    .trim()
    .notEmpty()
    .isString()
    .withMessage("Shipping address is not valid"),
  body("status")
    .trim()
    .notEmpty()
    .isIn(["active", "inactive"])
    .withMessage("Status must be 'active' or 'inactive'"),
  httpCreateUsers
);

// PUT update Users
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
body("shipping_address")
    .trim()
    .notEmpty()
    .isString()
    .withMessage("Shipping address is not valid"),
  body("status")
    .trim()
    .notEmpty()
    .isIn(["active", "inactive"])
    .withMessage("Status must be 'active' or 'inactive'"),
  httpUpdateUsers
);
  
  router.delete("/:id", httpDeleteUsersById);
  
  router.use((req, res) => {
    res.status(404).json({ message: "Route not Found !" });
  });
  
  module.exports = router;
  