import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

export default function Layout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartItemsCount } = useCart();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold text-amber-700 font-serif">
              ELEGANCE NEZHA
            </Link>
            
            {/* Navigation Desktop */}
            <nav className="hidden md:flex space-x-8 items-center">
              <Link href="/" className="text-gray-700 hover:text-amber-600 transition-colors">
                Accueil
              </Link>
              <Link href="/boutique" className="text-gray-700 hover:text-amber-600 transition-colors">
                Boutique
              </Link>
              <Link href="/categories/robes" className="text-gray-700 hover:text-amber-600 transition-colors">
                Robes
              </Link>
              <Link href="/categories/accessoires" className="text-gray-700 hover:text-amber-600 transition-colors">
                Accessoires
              </Link>
              <Link href="/categories/foulards" className="text-gray-700 hover:text-amber-600 transition-colors">
                Foulards
              </Link>
              <Link href="/a-propos" className="text-gray-700 hover:text-amber-600 transition-colors">
                À propos
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-amber-600 transition-colors">
                Contact
              </Link>
            </nav>
            
            {/* Icons */}
            <div className="flex items-center space-x-6">
              {/* <button className="text-gray-700 hover:text-pink-600 transition-colors">
                <Search size={20} />
              </button> */}
              
              {/* Menu utilisateur conditionnel */}
              {user ? (
                <div className="relative group">
                  <button className="flex items-center space-x-1 text-gray-700 hover:text-amber-600">
                    <User size={20} />
                    <span className="hidden md:inline text-sm">{user.firstName}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                    <Link href="/compte" className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50">
                      Mon compte
                    </Link>
                    <Link href="/commandes" className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50">
                      Mes commandes
                    </Link>
                    <button 
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-pink-50"
                    >
                      Déconnexion
                    </button>
                  </div>
                </div>
              ) : (
                <Link href="/connexion" className="text-gray-700 hover:text-amber-600 transition-colors">
                  <User size={20} />
                </Link>
              )}
              
              <Link href="/panier" className="relative text-gray-700 hover:text-amber-600">
                <ShoppingCart size={20} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
              
              <button 
                className="md:hidden text-gray-700 hover:text-amber-600 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden mt-4 space-y-3 py-4 border-t border-gray-100">
              <Link href="/" className="block px-2 py-2 text-gray-700 hover:text-amber-600 transition-colors">
                Accueil
              </Link>
              <Link href="/boutique" className="block px-2 py-2 text-gray-700 hover:text-amber-600 transition-colors">
                Boutique
              </Link>
              <Link href="/categories/robes" className="block px-2 py-2 text-gray-700 hover:text-amber-600 transition-colors">
                Robes
              </Link>
              <Link href="/categories/accessoires" className="block px-2 py-2 text-gray-700 hover:text-amber-600 transition-colors">
                Accessoires
              </Link>
              <Link href="/categories/foulards" className="block px-2 py-2 text-gray-700 hover:text-amber-600 transition-colors">
                Foulards
              </Link>
              <Link href="/a-propos" className="block px-2 py-2 text-gray-700 hover:text-amber-600 transition-colors">
                À propos
              </Link>
              <Link href="/contact" className="block px-2 py-2 text-gray-700 hover:text-amber-600 transition-colors">
                Contact
              </Link>
              {user ? (
                <>
                  <Link href="/compte" className="block px-2 py-2 text-gray-700 hover:text-amber-600 transition-colors">
                    Mon compte
                  </Link>
                  <button 
                    onClick={logout}
                    className="block w-full text-left px-2 py-2 text-gray-700 hover:text-amber-600 transition-colors"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <Link href="/connexion" className="block px-2 py-2 text-gray-700 hover:text-amber-600 transition-colors">
                  Connexion
                </Link>
              )}
            </nav>
          )}
        </div>
      </header>
      
      <main className="flex-grow w-full pt-6">
        {children}
      </main>
      
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4 text-amber-700">ELEGANCE NEZHA</h3>
              <p className="text-gray-600">Élégance et modestie pour la femme moderne.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Liens rapides</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-600 hover:text-amber-600 transition-colors">Accueil</Link></li>
                <li><Link href="/nouveautes" className="text-gray-600 hover:text-amber-600 transition-colors">Nouveautés</Link></li>
                <li><Link href="/a-propos" className="text-gray-600 hover:text-amber-600 transition-colors">Notre histoire</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Service client</h3>
              <ul className="space-y-2">
                <li><Link href="/contact" className="text-gray-600 hover:text-amber-600 transition-colors">Contactez-nous</Link></li>
                <li><Link href="/livraison" className="text-gray-600 hover:text-amber-600 transition-colors">Livraison & Retours</Link></li>
                <li><Link href="/faq" className="text-gray-600 hover:text-amber-600 transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Newsletter</h3>
              <p className="text-gray-600 mb-4">Abonnez-vous pour recevoir nos offres exclusives.</p>
              <form className="flex">
                <input 
                  type="email" 
                  placeholder="Votre email" 
                  className="px-4 py-2 border border-r-0 rounded-l-md flex-grow"
                />
                <button 
                  type="submit"
                  className="bg-amber-700 text-white px-4 py-2 rounded-r-md hover:bg-amber-800 transition-colors"
                >
                  OK
                </button>
              </form>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600">&copy; {new Date().getFullYear()} ELEGANCE NEZHA. Tous droits réservés.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/cgv" className="text-gray-600 hover:text-amber-600 text-sm">CGV</Link>
              <Link href="/confidentialite" className="text-gray-600 hover:text-amber-600 text-sm">Confidentialité</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}