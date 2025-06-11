import api from './api';

export const OrderProductsService = {
  // Get all order products
  getAllOrderProducts: async (skip = 0, limit = 10) => {
    try {
      const response = await api.get(`/orderProducts?skip=${skip}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order products:', error);
      throw error;
    }
  },

  // Get order products by order ID
  getOrderProductsByOrderId: async (orderId) => {
    try {
      const response = await api.get(`/orderProducts/order/${orderId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order products for order id ${orderId}:`, error);
      throw error;
    }
  },

  // Get order product by ID
  getOrderProductById: async (id) => {
    try {
      const response = await api.get(`/orderProducts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order product with id ${id}:`, error);
      throw error;
    }
  },

  // Create new order product
  createOrderProduct: async (orderProductData) => {
    try {
      const response = await api.post('/orderProducts', orderProductData);
      return response.data;
    } catch (error) {
      console.error('Error creating order product:', error);
      throw error;
    }
  },

  // Update order product
  updateOrderProduct: async (id, orderProductData) => {
    try {
      const response = await api.put(`/orderProducts/${id}`, orderProductData);
      return response.data;
    } catch (error) {
      console.error(`Error updating order product with id ${id}:`, error);
      throw error;
    }
  },

  // Delete order product
  deleteOrderProduct: async (id) => {
    try {
      const response = await api.delete(`/orderProducts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting order product with id ${id}:`, error);
      throw error;
    }
  }
};

export default OrderProductsService;
