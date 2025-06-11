const { body } = require("express-validator");
  const {
    httpCreateCategories,
    httpGetAllCategories,
    httpUpdateCategories,
    httpGetCategoriesById,
    httpDeleteCategoriesById,
  } = require("./categories.controller");
  
  const router = require("express").Router();
  
  router.get("/", httpGetAllCategories);
  router.get("/:id", httpGetCategoriesById);
  router.post(
    "/",
    body("name")
  .trim()
  .notEmpty()
  .isString()
  .withMessage("name is not valid"),body("description")
  .trim()
  .notEmpty()
  .isString()
  .withMessage("description is not valid"),
    httpCreateCategories
  );
  
  router.put(
    "/:id",
    body("name")
  .trim()
  .notEmpty()
  .isString()
  .withMessage("name is not valid"),body("description")
  .trim()
  .notEmpty()
  .isString()
  .withMessage("description is not valid"),
    httpUpdateCategories
  );
  
  router.delete("/:id", httpDeleteCategoriesById);
  
  router.use((req, res) => {
    res.status(404).json({ message: "Route not Found !" });
  });
  
  module.exports = router;
  