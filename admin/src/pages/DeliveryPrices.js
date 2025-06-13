import React, { useState, useEffect } from 'react';
import { useNotification } from '../context/NotificationContext';

// Mock data for testing
const initialDeliveryPrices = [
  { id: 1, city: 'Casablanca', price: 30 },
  { id: 2, city: 'Rabat', price: 40 },
  { id: 3, city: 'Marrakech', price: 50 },
  { id: 4, city: 'Fès', price: 45 },
  { id: 5, city: 'Tanger', price: 55 }
];

// In production, this would be stored in a database and accessed via API
const saveDeliveryPricesToLocalStorage = (prices) => {
  localStorage.setItem('deliveryPrices', JSON.stringify(prices));
};

const getDeliveryPricesFromLocalStorage = () => {
  const prices = localStorage.getItem('deliveryPrices');
  return prices ? JSON.parse(prices) : initialDeliveryPrices;
};

const DeliveryPrices = () => {
  const { showNotification } = useNotification();
  const [deliveryPrices, setDeliveryPrices] = useState([]);
  const [newCity, setNewCity] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [editId, setEditId] = useState(null);
  const [editCity, setEditCity] = useState('');
  const [editPrice, setEditPrice] = useState('');

  useEffect(() => {
    // Load delivery prices from localStorage on component mount
    const savedPrices = getDeliveryPricesFromLocalStorage();
    setDeliveryPrices(savedPrices);
  }, []);

  const handleAddDeliveryPrice = (e) => {
    e.preventDefault();
    
    if (!newCity.trim() || !newPrice || isNaN(parseFloat(newPrice))) {
      showNotification('Veuillez entrer une ville et un prix valide', 'error');
      return;
    }

    const newId = deliveryPrices.length > 0 
      ? Math.max(...deliveryPrices.map(item => item.id)) + 1 
      : 1;
    
    const newDeliveryPrices = [
      ...deliveryPrices,
      {
        id: newId,
        city: newCity.trim(),
        price: parseFloat(newPrice)
      }
    ];
    
    setDeliveryPrices(newDeliveryPrices);
    saveDeliveryPricesToLocalStorage(newDeliveryPrices);
    setNewCity('');
    setNewPrice('');
    
    showNotification('Prix de livraison ajouté avec succès', 'success');
  };

  const handleEditClick = (delivery) => {
    setEditId(delivery.id);
    setEditCity(delivery.city);
    setEditPrice(delivery.price.toString());
  };

  const handleUpdateDeliveryPrice = (e) => {
    e.preventDefault();
    
    if (!editCity.trim() || !editPrice || isNaN(parseFloat(editPrice))) {
      showNotification('Veuillez entrer une ville et un prix valide', 'error');
      return;
    }

    const updatedDeliveryPrices = deliveryPrices.map(item => 
      item.id === editId 
        ? { ...item, city: editCity.trim(), price: parseFloat(editPrice) } 
        : item
    );
    
    setDeliveryPrices(updatedDeliveryPrices);
    saveDeliveryPricesToLocalStorage(updatedDeliveryPrices);
    
    setEditId(null);
    setEditCity('');
    setEditPrice('');
    
    showNotification('Prix de livraison mis à jour avec succès', 'success');
  };

  const handleDeleteDeliveryPrice = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce prix de livraison?')) {
      const updatedDeliveryPrices = deliveryPrices.filter(item => item.id !== id);
      setDeliveryPrices(updatedDeliveryPrices);
      saveDeliveryPricesToLocalStorage(updatedDeliveryPrices);
      showNotification('Prix de livraison supprimé avec succès', 'success');
    }
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditCity('');
    setEditPrice('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Gestion des Prix de Livraison</h1>
      
      {/* Add new delivery price form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Ajouter un nouveau prix de livraison</h2>
        <form onSubmit={handleAddDeliveryPrice} className="flex flex-wrap gap-4">
          <div className="w-full md:w-[calc(50%-8px)]">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
              Ville
            </label>
            <input
              type="text"
              id="city"
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="w-full md:w-[calc(30%-8px)]">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
              Prix (DH)
            </label>
            <input
              type="number"
              id="price"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              min="0"
              step="0.01"
              required
            />
          </div>
          <div className="w-full md:w-[calc(20%-8px)] flex items-end">
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full md:mt-6"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
      
      {/* Delivery prices table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Liste des Prix de Livraison</h2>
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead>
              <tr className="bg-amber-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                  Ville
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                  Prix (DH)
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-amber-900 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {deliveryPrices.map((delivery) => (
                <tr key={delivery.id}>
                  {editId === delivery.id ? (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={editCity}
                          onChange={(e) => setEditCity(e.target.value)}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          required
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          value={editPrice}
                          onChange={(e) => setEditPrice(e.target.value)}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          min="0"
                          step="0.01"
                          required
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={handleUpdateDeliveryPrice}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          Enregistrer
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Annuler
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {delivery.city}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {delivery.price} DH
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditClick(delivery)}
                          className="text-amber-600 hover:text-amber-900 mr-3"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteDeliveryPrice(delivery.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Supprimer
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
              {deliveryPrices.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                    Aucun prix de livraison trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPrices;
