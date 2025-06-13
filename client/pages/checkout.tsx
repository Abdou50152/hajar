import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import { useCart } from '../contexts/CartContext';
import { useRouter } from 'next/router';
import { OrdersService } from '../services/orders.service';
import { Order, OrderProduct } from '../types/order';
import { useAuth } from '../contexts/AuthContext';

const CheckoutPage: React.FC = () => {
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

    // Mock data for city delivery prices (in production, this would come from an API)
  const [deliveryPrices, setDeliveryPrices] = useState<{ id: number, city: string, price: number }[]>([
    { id: 1, city: 'Casablanca', price: 30 },
    { id: 2, city: 'Rabat', price: 40 },
    { id: 3, city: 'Marrakech', price: 50 },
    { id: 4, city: 'Fès', price: 45 },
    { id: 5, city: 'Tanger', price: 55 }
  ]);
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    city: '',
    address: ''
  });

  useEffect(() => {
    // Try to load delivery prices from localStorage
    try {
      const storedPrices = localStorage.getItem('deliveryPrices');
      if (storedPrices) {
        setDeliveryPrices(JSON.parse(storedPrices));
      }
    } catch (error) {
      console.error('Error loading delivery prices from localStorage:', error);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Update delivery price when city changes
    if (name === 'city' && value) {
      const selectedCity = deliveryPrices.find(item => item.city === value);
      setDeliveryPrice(selectedCity ? selectedCity.price : 0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!user || !user.id) {
      setError('Vous devez être connecté pour passer une commande. Veuillez vous connecter.');
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Vérifier que le panier n'est pas vide
      if (cart.length === 0) {
        setError('Votre panier est vide. Veuillez ajouter des produits avant de passer commande.');
        setIsSubmitting(false);
        return;
      }
      
      // Génération d'une référence unique pour la commande
      const orderReference = 'CMD-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
      
      // Préparer les données de la commande
      const orderData = {
        reference: orderReference,
        date: new Date().toISOString(),
        total: total + deliveryPrice, // Add delivery price to total
        deliveryPrice: deliveryPrice,
        status: 'pending' as const,
        ...formData,
        userId: user.id // User is confirmed to exist and have an id by this point
      };

      console.log('Envoi de la commande à l\'API:', orderData);
      
      // 1. Créer la commande via le service
      const createdOrder = await OrdersService.createOrder(orderData);

      // 2. Si la commande est créée avec succès, ajouter les produits
      if (createdOrder && createdOrder.id) {
        // Préparer les produits pour l'ajout à la commande
        const orderProducts = cart.map(item => ({
          product_id: Number(item.id),
          quantity: item.quantity,
          price: item.price,
          color: item.color,
          size: item.size
        }));

        // Ajouter les produits à la commande
        await OrdersService.addProductsToOrder(createdOrder.id, orderProducts);
        console.log('Commande et produits enregistrés avec succès!');

        // Vider le panier et rediriger vers la page de confirmation
        clearCart();
        router.push('/confirmation');
      }
    } catch (error) {
      console.error('Erreur lors de la soumission de la commande:', error);
      setError('Une erreur est survenue lors de la soumission de votre commande. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Finaliser la commande</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="max-w-lg">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullName">
              Nom complet
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
              Téléphone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
              Ville
            </label>
            <select
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Sélectionner une ville</option>
              {deliveryPrices.map((city) => (
                <option key={city.id} value={city.city}>
                  {city.city} (Livraison: {city.price} DH)
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
              Adresse
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Récapitulatif de la commande</h2>
            <div className="bg-gray-100 p-4 rounded">
              {cart.map((item, index) => (
                <div key={index} className="flex justify-between mb-2">
                  <span>{item.name}</span>
                  <span>{item.quantity} x {item.price}DH</span>
                </div>
              ))}
              {deliveryPrice > 0 && (
                <div className="flex justify-between mb-2">
                  <span>Frais de livraison ({formData.city}):</span>
                  <span>{deliveryPrice} DH</span>
                </div>
              )}
              <div className="border-t pt-2 mt-2 font-bold flex justify-between">
                <span>Total:</span>
                <span>{total + deliveryPrice} DH</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${
                isSubmitting ? 'bg-blue-300' : 'bg-amber-500 hover:bg-amber-700'
              } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Traitement...
                </>
              ) : (
                'Commander'
              )}
            </button>
            <Link href="/panier" className="text-amber-500 hover:text-amber-800">
              Retour au panier
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
