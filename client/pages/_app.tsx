import { AppProps } from 'next/app';
import { AuthProvider } from '../contexts/AuthContext';
import { CartProvider } from '../contexts/CartContext';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <CartProvider>
        {/* SUPPRIMEZ le Layout ici */}
        <Component {...pageProps} />
      </CartProvider>
    </AuthProvider>
  );
}