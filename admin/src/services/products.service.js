import api from './api';

export const ProductsService = {
  // Get all products
  getAllProducts: async (skip = 0, limit = 10) => {
    try {
      const response = await api.get(`/products?skip=${skip}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get product by ID
  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product with id ${id}:`, error);
      throw error;
    }
  },

  // Create new product
  createProduct: async (productData) => {
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Update product
  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error(`Error updating product with id ${id}:`, error);
      throw error;
    }
  },

  // Delete product
  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting product with id ${id}:`, error);
      throw error;
    }
  },
  
  // Get product colors
  getProductColors: async (productId) => {
    try {
      const response = await api.get(`/products/${productId}/colors`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching colors for product with id ${productId}:`, error);
      throw error;
    }
  },
  
  // Add color to product
  addColorToProduct: async (productId, colorId) => {
    try {
      const response = await api.post(`/products/${productId}/colors`, { colorId });
      return response.data;
    } catch (error) {
      console.error(`Error adding color to product with id ${productId}:`, error);
      throw error;
    }
  },
  
  // Remove color from product
  removeColorFromProduct: async (productId, colorId) => {
    try {
      const response = await api.delete(`/products/${productId}/colors/${colorId}`);
      return response.data;
    } catch (error) {
      console.error(`Error removing color from product with id ${productId}:`, error);
      throw error;
    }
  },
  
  // Get product sizes
  getProductSizes: async (productId) => {
    try {
      const response = await api.get(`/products/${productId}/sizes`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching sizes for product with id ${productId}:`, error);
      throw error;
    }
  },
  
  // Add size to product
  addSizeToProduct: async (productId, sizeId) => {
    try {
      const response = await api.post(`/products/${productId}/sizes`, { sizeId });
      return response.data;
    } catch (error) {
      console.error(`Error adding size to product with id ${productId}:`, error);
      throw error;
    }
  },
  
  // Remove size from product
  removeSizeFromProduct: async (productId, sizeId) => {
    try {
      const response = await api.delete(`/products/${productId}/sizes/${sizeId}`);
      return response.data;
    } catch (error) {
      console.error(`Error removing size from product with id ${productId}:`, error);
      throw error;
    }
  },
  
  // Get all product images
  getProductImages: async (productId) => {
    try {
      const response = await api.get(`/productImages/products/${productId}/images`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching images for product with id ${productId}:`, error);
      throw error;
    }
  },

  // Upload product image (single)
  uploadProductImage: async (productId, imageFile, isPrimary = false, order = 0) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('isPrimary', isPrimary);
      formData.append('order', order);
      
      const response = await api.post(`/productImages/products/${productId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error uploading image for product with id ${productId}:`, error);
      throw error;
    }
  },
  
  // Upload multiple product images
  uploadMultipleProductImages: async (productId, imageFiles) => {
    try {
      // Create a new FormData object
      const formData = new FormData();
      
      // Log the number of files being uploaded
      console.log(`Uploading ${imageFiles.length} images for product ${productId}`);
      
      // Append each file individually with the correct field name
      for (let i = 0; i < imageFiles.length; i++) {
        formData.append('images', imageFiles[i]);
        console.log(`Appended file ${i+1}/${imageFiles.length}: ${imageFiles[i].name}`);
      }
      
      // Use the correct route defined in the backend
      const response = await api.post(`/productImages/products/${productId}/images/bulk`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error uploading multiple images for product with id ${productId}:`, error);
      throw error;
    }
  },
  
  // Update product image
  updateProductImage: async (imageId, data) => {
    try {
      const response = await api.put(`/productImages/images/${imageId}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating image with id ${imageId}:`, error);
      throw error;
    }
  },
  
  // Delete product image
  deleteProductImage: async (imageId) => {
    try {
      const response = await api.delete(`/productImages/images/${imageId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting image with id ${imageId}:`, error);
      throw error;
    }
  },
  
  // Delete all product images
  deleteAllProductImages: async (productId) => {
    try {
      const response = await api.delete(`/productImages/products/${productId}/images`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting all images for product with id ${productId}:`, error);
      throw error;
    }
  },
  
  // Set primary image
  setPrimaryImage: async (productId, imageId) => {
    try {
      const response = await api.put(`/productImages/products/${productId}/images/${imageId}/primary`);
      return response.data;
    } catch (error) {
      console.error(`Error setting primary image for product with id ${productId}:`, error);
      throw error;
    }
  }
};

export default ProductsService;
