import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, ShoppingBag } from 'lucide-react';

// Types pour nos produits
export type Product = {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  rating: number;
  inStock: boolean;
  isNew?: boolean;
  isSale?: boolean;
  colors?: string[];
  sizes?: string[];
   gallery?: string[]; 
  material?: string; 
  description?: string; 
};

// Prop pour le composant ProductCard
type ProductCardProps = {
  product: Product;
  onAddToCart?: (product: Product) => void;
};

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="group">
      <div className="relative overflow-hidden rounded-lg">
        <Link href={`/produits/${product.id}`}>
          <div className="relative h-64 bg-gray-200">
            <img 
              src={product.image || `/images/product-placeholder.png`} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
              onError={(e) => {
                e.currentTarget.onerror = null; 
                e.currentTarget.src = `/images/product-placeholder.png`;
              }}
            />
          </div>
        </Link>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-green-500 text-white text-xs py-1 px-2 rounded">Nouveau</span>
          )}
          {product.isSale && (
            <span className="bg-red-500 text-white text-xs py-1 px-2 rounded">Solde</span>
          )}
        </div>
        
        {/* Quick actions */}
        <div className="absolute bottom-4 right-4 transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={() => onAddToCart && onAddToCart(product)}
            className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-pink-600 hover:bg-pink-600 hover:text-white transition-colors"
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>
      
      <div className="mt-4">
        <Link href={`/produits/${product.id}`} className="block">
          <h3 className="text-sm text-gray-700 font-medium truncate">{product.name}</h3>
        </Link>
        
        <div className="mt-1 flex items-center">
          {/* Rating */}
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < product.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
              />
            ))}
          </div>
        </div>
        
        <div className="mt-1 flex items-center justify-between">
          <div>
            {product.originalPrice ? (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">{product.price.toFixed(2)} 'DH'</span>
                <span className="text-xs text-gray-500 line-through">{product.originalPrice.toFixed(2)} DH</span>
              </div>
            ) : (
              <span className="text-sm font-medium text-gray-900">{product.price.toFixed(2)} DH</span>
            )}
          </div>
          
          {!product.inStock && (
            <span className="text-xs text-red-500">Rupture de stock</span>
          )}
        </div>
      </div>
    </div>
  );
};

// Composant pour afficher une grille de produits
type ProductGridProps = {
  products: Product[];
  onAddToCart?: (product: Product) => void;
};

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onAddToCart }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onAddToCart={onAddToCart} 
        />
      ))}
    </div>
  );
};

// Exemple de données de produits pour le développement
// export const sampleProducts: Product[] = [
//   {
//     id: 1,
//     name: "Robe Maxi Élégante",
//     price: 89.99,
//     category: "robes",
//     image: "public/images/products/robe-1.png",
    //  gallery: [
    //   "/images/products/robe-longue-moderne-1.jpg",
    //   "/images/products/robe-longue-moderne-2.jpg",
    //   "/images/products/robe-longue-moderne-3.jpg"
    // ],
//     rating: 5,
//     inStock: true,
//     colors: ["Noir", "Bleu nuit", "Rose poudré"],
//     sizes: ["XS", "S", "M", "L", "XL"],
//     description: "Robe longue élégante avec coupe moderne et confortable."
//   },
//   {
//     id: 2,
//     name: "Hijab Premium Coton",
//     price: 19.99,
//     category: "hijabs",
//     image: "http://localhost:4000/uploads/products/hijab-1.jpg",
//     rating: 5,
//     inStock: true,
//     colors: ["Blanc", "Noir", "Bleu ciel", "Rose pâle"]
//   },
//   {
//     id: 3,
//     name: "Foulard Satin Luxe",
//     price: 24.99,
//     originalPrice: 29.99,
//     category: "foulards",
//     image: "http://localhost:4000/uploads/products/foulard-1.jpg",
//     rating: 4,
//     inStock: true,
//     isSale: true,
//     colors: ["Doré", "Argent", "Émeraude"]
//   },
//   {
//     id: 4,
//     name: "Robe Longue Festive",
//     price: 89.99,
//     category: "robes",
//     image: "http://localhost:4000/uploads/products/robe-2.jpg",
//     rating: 5,
//     inStock: true,
//     colors: ["Noir", "Rouge", "Bleu royal"],
//     sizes: ["S", "M", "L", "XL"]
//   },
//   {
//     id: 5,
//     name: "Hijab Mousseline",
//     price: 15.99,
//     category: "hijabs",
//     image: "http://localhost:4000/uploads/products/hijab-2.jpg",
//     rating: 4,
//     inStock: true,
//     colors: ["Blanc", "Beige", "Gris", "Noir"]
//   },
//   {
//     id: 6,
//     name: "Foulard Imprimé Floral",
//     price: 22.99,
//     category: "foulards",
//     image: "http://localhost:4000/uploads/products/foulard-2.jpg",
//     rating: 4,
//     inStock: false,
//     colors: ["Multicolore"]
//   },
//   {
//     id: 7,
//     name: "Robe Casual Quotidienne",
//     price: 54.99,
//     category: "robes",
//     image: "http://localhost:4000/uploads/products/robe-3.jpg",
//     rating: 3,
//     inStock: true,
//     colors: ["Bleu marine", "Vert forêt", "Bordeaux"],
//     sizes: ["S", "M", "L", "XL"]
//   },
//   {
//     id: 8,
//     name: "Hijab Jersey Premium",
//     price: 22.99,
//     category: "hijabs",
//     image: "http://localhost:4000/uploads/products/hijab-3.jpg",
//     rating: 5,
//     inStock: true,
//     isNew: true,
//     colors: ["Noir", "Gris", "Bleu marine", "Bordeaux"]
//   }
// ];