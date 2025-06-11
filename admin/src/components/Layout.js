import React, { useState, useEffect } from 'react';
import Header from './Header';
import Navigation from './Navigation';

// Composant de mise en page réutilisable pour toutes les pages
const Layout = ({ children }) => {
  const [isMobileView, setIsMobileView] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  // Fonction pour détecter si l'écran est en mode mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
      setShowSidebar(window.innerWidth >= 768);
    };

    // Vérifier la taille initiale
    handleResize();

    // Ajouter un écouteur d'événement pour les changements de taille
    window.addEventListener('resize', handleResize);

    // Nettoyer l'écouteur d'événement
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fonction pour basculer la barre latérale en mode mobile
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header toggleSidebar={toggleSidebar} isMobileView={isMobileView} />
      <div className="flex flex-1 relative">
        {/* Navigation avec classe conditionnelle pour mobile */}
        <div className={`${showSidebar ? 'block' : 'hidden'} ${isMobileView ? 'absolute z-10 h-full' : 'relative'} md:block`}>
          <Navigation />
        </div>
        
        {/* Overlay pour fermer la navigation en mode mobile */}
        {isMobileView && showSidebar && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-0"
            onClick={() => setShowSidebar(false)}
          />
        )}
        
        {/* Contenu principal */}
        <div className="flex-1 p-3 md:p-6 bg-white m-2 md:m-4 rounded-lg shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
