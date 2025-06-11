export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  createdAt?: string;
  updatedAt?: string;
  imageUrl?: string;
  colors?: Color[];
  sizes?: Size[];
  category?: Category;
}

export interface Color {
  id: number;
  name: string;
  hexCode: string;
}

export interface Size {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface ProductImage {
  id: number;
  productId: number;
  imageUrl: string;
  isPrimary: boolean;
}
