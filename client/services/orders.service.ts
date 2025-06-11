import { Order, OrderProduct } from '../types/order';
import api from '../utils/api';

export const OrdersService = {
  // Créer une nouvelle commande
  createOrder: async (orderData: Omit<Order, 'id'>): Promise<Order> => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
      // Fallback : sauvegarder dans le localStorage
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const newOrder = { ...orderData, id: Date.now() };
      existingOrders.push(newOrder);
      localStorage.setItem('orders', JSON.stringify(existingOrders));
      return newOrder;
    }
  },

  // Ajouter des produits à une commande
  addProductsToOrder: async (orderId: number, products: Array<{ product_id: number; quantity: number; price: number; color?: string; size?: string; }>): Promise<void> => {
    try {
      // The 'products' array already contains product_id, quantity, price, color, and size from the cart.
      // The backend controller httpAddProductsToOrder expects a body like { products: [...] }
      // and will handle mapping these fields (e.g., product_id to productId, color to colorName) for the model function.
      await api.post(`/orders/${orderId}/products`, { products: products });
    } catch (error) {
      console.error('Erreur lors de l\'ajout des produits à la commande:', error);
      // En cas d'erreur, on stocke quand même les produits dans le localStorage
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const orderIndex = existingOrders.findIndex((o: Order) => o.id === orderId);
      if (orderIndex !== -1) {
        existingOrders[orderIndex].products = products;
        localStorage.setItem('orders', JSON.stringify(existingOrders));
      }
    }
  },

  // Récupérer toutes les commandes
  getAllOrders: async (): Promise<Order[]> => {
    try {
      const response = await api.get('/orders');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
      // Fallback : récupérer depuis le localStorage
      return JSON.parse(localStorage.getItem('orders') || '[]');
    }
  },

  // Récupérer une commande par son ID
  getOrderById: async (id: number): Promise<Order> => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la commande ${id}:`, error);
      // Fallback : récupérer depuis le localStorage
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      const order = orders.find((o: Order) => o.id === id);
      if (!order) throw new Error(`Commande avec l'ID ${id} non trouvée`);
      return order;
    }
  },

  // Mettre à jour le statut d'une commande
  updateOrderStatus: async (id: number, status: string): Promise<Order> => {
    try {
      const response = await api.patch(`/orders/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du statut de la commande ${id}:`, error);
      throw error;
    }
  }
};
