import React, { createContext, useContext, useState, useMemo } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  color: string;
  size: string;
  quantity: number;
  image: string;
}

interface CartContextType {
  cart: CartItem[];
  total: number;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  cartItemsCount: number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType>({
  cart: [],
  total: 0,
  updateQuantity: () => {},
  removeItem: () => {},
  addToCart: () => {},
  cartItemsCount: 0,
  clearCart: () => {},
});

export const CartProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Calculate total price
  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cart]);

  // Calculate total items count
  const cartItemsCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCart(prev => {
      // Check if item already exists with same characteristics
      const existingItemIndex = prev.findIndex(
        i => i.id === item.id && i.color === item.color && i.size === item.size
      );
      
      if (existingItemIndex >= 0) {
        const newCart = [...prev];
        newCart[existingItemIndex].quantity += 1;
        return newCart;
      }
      
      // Add new item
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    
    setCart(prev => 
      prev.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider 
      value={{
        cart,
        total,
        addToCart,
        updateQuantity,
        removeItem,
        cartItemsCount,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};