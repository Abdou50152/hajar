const db = require("..");
const httpError = require("http-errors");
const fs = require("fs");
const path = require("path");

const ProductImages = db.productImages;
const Products = db.products;

// Create product image
const createProductImage = async (productId, imageData) => {
  try {
    const product = await Products.findByPk(productId);
    if (!product) {
      throw httpError.NotFound("Product not found");
    }
    
    const productImage = await ProductImages.create({
      ...imageData,
      productId
    });
    
    return productImage;
  } catch (error) {
    throw error;
  }
};

// Get all images for a product
const getProductImages = async (productId) => {
  try {
    const product = await Products.findByPk(productId);
    if (!product) {
      throw httpError.NotFound("Product not found");
    }
    
    const images = await ProductImages.findAll({
      where: { productId },
      order: [['isPrimary', 'DESC'], ['order', 'ASC']]
    });
    
    return images;
  } catch (error) {
    throw error;
  }
};

// Update product image
const updateProductImage = async (imageId, imageData) => {
  try {
    const productImage = await ProductImages.findByPk(imageId);
    if (!productImage) {
      throw httpError.NotFound("Product image not found");
    }
    
    await productImage.update(imageData);
    return productImage;
  } catch (error) {
    throw error;
  }
};

// Delete product image
const deleteProductImage = async (imageId) => {
  try {
    const productImage = await ProductImages.findByPk(imageId);
    if (!productImage) {
      throw httpError.NotFound("Product image not found");
    }
    
    // Get the file path to delete
    const imagePath = path.join(
      __dirname, 
      "../../../uploads/products", 
      path.basename(productImage.imageUrl)
    );
    
    // Delete the file if it exists
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    
    await productImage.destroy();
    return { message: "Product image deleted successfully" };
  } catch (error) {
    throw error;
  }
};

// Delete all images for a product
const deleteAllProductImages = async (productId) => {
  try {
    const images = await ProductImages.findAll({
      where: { productId }
    });
    
    // Delete each image file
    for (const image of images) {
      const imagePath = path.join(
        __dirname, 
        "../../../uploads/products", 
        path.basename(image.imageUrl)
      );
      
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    // Delete all image records
    await ProductImages.destroy({
      where: { productId }
    });
    
    return { message: "All product images deleted successfully" };
  } catch (error) {
    throw error;
  }
};

// Set primary image
const setPrimaryImage = async (imageId, productId) => {
  try {
    // First, set all images for this product to non-primary
    await ProductImages.update(
      { isPrimary: false },
      { where: { productId } }
    );
    
    // Then set the selected image as primary
    const productImage = await ProductImages.findByPk(imageId);
    if (!productImage) {
      throw httpError.NotFound("Product image not found");
    }
    
    await productImage.update({ isPrimary: true });
    return productImage;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createProductImage,
  getProductImages,
  updateProductImage,
  deleteProductImage,
  deleteAllProductImages,
  setPrimaryImage
};
