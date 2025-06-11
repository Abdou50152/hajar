import React from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';

const ConfirmationPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-8">
            <svg
              className="mx-auto h-16 w-16 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Commande confirmée !
          </h1>
          
          <p className="text-gray-600 mb-8">
            Merci pour votre commande. Nous vous enverrons un e-mail de confirmation avec les détails de votre commande.
          </p>

          <div className="space-y-4">
            <Link
              href="/"
              className="block w-full bg-amber-700 text-white py-3 px-4 rounded hover:bg-amber-800 transition-colors"
            >
              Retour à l'accueil
            </Link>
            
            <Link
              href="/products"
              className="block w-full bg-gray-100 text-gray-700 py-3 px-4 rounded hover:bg-gray-200 transition-colors"
            >
              Continuer mes achats
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ConfirmationPage;
