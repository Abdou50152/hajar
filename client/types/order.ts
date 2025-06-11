export interface UserAccountInfo {
  id: number;
  fullName?: string;
  email?: string;
  phone?: string;
  // Add other relevant user fields that your backend might return
}

export interface ProductInfo {
  id: number;
  name: string;
  // Add other relevant product fields like price, imageUrl if needed
}

export interface OrderProduct {
  id?: number; // ID of the order_products table entry
  product_id: number;
  order_id?: number;
  quantity: number;
  price: number; // Price of the item at the time of order
  color?: string;
  size?: string;
  product?: ProductInfo; // Nested product details
}

export interface Order {
  id?: number;
  reference: string;
  date: string; // ISO date string
  total: number;
  status: 'new' | 'confirmed' | 'pending' | 'shipped' | 'refunded';
  // Customer details provided at checkout, stored directly on the order
  fullName: string; 
  phone: string;
  city: string;
  address: string;
  userId?: number | null; // ID of the user who placed the order, if logged in
  user?: UserAccountInfo; // Populated user account details
  orderProducts?: OrderProduct[]; // Renamed from 'products' and items contain nested product info
}

// This type can be used for the admin orders page, emphasizing that nested details are expected.
// It's structurally the same as the updated Order interface.
export interface OrderWithProducts extends Order {}
