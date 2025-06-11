import api from '../utils/api';
import { Color } from '../types/product';

export const ColorsService = {
  // Get all colors
  getAllColors: async () => {
    try {
      const response = await api.get('/colors');
      return response.data;
    } catch (error) {
      console.error('Error fetching colors:', error);
      throw error;
    }
  },

  // Get color by ID
  getColorById: async (id: number) => {
    try {
      const response = await api.get(`/colors/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching color with id ${id}:`, error);
      throw error;
    }
  }
};

export default ColorsService;
