import api from './api';

export const SizesService = {
  // Get all sizes
  getAllSizes: async (skip = 0, limit = 10) => {
    try {
      const response = await api.get(`/size?skip=${skip}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sizes:', error);
      throw error;
    }
  },

  // Get size by ID
  getSizeById: async (id) => {
    try {
      const response = await api.get(`/size/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching size with id ${id}:`, error);
      throw error;
    }
  },

  // Create new size
  createSize: async (sizeData) => {
    try {
      const response = await api.post('/size', sizeData);
      return response.data;
    } catch (error) {
      console.error('Error creating size:', error);
      throw error;
    }
  },

  // Update size
  updateSize: async (id, sizeData) => {
    try {
      const response = await api.put(`/size/${id}`, sizeData);
      return response.data;
    } catch (error) {
      console.error(`Error updating size with id ${id}:`, error);
      throw error;
    }
  },

  // Delete size
  deleteSize: async (id) => {
    try {
      const response = await api.delete(`/size/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting size with id ${id}:`, error);
      throw error;
    }
  }
};

export default SizesService;
