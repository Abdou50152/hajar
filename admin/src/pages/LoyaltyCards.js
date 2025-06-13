import React, { useState, useEffect } from 'react';
import { useNotification } from '../context/NotificationContext';

// Données de démonstration pour les cartes de fidélité
const initialLoyaltyData = [
  {
    id: 1,
    userId: 101,
    userName: 'malak alami',
    email: 'malak.alami@gmail.com',
    totalPurchases: 14,
    purchasesSixMonths: 14,
    recentPurchases: [
      { orderId: 'CMD-19283', date: '2025-05-30T09:20:00', amount: 100 },
      { orderId: 'CMD-18942', date: '2025-05-15T14:30:00', amount: 250 },
      { orderId: 'CMD-17524', date: '2025-04-28T11:45:00', amount: 170 },
      { orderId: 'CMD-16245', date: '2025-03-12T16:20:00', amount: 950 },
      { orderId: 'CMD-15283', date: '2025-02-30T09:20:00', amount: 150 },
      { orderId: 'CMD-18582', date: '2025-02-15T14:30:00', amount: 800 },
      { orderId: 'CMD-17524', date: '2025-01-28T11:45:00', amount: 1600 },
      { orderId: 'CMD-19583', date: '2025-01-30T09:20:00', amount: 1250 },
      { orderId: 'CMD-18942', date: '2025-05-15T14:30:00', amount: 800 },
      { orderId: 'CMD-15854', date: '2025-04-28T11:45:00', amount: 1600 },
      { orderId: 'CMD-19283', date: '2025-05-30T09:20:00', amount: 1250 },
      { orderId: 'CMD-11742', date: '2025-05-15T14:30:00', amount: 300 },
      { orderId: 'CMD-19652', date: '2025-04-28T11:45:00', amount: 1000 },
      { orderId: 'CMD-19283', date: '2025-05-30T09:20:00', amount: 1230 }

    ],
    lastPurchaseDate: '2025-05-30T09:20:00',
    bonusEarned: false,
    bonusHistory: []
  },
  {
    id: 2,
    userId: 102,
    userName: 'Fatima Benchekroun',
    email: 'fatima.benchekroun@gmail.com',
    totalPurchases: 16,
    purchasesSixMonths: 16,
    recentPurchases: [
      { orderId: 'CMD-19562', date: '2025-06-05T10:15:00', amount: 2200 },
      { orderId: 'CMD-18256', date: '2025-05-22T13:40:00', amount: 1700 },
      { orderId: 'CMD-17129', date: '2025-04-18T15:30:00', amount: 900 },
      { orderId: 'CMD-15896', date: '2025-03-07T12:10:00', amount: 1500 },
      { orderId: 'CMD-18942', date: '2025-05-15T14:30:00', amount: 250 },
      { orderId: 'CMD-17524', date: '2025-04-28T11:45:00', amount: 170 },
      { orderId: 'CMD-16245', date: '2025-03-12T16:20:00', amount: 950 },
      { orderId: 'CMD-15283', date: '2025-02-30T09:20:00', amount: 150 },
      { orderId: 'CMD-18582', date: '2025-02-15T14:30:00', amount: 800 },
      { orderId: 'CMD-17524', date: '2025-01-28T11:45:00', amount: 1600 },
      { orderId: 'CMD-19583', date: '2025-01-30T09:20:00', amount: 1250 },
      { orderId: 'CMD-18942', date: '2025-05-15T14:30:00', amount: 800 },
      { orderId: 'CMD-15854', date: '2025-04-28T11:45:00', amount: 1600 },
      { orderId: 'CMD-19283', date: '2025-05-30T09:20:00', amount: 1250 },
      { orderId: 'CMD-11742', date: '2025-05-15T14:30:00', amount: 300 },
      { orderId: 'CMD-19652', date: '2025-04-28T11:45:00', amount: 1000 },
      { orderId: 'CMD-19283', date: '2025-05-30T09:20:00', amount: 1230 }
    ],
    lastPurchaseDate: '2025-06-05T10:15:00',
    bonusEarned: true,
    bonusHistory: [
      { date: '2025-06-06T11:00:00', type: 'reduction', value: '15% de réduction', applied: true }
    ]
  },
  {
    id: 3,
    userId: 103,
    userName: 'Karima Mejat',
    email: 'karima.mejat@gmail.com',
    totalPurchases: 3,
    purchasesSixMonths: 3,
    recentPurchases: [
      { orderId: 'CMD-19347', date: '2025-05-28T17:22:00', amount: 1100 },
      { orderId: 'CMD-18723', date: '2025-05-10T14:15:00', amount: 850 },
      { orderId: 'CMD-16982', date: '2025-03-25T11:30:00', amount: 1450 }
    ],
    lastPurchaseDate: '2025-05-28T17:22:00',
    bonusEarned: false,
    bonusHistory: []
  }
];

