import React from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

const OrderConfirmedPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <CheckCircle className="w-16 h-16 text-amber-800 mx-auto mb-6" />
          <h1 className="text-2xl font-bold mb-4">Commande confirmée!</h1>
          <p className="text-gray-600 mb-8">
            Merci pour votre commande. Nous avons reçu votre demande et la traiterons dans les plus brefs délais.
          </p>
          <Link
            href="/boutique"
            className="px-6 py-2 bg-amber-800 text-white rounded-md hover:bg-amber-800 transition-colors inline-block"
          >
            Retour à la boutique
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default OrderConfirmedPage;