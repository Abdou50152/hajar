const { validationResult } = require("express-validator");

  const {
    createCategories,
    getAllCategories,
    getCategoriesById,
    updateCategories,
    deleteCategoriesById,
  } = require("../../models/categories/categories.model");
  const { getPagination } = require("../../config/query");
  
  const httpCreateCategories = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      const categories = req.body;
      try {
        const newCategories = await createCategories(categories);
        return res.status(200).json(newCategories);
      } catch (err) {
        next(err);
      }
    }
  };
  
  const httpGetAllCategories = async (req, res, next) => {
    try {
      const { skip, limit } = getPagination(req.query);
      const list = await getAllCategories(skip, limit);
      return res.status(200).json(list);
    } catch (err) {
      next(err);
    }
  };
  
  const httpGetCategoriesById = async (req, res, next) => {
    try {
      let { id } = req.params;
      const categoriesById = await getCategoriesById(id);
      return res.status(200).json(categoriesById);
    } catch (err) {
      next(err);
    }
  };
  
  const httpUpdateCategories = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const id = req.params.id;
      const newCategories = { ...req.body, id };
      const updatedCategories = await updateCategories(newCategories);
      return res.status(200).json(updatedCategories);
    } catch (err) {
      next(err);
    }
  };
  
  const httpDeleteCategoriesById = async (req, res, next) => {
    try {
      let { id } = req.params;
      await deleteCategoriesById(id);
      return res.status(201).json({ message: "Deleted successfully" });
    } catch (err) {
      next(err);
    }
  };
  
  module.exports = {
    httpCreateCategories,
    httpGetAllCategories,
    httpUpdateCategories,
    httpGetCategoriesById,
    httpDeleteCategoriesById,
  };
  