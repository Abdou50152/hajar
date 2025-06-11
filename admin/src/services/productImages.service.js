import api from './api';

export const ProductImagesService = {
  // Get all images for a product
  getProductImages: async (productId) => {
    try {
      const response = await api.get(`/productImages/product/${productId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching images for product ${productId}:`, error);
      throw error;
    }
  },

  // Upload a new image for a product
  uploadProductImage: async (productId, imageFile, isPrimary = false) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('isPrimary', isPrimary);

      const response = await api.post(`/products/${productId}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error uploading image for product ${productId}:`, error);
      throw error;
    }
  },

  // Set an image as primary
  setPrimaryImage: async (imageId) => {
    try {
      const response = await api.patch(`/productImages/${imageId}/primary`);
      return response.data;
    } catch (error) {
      console.error(`Error setting image ${imageId} as primary:`, error);
      throw error;
    }
  },

  // Delete a product image
  deleteProductImage: async (imageId) => {
    try {
      const response = await api.delete(`/productImages/${imageId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting image ${imageId}:`, error);
      throw error;
    }
  }
};

export default ProductImagesService;
