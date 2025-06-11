const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");

const {
  createProductImage,
  getProductImages,
  updateProductImage,
  deleteProductImage,
  deleteAllProductImages,
  setPrimaryImage
} = require("../../models/productImages/productImages.model");

// Get all images for a product
const httpGetProductImages = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const images = await getProductImages(productId);
    return res.status(200).json({ images });
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
    
    const productId = req.params.productId;
    const isPrimary = req.body.isPrimary === 'true';
    const order = parseInt(req.body.order || 0);
    
    try {
      // Create image URL
      const imageUrl = `/uploads/products/${req.file.filename}`;
      
      // Create product image record
      const productImage = await createProductImage(productId, {
        imageUrl,
        isPrimary,
        order
      });
      
      // If this is set as primary, update the product's main imageUrl
      if (isPrimary) {
        await setPrimaryImage(productImage.id, productId);
      }
      
      return res.status(201).json({
        message: "Image uploaded successfully",
        image: productImage
      });
    } catch (error) {
      // Remove uploaded file if there's an error
      if (req.file && req.file.path) {
        fs.unlinkSync(req.file.path);
      }
      throw error;
    }
  } catch (err) {
    next(err);
  }
};

// Update product image
const httpUpdateProductImage = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const imageId = req.params.imageId;
    const { isPrimary, order } = req.body;
    
    const productImage = await updateProductImage(imageId, {
      isPrimary: isPrimary === 'true',
      order: parseInt(order || 0)
    });
    
    // If this is set as primary, update all other images
    if (isPrimary === 'true') {
      await setPrimaryImage(imageId, productImage.productId);
    }
    
    return res.status(200).json({
      message: "Image updated successfully",
      image: productImage
    });
  } catch (err) {
    next(err);
  }
};

// Delete product image
const httpDeleteProductImage = async (req, res, next) => {
  try {
    const imageId = req.params.imageId;
    const result = await deleteProductImage(imageId);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

// Delete all images for a product
const httpDeleteAllProductImages = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const result = await deleteAllProductImages(productId);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

// Set primary image
const httpSetPrimaryImage = async (req, res, next) => {
  try {
    const imageId = req.params.imageId;
    const productId = req.params.productId;
    
    const productImage = await setPrimaryImage(imageId, productId);
    
    return res.status(200).json({
      message: "Primary image set successfully",
      image: productImage
    });
  } catch (err) {
    next(err);
  }
};

// Upload multiple product images
const httpUploadMultipleProductImages = async (req, res, next) => {
  try {
    console.log('Received bulk upload request:', { 
      productId: req.params.productId,
      files: req.files ? req.files.length : 'none',
      body: req.body
    });
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No image files provided" });
    }
    
    const productId = req.params.productId;
    const uploadedImages = [];
    const failedUploads = [];
    
    // Process each uploaded file
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      try {
        // Create image URL
        const imageUrl = `/uploads/products/${file.filename}`;
        
        // Create product image record
        const isPrimary = i === 0 && req.files.length > 0; // First image is primary by default
        const productImage = await createProductImage(productId, {
          imageUrl,
          isPrimary,
          order: i
        });
        
        // If this is set as primary, update the product's main imageUrl
        if (isPrimary) {
          await setPrimaryImage(productImage.id, productId);
        }
        
        uploadedImages.push(productImage);
      } catch (error) {
        // If there's an error, add to failed uploads and continue with others
        console.error(`Error uploading image ${i}:`, error);
        failedUploads.push({
          index: i,
          filename: file.originalname,
          error: error.message
        });
        
        // Remove the file if it was uploaded
        if (file.path) {
          fs.unlinkSync(file.path);
        }
      }
    }
    
    return res.status(201).json({
      message: `${uploadedImages.length} images uploaded successfully${failedUploads.length > 0 ? `, ${failedUploads.length} failed` : ''}`,
      images: uploadedImages,
      failed: failedUploads.length > 0 ? failedUploads : undefined
    });
  } catch (err) {
    // Clean up any uploaded files if there's an error
    if (req.files) {
      req.files.forEach(file => {
        if (file.path && fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    next(err);
  }
};

module.exports = {
  httpGetProductImages,
  httpUploadProductImage,
  httpUpdateProductImage,
  httpDeleteProductImage,
  httpDeleteAllProductImages,
  httpSetPrimaryImage,
  httpUploadMultipleProductImages
};
