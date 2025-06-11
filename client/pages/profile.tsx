import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { UsersService } from '../services/users.service';
import { Order } from '../types/order';

export default function ProfilePage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    // Rediriger vers la page de connexion si non authentifié
    if (!loading && !isAuthenticated) {
      router.push('/connexion');
    }
  }, [isAuthenticated, loading, router]);
  
  useEffect(() => {
    // Récupérer l'historique des commandes de l'utilisateur
    async function fetchOrders() {
      if (isAuthenticated && !loading) {
        try {
          setOrdersLoading(true);
          const userOrders = await UsersService.getUserOrders();
          setOrders(userOrders);
        } catch (error) {
          console.error('Erreur lors de la récupération des commandes:', error);
        } finally {
          setOrdersLoading(false);
        }
      }
    }
    
    fetchOrders();
  }, [isAuthenticated, loading]);

  if (loading || !user) {
    return <Layout><div className="py-8 text-center">Chargement...</div></Layout>;
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Mon Profil</h1>
        
        <div className="space-y-4">
          <div>
            <h2 className="font-semibold">Nom d'utilisateur:</h2>
            <p>{user.username}</p>
          </div>
          
          {user.firstName && (
            <div>
              <h2 className="font-semibold">Prénom:</h2>
              <p>{user.firstName}</p>
            </div>
          )}
          
          {user.lastName && (
            <div>
              <h2 className="font-semibold">Nom:</h2>
              <p>{user.lastName}</p>
            </div>
          )}
          
          <div>
            <h2 className="font-semibold">Email:</h2>
            <p>{user.email}</p>
          </div>
          
          <div>
            <h2 className="font-semibold mb-2">Historique des commandes:</h2>
            {ordersLoading ? (
              <p className="italic text-gray-500">Chargement des commandes...</p>
            ) : orders.length > 0 ? (
              <div className="border rounded-md divide-y">
                {orders.map((order) => (
                  <div key={order.id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Commande #{order.reference}</p>
                        <p className="text-sm text-gray-600">Date: {new Date(order.date).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{order.total.toFixed(2)} DH</p>
                        <span className={
                          `text-xs px-2 py-1 rounded ${order.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : order.status === 'processing' 
                              ? 'bg-blue-100 text-blue-800' 
                              : order.status === 'cancelled' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-yellow-100 text-yellow-800'}`
                        }>
                          {order.status === 'completed' ? 'Livrée' : 
                          order.status === 'processing' ? 'En cours' : 
                          order.status === 'cancelled' ? 'Annulée' : 'En attente'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Aucune commande pour le moment.</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}