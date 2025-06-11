import api from '../utils/api';
import { Product } from '../types/product';

export const ProductsService = {
  // Get all products
  getAllProducts: async (params?: { categoryId?: number, search?: string, skip?: number, limit?: number }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.categoryId) queryParams.append('categoryId', params.categoryId.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.skip) queryParams.append('skip', params.skip.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const response = await api.get(`/products${query}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get product by ID
  getProductById: async (id: number) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product with id ${id}:`, error);
      throw error;
    }
  },

  // Get product colors
  getProductColors: async (productId: number) => {
    try {
      const response = await api.get(`/products/${productId}/colors`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching colors for product ${productId}:`, error);
      throw error;
    }
  },

  // Get product sizes
  getProductSizes: async (productId: number) => {
    try {
      const response = await api.get(`/products/${productId}/sizes`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching sizes for product ${productId}:`, error);
      throw error;
    }
  }
};

export default ProductsService;
