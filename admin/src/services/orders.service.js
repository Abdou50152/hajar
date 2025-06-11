import api from './api';

export const OrdersService = {
  // Get all orders
  getAllOrders: async (skip = 0, limit = 10) => {
    try {
      // D'abord, essayer d'obtenir les commandes depuis l'API
      try {
        const response = await api.get(`/orders?skip=${skip}&limit=${limit}`);
        return response.data;
      } catch (apiError) {
        console.warn('API error, using localStorage as fallback:', apiError);
        
        // Si l'API échoue, utiliser les commandes du localStorage
        const localOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        
        // Convertir au format attendu par l'admin
        return {
          count: localOrders.length,
          orders: localOrders.map((order, index) => ({
            id: index + 1,
            ...order,
            createdAt: new Date(order.date).toLocaleString(),
            updatedAt: new Date(order.date).toLocaleString()
          }))
        };
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      return { count: 0, orders: [] }; // Retourner un objet vide plutôt que de lancer une erreur
    }
  },

  // Get order by ID
  getOrderById: async (id) => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order with id ${id}:`, error);
      throw error;
    }
  },

  // Create new order
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Update order
  updateOrder: async (id, orderData) => {
    try {
      const response = await api.put(`/orders/${id}`, orderData);
      return response.data;
    } catch (error) {
      console.error(`Error updating order with id ${id}:`, error);
      throw error;
    }
  },

  // Update order status
  updateOrderStatus: async (id, status) => {
    try {
      const response = await api.patch(`/orders/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating status for order with id ${id}:`, error);
      throw error;
    }
  },

  // Delete order
  deleteOrder: async (id) => {
    try {
      const response = await api.delete(`/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting order with id ${id}:`, error);
      throw error;
    }
  }
};

export default OrdersService;
