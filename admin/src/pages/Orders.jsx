import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import DataTable from '../components/shared/DataTable';
import Modal from '../components/shared/Modal';
import { useNotification } from '../context/NotificationContext';

// This will be replaced with actual API service
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { showNotification } = useNotification();

  // Mock data - will be replaced with API call
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setOrders([
        {
          id: 1,
          client: { name: 'HAJAR', phone: '+212 634 234 232', address: '12 Rue de Allal fassi' },
          products: [
            { name: 'Robe été', category: 'robe', color: 'bleu', quantity: 1, price: 259.99 }
          ],
          total: 259.99,
          status: 'Pending'
        },
        {
          id: 2,
          client: { name: 'Hayat', phone: '+212 634 234 232', address: '5 Avenue' },
          products: [
            { name: 'Foulard soie', category: 'foulard', color: 'rouge', quantity: 2, price: 129.99 },
            { name: 'Ceinture cuir', category: 'accessoire', color: 'noir', quantity: 1, price: 139.99 }
          ],
          total: 499.97,
          status: 'Pending'
        }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const handleConfirm = (orderId) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: 'Confirmed' } 
        : order
    ));
    showNotification('Order confirmed successfully', 'success');
  };

  const handleReject = (orderId) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: 'Rejected' } 
        : order
    ));
    showNotification('Order rejected', 'success');
  };

  const confirmDelete = (order) => {
    setSelectedOrder(order);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedOrder) return;
    
    try {
      // This will be replaced with an API call
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
      <h2 className="text-2xl font-bold text-amber-800 mb-6">Orders Management</h2>
      
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-amber-800 mb-4">Orders List</h3>
          <DataTable
            columns={columns}
            data={orders}
            emptyMessage="No orders available"
         
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Delete"
      >
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            Are you sure you want to delete this order? This action cannot be undone.
          </p>
        </div>
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={handleDelete}
          >
            Delete
          </button>
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 sm:mt-0 sm:w-auto sm:text-sm"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Orders;
