// components/MiniCart.tsx
import React from 'react';
import Link from 'next/link';
import { useCart } from '../contexts/CartContext';
import { ShoppingBag } from 'lucide-react';

const MiniCart = () => {
  const { cart } = useCart();

  return (
    <div className="group relative">
      <Link href="/panier" className="flex items-center gap-1">
        <ShoppingBag size={20} />
        {cart.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {cart.length}
          </span>
        )}
      </Link>
      
      {/* Mini panier hover */}
      <div className="hidden group-hover:block absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-md z-50 p-4">
        {cart.length === 0 ? (
          <p className="text-sm">Votre panier est vide</p>
        ) : (
          <>
            <h3 className="font-medium mb-2">Votre panier ({cart.length})</h3>
            <div className="space-y-2">
              {cart.map(item => (
                <div key={`${item.id}-${item.color}-${item.size}`} className="flex gap-3 text-sm">
                  <div className="w-16 h-16 bg-gray-100 rounded"></div>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-gray-600">{item.color}, {item.size}</p>
                    <p className="text-amber-700">{item.price} MAD</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/panier" className="mt-4 block text-center bg-amber-600 text-white py-2 rounded-md hover:bg-amber-700">
              Voir le panier
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default MiniCart;