const LoyaltyCards = () => {
  const { showNotification } = useNotification();
  const [loyaltyData, setLoyaltyData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [bonusType, setBonusType] = useState('reduction');
  const [bonusValue, setBonusValue] = useState('');
  const [availableFreeProducts, setAvailableFreeProducts] = useState([
    { id: 1, name: 'Caftan Bleu Turquoise' },
    { id: 2, name: 'Écharpe Traditionnelle' },
    { id: 3, name: 'Babouches Artisanales' }
  ]);
  const [selectedFreeProduct, setSelectedFreeProduct] = useState('');

  useEffect(() => {
    // Charger les données depuis localStorage ou utiliser les données de démonstration
    try {
      const savedLoyaltyData = localStorage.getItem('loyaltyCards');
      setLoyaltyData(savedLoyaltyData ? JSON.parse(savedLoyaltyData) : initialLoyaltyData);
    } catch (error) {
      console.error('Erreur lors du chargement des données de fidélité:', error);
      setLoyaltyData(initialLoyaltyData);
    }
  }, []);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  // Calcule le nombre de jours depuis un achat donné
  const daysSincePurchase = (purchaseDate) => {
    const today = new Date();
    const purchase = new Date(purchaseDate);
    const diffTime = Math.abs(today - purchase);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Vérifie si un achat est dans les 6 derniers mois
  const isWithinSixMonths = (purchaseDate) => {
    return daysSincePurchase(purchaseDate) <= 180; // ~6 mois
  };

  // Formater la date pour l'affichage
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fr-FR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (e) {
      return 'Date inconnue';
    }
  };

  // Accorder un bonus à un utilisateur
  const awardBonus = () => {
    if (!selectedUser) return;
    
    // Vérifier l'éligibilité
    if (selectedUser.purchasesSixMonths < 15 || selectedUser.bonusEarned) {
      showNotification('Ce client n\'est pas éligible pour un bonus', 'error');
      return;
    }

    let bonusDetails = {};
    if (bonusType === 'reduction') {
      bonusDetails = { type: 'reduction', value: bonusValue, applied: false };
    } else if (bonusType === 'product' && selectedFreeProduct) {
      const product = availableFreeProducts.find(p => p.id === parseInt(selectedFreeProduct));
      bonusDetails = { type: 'product', value: product ? product.name : '', applied: false };
    } else {
      showNotification('Veuillez sélectionner un type de bonus valide', 'error');
      return;
    }

    // Mettre à jour les données de fidélité
    const updatedLoyaltyData = loyaltyData.map(user => {
      if (user.id === selectedUser.id) {
        return {
          ...user,
          bonusEarned: true,
          bonusHistory: [...user.bonusHistory, {
            date: new Date().toISOString(),
            ...bonusDetails
          }]
        };
      }
      return user;
    });

    setLoyaltyData(updatedLoyaltyData);
    localStorage.setItem('loyaltyCards', JSON.stringify(updatedLoyaltyData));
    setSelectedUser(updatedLoyaltyData.find(user => user.id === selectedUser.id));
    showNotification('Bonus accordé avec succès', 'success');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Cartes de Fidélité</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Liste des clients */}
        <div className="w-full md:w-1/3 bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-4">Clients</h2>
          
          {loyaltyData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucun client trouvé
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {loyaltyData.map(user => (
                <div 
                  key={user.id}
                  className={`py-3 px-2 cursor-pointer ${selectedUser?.id === user.id ? 'bg-amber-50' : 'hover:bg-gray-50'}`}
                  onClick={() => handleSelectUser(user)}
                >
                  <div className="flex justify-between items-start">
                    <span className="block font-medium">{user.userName}</span>
                    {user.purchasesSixMonths >= 15 && !user.bonusEarned && (
                      <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Éligible</span>
                    )}
                    {user.bonusEarned && (
                      <span className="inline-block px-2 py-1 text-xs bg-amber-100 text-amber-800 rounded-full">Bonus accordé</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 truncate">{user.email}</div>
                  <div className="text-xs text-gray-500 mt-1">Achats (6 mois): {user.purchasesSixMonths}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Détails du client et carte de fidélité */}
        <div className="w-full md:w-2/3 bg-white rounded-lg shadow-md p-4">
          {selectedUser ? (
            <div>
              <h2 className="text-lg font-semibold mb-2">{selectedUser.userName}</h2>
              <p className="text-sm text-gray-600 mb-4">{selectedUser.email}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="border border-gray-200 rounded p-3 bg-gray-50">
                  <p className="text-xs text-gray-500">Achats totaux</p>
                  <p className="text-xl font-bold">{selectedUser.totalPurchases}</p>
                </div>
                <div className="border border-gray-200 rounded p-3 bg-gray-50">
                  <p className="text-xs text-gray-500">Achats (6 mois)</p>
                  <p className={`text-xl font-bold ${selectedUser.purchasesSixMonths >= 15 ? 'text-green-600' : ''}`}>
                    {selectedUser.purchasesSixMonths}
                  </p>
                </div>
                <div className="border border-gray-200 rounded p-3 bg-gray-50">
                  <p className="text-xs text-gray-500">Dernier achat</p>
                  <p className="text-sm font-medium">{formatDate(selectedUser.lastPurchaseDate)}</p>
                </div>
              </div>
              
              {/* Achats récents */}
              <div className="mb-6">
                <h3 className="text-md font-semibold mb-2">Achats récents</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commande</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedUser.recentPurchases.map((purchase, index) => (
                        <tr key={index}>
                          <td className="px-3 py-2 whitespace-nowrap text-sm">{purchase.orderId}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm">{formatDate(purchase.date)}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm">{purchase.amount} DH</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Section bonus */}
              <div className="border-t pt-4">
                <h3 className="text-md font-semibold mb-2">Gestion des bonus</h3>
                
                {selectedUser.purchasesSixMonths >= 15 && !selectedUser.bonusEarned ? (
                  <div className="bg-green-50 border border-green-200 p-3 rounded mb-4">
                    <p className="text-green-700 font-medium">Ce client est éligible pour un bonus!</p>
                  </div>
                ) : null}
                
                {selectedUser.bonusHistory.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-1">Historique des bonus</h4>
                    <ul className="border border-gray-200 divide-y divide-gray-200 rounded">
                      {selectedUser.bonusHistory.map((bonus, index) => (
                        <li key={index} className="px-3 py-2 text-sm">
                          <div className="flex justify-between">
                            <span>
                              {bonus.type === 'reduction' ? 'Réduction: ' : 'Produit gratuit: '}
                              <span className="font-medium">{bonus.value}</span>
                            </span>
                            <span className="text-gray-500">{formatDate(bonus.date)}</span>
                          </div>
                          <div className="text-xs mt-1">
                            {bonus.applied ? 
                              <span className="text-green-600">Appliqué</span> : 
                              <span className="text-amber-600">En attente d'utilisation</span>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="bg-gray-50 border border-gray-200 p-3 rounded">
                  <h4 className="text-sm font-medium mb-2">Accorder un bonus</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Type de bonus</label>
                      <select
                        className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                        value={bonusType}
                        onChange={(e) => setBonusType(e.target.value)}
                        disabled={selectedUser.purchasesSixMonths < 15 || selectedUser.bonusEarned}
                      >
                        <option value="reduction">Réduction</option>
                        <option value="product">Produit gratuit</option>
                      </select>
                    </div>
                    
                    {bonusType === 'reduction' ? (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Valeur de la réduction</label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                          placeholder="ex: 15% de réduction"
                          value={bonusValue}
                          onChange={(e) => setBonusValue(e.target.value)}
                          disabled={selectedUser.purchasesSixMonths < 15 || selectedUser.bonusEarned}
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Produit offert</label>
                        <select
                          className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                          value={selectedFreeProduct}
                          onChange={(e) => setSelectedFreeProduct(e.target.value)}
                          disabled={selectedUser.purchasesSixMonths < 15 || selectedUser.bonusEarned}
                        >
                          <option value="">Sélectionner un produit</option>
                          {availableFreeProducts.map(product => (
                            <option key={product.id} value={product.id}>{product.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                  
                  <button
                    className={`px-3 py-1.5 text-sm rounded ${selectedUser.purchasesSixMonths >= 15 && !selectedUser.bonusEarned
                      ? 'bg-amber-500 hover:bg-amber-600 text-white'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                    onClick={awardBonus}
                    disabled={selectedUser.purchasesSixMonths < 15 || selectedUser.bonusEarned}
                  >
                    Accorder le bonus
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              Sélectionnez un client pour voir les détails de sa carte de fidélité
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoyaltyCards;
