import React from 'react';
import Layout from '../components/Layout';
import { useCart } from '../contexts/CartContext';
import Link from 'next/link';
import Image from 'next/image';

const CartPage = () => {
    const { cart, updateQuantity, removeItem, total } = useCart();
    const freeShippingThreshold = 700;
    const needsForFreeShipping = freeShippingThreshold - total;

    // Format price with 2 decimal places and MAD currency
    const formatPrice = (price: number) => {
        return price.toFixed(2) + ' DH';
    };

    const extractName = (value: any): string => {
        if (value === null || typeof value === 'undefined') {
            return 'N/A';
        }
        if (typeof value === 'object' && value !== null) {
            // Handles { name: "ActualName" } and also { name: null } or {}
            return value.name ?? 'N/A';
        }
        if (typeof value === 'string') {
            try {
                const parsedValue = JSON.parse(value);
                // After parsing, check type of parsedValue
                if (typeof parsedValue === 'object' && parsedValue !== null) {
                    return parsedValue.name ?? 'N/A';
                }
                // If parsedValue is a string (e.g. from JSON.parse('"ActualStringValue"'))
                // or a number/boolean (e.g. JSON.parse('123') -> 123)
                // Convert to string for display.
                return String(parsedValue);
            } catch (error) {
                // Not valid JSON, so treat the original string as a literal value
                return value;
            }
        }
        // Fallback for other types if they are not string, object, null, or undefined
        return 'N/A';
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">VOTRE PANIER ({cart.length})</h1>
                    {needsForFreeShipping > 0 && cart.length > 0 && (
                        <p className="text-sm text-amber-600 mt-1">
                            Plus que {formatPrice(needsForFreeShipping)} pour la livraison gratuite!
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        {cart.length === 0 ? (
                            <div className="text-center py-12">
                                <h2 className="text-xl font-medium mb-4">Votre panier est vide</h2>
                                <Link href="/boutique" className="text-amber-600 hover:underline">
                                    Continuer vos achats
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {cart.map((item) => (
                                    <div key={`${item.id}-${item.color}-${item.size}`} className="flex gap-6 border-b pb-6">
                                        <div className="w-24 h-24 bg-gray-100 rounded">
                                            {item.image && (
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    width={100}
                                                    height={100}
                                                    className="w-full h-full object-cover rounded"
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium">{item.name}</h3>
                                            <p className="text-gray-600 text-sm mt-1">
                                                Couleur: {extractName(item.color)}, Taille: {extractName(item.size)}
                                            </p>
                                            <p className="text-amber-700 font-medium mt-2">
                                                {formatPrice(item.price * item.quantity)} ({formatPrice(item.price)} × {item.quantity})
                                            </p>
                                            
                                            <div className="flex items-center gap-4 mt-3">
                                                <div className="flex items-center border rounded">
                                                    <button 
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="px-3 py-1 hover:bg-gray-100"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        -
                                                    </button>
                                                    <span className="px-3">{item.quantity}</span>
                                                    <button 
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="px-3 py-1 hover:bg-gray-100"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <button 
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-sm text-gray-500 hover:text-red-500"
                                                >
                                                    Supprimer
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {cart.length > 0 && (
                        <div className="bg-gray-50 p-6 rounded-lg h-fit sticky top-4">
                            <h2 className="font-bold text-lg mb-4">RÉCAPITULATIF DE LA COMMANDE</h2>
                            
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span>Sous-total</span>
                                    <span className="font-medium">{formatPrice(total)}</span>
                                </div>
                                
                                <div className="pt-4 border-t">
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>TOTAL</span>
                                        <span>{formatPrice(total)}</span>
                                    </div>
                                </div>
                            </div>
{/* 
                            <button className="w-full bg-amber-600 text-white py-3 rounded-md mt-6 hover:bg-amber-700 transition-colors">
                                PASSER COMMANDE
                            </button> */}
                            <Link href="/checkout" className="w-full bg-amber-600 text-white py-3 rounded-md mt-6 hover:bg-amber-700 transition-colors text-center block">
                               PASSER COMMANDE
                                      </Link>

                            <p className="text-xs text-gray-500 mt-4 text-center">
                                Paiement à la livraison disponible
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default CartPage;