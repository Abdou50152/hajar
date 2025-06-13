import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import DataTable from '../components/shared/DataTable';
import Modal from '../components/shared/Modal';
import { useNotification } from '../context/NotificationContext';
import { OrdersService } from '../services/orders.service';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { showNotification } = useNotification();

  // Utiliser des données de test au lieu de l'API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        
        // Données de test statiques pour les commandes (similaires à l'image)
        const testOrders = [
          {
            id: 1,
            reference: 'CMD-10025',
            date: '2025-06-10',
            paymentStatus: 'Payée',
            paymentMethod: 'Carte bancaire',
            client: {
              name: 'Malak alami', 
              phone: '0612345678', 
              address: '12 Rue de Allal Fassi,Marrakech'
            },
            products: [
              {
                name: 'Robe été',
                category: 'robe',
                color: 'bleu',
                quantity: 1,
                price: 259.99
              }
            ],
            total: 259.99,
            status: 'Pending'
          },
          {
            id: 2,
            reference: 'CMD-10034',
            date: '2025-06-12',
            paymentStatus: 'Payée',
            paymentMethod: 'Espèces',
            client: {
              name: 'Fatima Benchekroun', 
              phone: '0623456789', 
              address: '5 Avenue,Rabat'
            },
            products: [
              {
                name: 'Foulard soie',
                category: 'foulard',
                color: 'rouge',
                quantity: 2,
                price: 129.99
              },
              {
                name: 'Ceinture cuir',
                category: 'accessoire',
                color: 'noir',
                quantity: 1,
                price: 139.99
              }
            ],
            total: 499.97,
            status: 'Pending'
          },
          {
            id: 3,
            reference: 'CMD-10047',
            date: '2025-06-08',
            // paymentStatus: 'Payée',
            // paymentMethod: 'Carte bancaire',
            client: {
              name: 'Karima Mejat', 
              phone: '0634567890', 
              address: '8 Boulevard Mohammed V,casablanca'
            },
            products: [
              {
                name: 'Robe été',
                category: 'robe',
                color: 'vert',
                quantity: 1,
                price: 259.99
              }
            ],
            total: 789.99,
            status: 'Confirmed'
          },
          {
            id: 4,
            reference: 'CMD-10052',
            date: '2025-06-13',
            paymentStatus: 'En attente',
            paymentMethod: 'À la livraison',
            client: {
              name: 'Hakima el houari', 
              phone: '0645678901', 
              address: '15 Rue Tarik Ibn Ziad ,Rabat'
            },
            products: [
              {
                name: 'kimono',
                category: 'robe',
                color: 'blanc',
                quantity: 1,
                price: 159.99
              },
              {
                name: 'bague ',
                category: 'accessoire',
                color: 'marron',
                quantity: 1,
                price: 199.99
              }
            ],
            total: 799.98,
            status: 'Pending'
          }
        ];
        
        console.log('Données de test des commandes:', testOrders);
        setOrders(testOrders);
      } catch (error) {
        console.error('Erreur lors du chargement des commandes de test:', error);
        showNotification('Échec du chargement des commandes', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [showNotification]);
  
  // Function to check if products exist for debugging
  const hasProducts = (order) => {
    return Array.isArray(order.products) && order.products.length > 0;
  };

  // Mettre à jour les données de fidélité pour un client lorsqu'une commande est confirmée
  const updateLoyaltyStatus = (clientName, clientPhone) => {
    try {
      // Charger les données de fidélité existantes
      let loyaltyData = [];
      try {
        const savedData = localStorage.getItem('loyaltyCards');
        loyaltyData = savedData ? JSON.parse(savedData) : [];
      } catch (err) {
        console.error('Erreur lors du chargement des données de fidélité:', err);
      }

      // Chercher si le client existe déjà
      const currentDate = new Date();
      const orderDate = currentDate.toISOString();
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      
      const clientIndex = loyaltyData.findIndex(user => 
        user.userName.toLowerCase() === clientName.toLowerCase() && 
        user.phone === clientPhone
      );

      if (clientIndex >= 0) {
        // Client existant - mettre à jour ses infos
        const client = loyaltyData[clientIndex];
        
        // Générer un ID de commande simple pour la démo
        const orderId = `CMD-${Math.floor(10000 + Math.random() * 90000)}`;
        
        // Ajouter cet achat aux achats récents
        const newPurchase = {
          orderId: orderId,
          date: orderDate,
          amount: Math.floor(500 + Math.random() * 2000) // Montant aléatoire pour la démo
        };
        
        // Filtrer les achats des 6 derniers mois
        const recentPurchases = [
          newPurchase,
          ...client.recentPurchases.filter(p => new Date(p.date) > sixMonthsAgo)
        ].slice(0, 10); // Garder les 10 achats les plus récents
        
        // Calculer le nombre d'achats dans les 6 derniers mois
        const purchasesSixMonths = recentPurchases.length;
        
        // Mettre à jour le client
        loyaltyData[clientIndex] = {
          ...client,
          totalPurchases: client.totalPurchases + 1,
          purchasesSixMonths,
          recentPurchases,
          lastPurchaseDate: orderDate
        };
        
      } else {
        // Nouveau client - créer une entrée
        const newUserId = loyaltyData.length > 0 ? Math.max(...loyaltyData.map(u => u.id)) + 1 : 1;
        const orderId = `CMD-${Math.floor(10000 + Math.random() * 90000)}`;
        
        loyaltyData.push({
          id: newUserId,
          userId: newUserId + 100, // ID utilisateur arbitraire pour la démo
          userName: clientName,
          email: 'client@example.com', // Email fictif pour la démo
          phone: clientPhone,
          totalPurchases: 1,
          purchasesSixMonths: 1,
          recentPurchases: [{
            orderId: orderId,
            date: orderDate,
            amount: Math.floor(500 + Math.random() * 2000) // Montant aléatoire pour la démo
          }],
          lastPurchaseDate: orderDate,
          bonusEarned: false,
          bonusHistory: []
        });
      }
      
      // Enregistrer les données mises à jour
      localStorage.setItem('loyaltyCards', JSON.stringify(loyaltyData));
      console.log('Données de fidélité mises à jour avec succès');
      
      // Vérifier l'éligibilité au bonus
      const updatedClient = loyaltyData.find(user => 
        user.userName.toLowerCase() === clientName.toLowerCase() && 
        user.phone === clientPhone
      );
      
      if (updatedClient && updatedClient.purchasesSixMonths >= 15 && !updatedClient.bonusEarned) {
        showNotification(`Le client ${clientName} est maintenant éligible pour un bonus de fidélité!`, 'info');
      }
      
    } catch (error) {
      console.error('Erreur lors de la mise à jour des données de fidélité:', error);
    }
  };

  const handleConfirm = async (orderId) => {
    try {
      // Call the API to update the order status
      await OrdersService.updateOrderStatus(orderId, 'confirmed');
      
      // Récupérer les détails de la commande
      const order = orders.find(o => o.id === orderId);
      
      if (order && order.client) {
        // Mettre à jour la carte de fidélité du client
        updateLoyaltyStatus(order.client.name, order.client.phone);
      }
      
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: 'Confirmed' } 
          : order
      ));
      showNotification('Order confirmed successfully', 'success');
    } catch (error) {
      console.error('Error confirming order:', error);
      showNotification('Failed to confirm order', 'error');
    }
  };

  const handleReject = async (orderId) => {
    try {
      // Call the API to update the order status
      await OrdersService.updateOrderStatus(orderId, 'refunded');
      
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: 'Rejected' } 
          : order
      ));
      showNotification('Order rejected', 'success');
    } catch (error) {
      console.error('Error rejecting order:', error);
      showNotification('Failed to reject order', 'error');
    }
  };

  const confirmDelete = (order) => {
    setSelectedOrder(order);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedOrder) return;
    
    try {
      // Call the API to delete the order
      await OrdersService.deleteOrder(selectedOrder.id);
      setOrders(orders.filter(order => order.id !== selectedOrder.id));
      showNotification('Order deleted successfully', 'success');
      setShowDeleteModal(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error deleting order:', error);
      showNotification('Failed to delete order', 'error');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-amber-100 text-amber-800';
    }
  };

  const columns = [
    { 
      key: 'client', 
      header: 'Client',
      render: (order) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{order.client.name}</div>
          <div className="text-sm text-gray-500">{order.client.phone}</div>
          <div className="text-sm text-gray-500">{order.client.address}</div>
        </div>
      )
    },
    { 
      key: 'products', 
      header: 'Products',
      render: (order) => (
        <div>
          {order.products.map((product, index) => (
            <div key={index} className="mb-2 last:mb-0">
              <div className="text-sm font-medium">{product.name} ({product.category})</div>
              <div className="text-xs text-gray-500">
                Color: {product.color}, Quantity: {product.quantity}
              </div>
              <div className="text-xs text-gray-500">
                Unit price: {product.price.toFixed(2)} MAD
              </div>
            </div>
          ))}
        </div>
      )
    },
    { 
      key: 'total', 
      header: 'Total',
      render: (order) => (
        <div className="text-sm font-medium text-gray-900">
          {order.total.toFixed(2)} MAD
        </div>
      )
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (order) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
          {order.status}
        </span>
      )
    },
    { 
      key: 'actions', 
      header: 'Actions',
      render: (order) => (
        <div className="flex space-x-2">
          {order.status === 'Pending' && (
            <>
              <button
                onClick={() => handleConfirm(order.id)}
                className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition"
              >
                Confirm
              </button>
              <button
                onClick={() => handleReject(order.id)}
                className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition"
              >
                Reject
              </button>
            </>
          )}
          {/* Bouton Delete supprimé */}
        </div>
      )
    }
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-amber-800 mb-6">Gestion des commandes</h2>
      
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Référence</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Articles</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    Aucune commande disponible
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{order.reference}</div>
                      <div className="text-xs text-gray-500 mt-1">Date: {order.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{order.client.name}</div>
                      <div className="text-sm text-gray-500">{order.client.phone}</div>
                      <div className="text-sm text-gray-500">{order.client.address}</div>
                    </td>
                    <td className="px-6 py-4">
                      {order.products.map((product, index) => (
                        <div key={index} className="mb-2 last:mb-0">
                          <div className="text-sm font-medium">
                            {product.name} ({product.category})
                          </div>
                          <div className="text-xs text-gray-500">
                            Couleur: {product.color}, Quantité: {product.quantity}
                          </div>
                          <div className="text-xs text-gray-500">
                            Prix unitaire: {product.price.toFixed(2)}MAD
                          </div>
                        </div>
                      ))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {order.total.toFixed(2)}MAD
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === 'Confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : order.status === 'Rejected' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.status === 'Pending' ? 'En attente' : 
                         order.status === 'Confirmed' ? 'Confirmée' : 'Refusée'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {order.status === 'Pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleConfirm(order.id)}
                            className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded text-xs"
                          >
                            Confirmer
                          </button>
                          <button
                            onClick={() => handleReject(order.id)}
                            className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-xs"
                          >
                            Refuser
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirmation de suppression"
      >
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            Êtes-vous sûr de vouloir supprimer cette commande ? Cette action ne peut pas être annulée.
          </p>
        </div>
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={handleDelete}
          >
            Supprimer
          </button>
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 sm:mt-0 sm:w-auto sm:text-sm"
            onClick={() => setShowDeleteModal(false)}
          >
            Annuler
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Orders;
