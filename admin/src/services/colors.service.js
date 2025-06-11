import api from './api';

export const ColorsService = {
  // Get all colors
  getAllColors: async (skip = 0, limit = 10) => {
    try {
      const response = await api.get(`/colors?skip=${skip}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching colors:', error);
      throw error;
    }
  },

  // Get color by ID
  getColorById: async (id) => {
    try {
      const response = await api.get(`/colors/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching color with id ${id}:`, error);
      throw error;
    }
  },

  // Create new color
  createColor: async (colorData) => {
    try {
      const response = await api.post('/colors', colorData);
      return response.data;
    } catch (error) {
      console.error('Error creating color:', error);
      throw error;
    }
  },

  // Update color
  updateColor: async (id, colorData) => {
    try {
      const response = await api.put(`/colors/${id}`, colorData);
      return response.data;
    } catch (error) {
      console.error(`Error updating color with id ${id}:`, error);
      throw error;
    }
  },

  // Delete color
  deleteColor: async (id) => {
    try {
      const response = await api.delete(`/colors/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting color with id ${id}:`, error);
      throw error;
    }
  }
};

export default ColorsService;
