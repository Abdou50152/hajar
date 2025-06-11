const db = require("..");
const { getProductImages, createProductImage: addProductImageToGallery, setPrimaryImage: setProductPrimaryImage } = require('../productImages/productImages.model');
const httpError = require("http-errors");

const Products = db.products;
const Colors = db.colors;
const Sizes = db.size;
const ProductImages = db.productImages; // Added for include

  //Create Products
  const createProducts = async (newProducts) => {
   const existProducts = await Products.findOne({
      where: {
        name : newProducts.name,
      },
    });
    if (existProducts) {
      throw httpError.Conflict("Product Already exist");
    } else {
      const products = await Products.create(newProducts);
      return products;
    }
  };
  
  //Get All Products
  const getAllProducts = async (skip, limit) => {
    const productsPromise = Products.findAll({
      offset: skip,
      limit: limit,
      include: [
        { model: db.categories },
        { model: Colors },
        { model: Sizes },
        { model: ProductImages } 
      ]
    });
    const countPromise = Products.count();
    let [fetchedProducts, count] = await Promise.all([productsPromise, countPromise]);

    // Process products to add a main imageUrl based on associated product_images
    const processedProducts = fetchedProducts.map(p => {
      const productJson = p.toJSON(); // Work with a plain object
      let mainImageUrl = productJson.imageUrl; // Default to existing imageUrl on product table
      const images = productJson.ProductImages || productJson.productImages || []; // Try common default names (pluralized model name, or exact model name if not pluralized by Sequelize)

      const primaryImage = images.find(img => img.isPrimary);
      if (primaryImage && primaryImage.imageUrl) {
        mainImageUrl = primaryImage.imageUrl;
      } else if (images.length > 0 && images[0].imageUrl) {
        mainImageUrl = images[0].imageUrl; // Fallback to the first image in the gallery
      }
      
      return {
        ...productJson,
        imageUrl: mainImageUrl,
        images: images.map(img => ({ // Ensure 'images' array is consistently structured if needed by frontend
          id: img.id,
          url: img.imageUrl,
          isPrimary: img.isPrimary,
          order: img.order
        }))
      };
    });

    return { count, products: processedProducts };
  };

  
  //Get Products by ID
  const getProductsById = async (id) => {
    const product = await Products.findOne({
      where: {
        id,
      },
      include: [
        { model: db.categories },
        { model: Colors }, 
        { model: Sizes },  
        { model: db.productImages } 
      ]
    });

    if (!product) {
      throw httpError.NotFound("Product Not found");
    }

    let processedGalleryImages = [];
    if (product.productImages && product.productImages.length > 0) {
      processedGalleryImages = product.productImages.map(img => ({
        id: img.id,
        url: img.imageUrl, 
        isPrimary: img.isPrimary || false, 
      }));
    }

    let mainImageUrl = product.imageUrl; 

    if (processedGalleryImages.length > 0) {
      const primaryImage = processedGalleryImages.find(img => img.isPrimary);
      if (primaryImage) {
        mainImageUrl = primaryImage.url; 
      } else if (!mainImageUrl) {
        mainImageUrl = processedGalleryImages[0].url; 
      }
    }

    const plainProduct = product.get({ plain: true });
    plainProduct.images = processedGalleryImages; 
    plainProduct.imageUrl = mainImageUrl; 

    return plainProduct;
  };
  
  //Update Products
  const updateProducts = async (newProduct) => {
    const product = await getProductsById(newProduct.id);
    if (product) {
      if (product != newProduct)
        await Products.update(newProduct, {
          where: { id: newProduct.id },
        });
      return newProduct;
    } else {
      throw httpError.NotFound("Product does not exist");
    }
  };
  
  //Delete Products by id
  const deleteProductsById = async (id) => {
    const productsExist = await Products.findOne({ where: { id } });
    if (!productsExist) {
      throw httpError.NotFound("Product does not exist");
    } else {
      // Delete all associated product images first
      try {
        const { deleteAllProductImages } = require('../productImages/productImages.model');
        await deleteAllProductImages(id);
      } catch (error) {
        console.error('Error deleting product images:', error);
        // Continue with product deletion even if image deletion fails
      }
      
      await Products.destroy({ where: { id } });
    }
  };
  
  // Get product colors
  const getProductColors = async (productId) => {
    const product = await Products.findByPk(productId);
    if (!product) {
      throw httpError.NotFound("Product not found");
    }
    const colors = await product.getColors();
    return colors;
  };

  // Add color to product
  const addColorToProduct = async (productId, colorId) => {
    const product = await getProductsById(productId);
    const color = await Colors.findByPk(colorId);
    
    if (!color) {
      throw httpError.NotFound("Color not found");
    }
    
    await product.addColor(color);
    return { message: "Color added to product successfully" };
  };

  // Remove color from product
  const removeColorFromProduct = async (productId, colorId) => {
    const product = await getProductsById(productId);
    const color = await Colors.findByPk(colorId);
    
    if (!color) {
      throw httpError.NotFound("Color not found");
    }
    
    await product.removeColor(color);
    return { message: "Color removed from product successfully" };
  };

  // Get product sizes
  const getProductSizes = async (productId) => {
    const product = await Products.findByPk(productId);
    if (!product) {
      throw httpError.NotFound("Product not found");
    }
    const sizes = await product.getSizes();
    return sizes;
  };

  // Add size to product
  const addSizeToProduct = async (productId, sizeId) => {
    const product = await getProductsById(productId);
    const size = await Sizes.findByPk(sizeId);
    
    if (!size) {
      throw httpError.NotFound("Size not found");
    }
    
    await product.addSize(size);
    return { message: "Size added to product successfully" };
  };

  // Remove size from product
  const removeSizeFromProduct = async (productId, sizeId) => {
    const product = await getProductsById(productId);
    const size = await Sizes.findByPk(sizeId);
    
    if (!size) {
      throw httpError.NotFound("Size not found");
    }
    
    await product.removeSize(size);
    return { message: "Size removed from product successfully" };
  };

  // Add product image to its gallery
  const updateProductImage = async (productId, imageUrl) => {
    // Add the new image to the ProductImages table
    const newImage = await addProductImageToGallery(productId, { imageUrl: imageUrl, order: 0 }); // order can be managed better

    // Check if this is the only image or if no other primary image exists
    const existingImages = await getProductImages(productId);
    const primaryImageExists = existingImages.some(img => img.isPrimary && img.id !== newImage.id);

    if (!primaryImageExists) {
      await setProductPrimaryImage(newImage.id, productId);
      // Update the main product's imageUrl field for consistency / direct access
      const product = await Products.findByPk(productId);
      if (product) {
        await product.update({ imageUrl: newImage.imageUrl });
      }
      return { message: "Image added and set as primary successfully", imageUrl: newImage.imageUrl, imageId: newImage.id };
    } else {
       // If a primary image already exists, we just add this one. 
       // The main product.imageUrl might not change unless explicitly set.
       // For now, let's update the product's primary imageUrl if this new one is set as primary.
       // This part can be refined based on exact primary image handling requirements.
    }

    return { message: "Image added to gallery successfully", imageUrl: newImage.imageUrl, imageId: newImage.id };
  };

  module.exports = {
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
  };
  