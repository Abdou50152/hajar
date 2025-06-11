import api from '../utils/api';
import { Size } from '../types/product';

export const SizesService = {
  // Get all sizes
  getAllSizes: async () => {
    try {
      const response = await api.get('/size');
      return response.data;
    } catch (error) {
      console.error('Error fetching sizes:', error);
      throw error;
    }
  },

  // Get size by ID
  getSizeById: async (id: number) => {
    try {
      const response = await api.get(`/size/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching size with id ${id}:`, error);
      throw error;
    }
  }
};

export default SizesService;
