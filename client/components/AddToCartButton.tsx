// components/AddToCartButton.tsx
import React from 'react';
import { useCart } from '../contexts/CartContext';

export default function AddToCartButton({ product }) {
  const { addToCart } = useCart();

  const handleClick = () => {
    addToCart({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      color: product.color || 'Unie',
      size: product.size || 'Unique',
      image: product.image || '/placeholder.jpg'
    });
  };

  return (
    <button
      onClick={handleClick}
      className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
    >
      Ajouter au panier
    </button>
  );
}