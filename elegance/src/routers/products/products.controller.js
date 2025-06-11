const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");

const {
  createProducts,
  getAllProducts,
  getProductsById,
  updateProducts,
  deleteProductsById,
  getProductColors,
  addColorToProduct,
  removeColorFromProduct,
  getProductSizes,
  addSizeToProduct,
  removeSizeFromProduct,
  updateProductImage
} = require("../../models/products/products.model");
const { getPagination } = require("../../config/query");
  
  const httpCreateProducts = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      const products = req.body;
      try {
        const newProducts = await createProducts(products);
        return res.status(200).json(newProducts);
      } catch (err) {
        next(err);
      }
    }
  };
  
  const httpGetAllProducts = async (req, res, next) => {
    try {
      const { skip, limit } = getPagination(req.query);
      const list = await getAllProducts(skip, limit);
      return res.status(200).json(list);
    } catch (err) {
      next(err);
    }
  };
  
  const httpGetProductsById = async (req, res, next) => {
    try {
      let { id } = req.params;
      const productsById = await getProductsById(id);
      return res.status(200).json(productsById);
    } catch (err) {
      next(err);
    }
  };
  
  const httpUpdateProducts = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const id = req.params.id;
      const newProducts = { ...req.body, id };
      const updatedProducts = await updateProducts(newProducts);
      return res.status(200).json(updatedProducts);
    } catch (err) {
      next(err);
    }
  };
  
  const httpDeleteProductsById = async (req, res, next) => {
    try {
      let { id } = req.params;
      await deleteProductsById(id);
      return res.status(201).json({ message: "Deleted successfully" });
    } catch (err) {
      next(err);
    }
  };
// Get product colors
const httpGetProductColors = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const colors = await getProductColors(productId);
    return res.status(200).json({ colors });
  } catch (err) {
    next(err);
  }
};

// Add color to product
const httpAddColorToProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const productId = req.params.id;
    const { colorId } = req.body;
    
    const result = await addColorToProduct(productId, colorId);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

// Remove color from product
const httpRemoveColorFromProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const colorId = req.params.colorId;
    
    const result = await removeColorFromProduct(productId, colorId);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

// Get product sizes
const httpGetProductSizes = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const sizes = await getProductSizes(productId);
    return res.status(200).json({ sizes });
  } catch (err) {
    next(err);
  }
};

// Add size to product
const httpAddSizeToProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const productId = req.params.id;
    const { sizeId } = req.body;
    
    const result = await addSizeToProduct(productId, sizeId);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

// Remove size from product
const httpRemoveSizeFromProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const sizeId = req.params.sizeId;
    
    const result = await removeSizeFromProduct(productId, sizeId);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

// Upload product image
const httpUploadProductImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }
    
    const productId = req.params.id;
    
    try {
      // First check if product exists
      await getProductsById(productId);
      
      // Update product with image URL
      const imageUrl = `/uploads/products/${req.file.filename}`;
      const result = await updateProductImage(productId, imageUrl);
      
      return res.status(200).json(result);
    } catch (error) {
      // Remove uploaded file if product doesn't exist
      if (req.file && req.file.path) {
        fs.unlinkSync(req.file.path);
      }
      throw error;
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
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
};