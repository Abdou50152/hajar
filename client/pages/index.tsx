import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import { ProductGrid } from '../components/ProductComponents';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductsService from '../services/products.service';

const HomePage = () => {
  // État pour les produits
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [robes, setRobes] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [foulards, setFoulards] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Récupération des produits depuis l'API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Récupérer tous les produits
        const result = await ProductsService.getAllProducts({});
        
        // L'API renvoie un objet {count, products} au lieu d'un tableau direct
        if (result && result.products && Array.isArray(result.products)) {
          // Traiter les produits pour avoir un format cohérent
          const processedProducts = result.products.map(product => {
            let colors = [];
            let sizes = [];
            
            try {
              if (product.colors && typeof product.colors === 'string' && product.colors.trim() !== '') {
                colors = JSON.parse(product.colors);
              }
            } catch (error) {
              console.error('Erreur parsing colors:', error);
            }
            
            try {
              if (product.sizes && typeof product.sizes === 'string' && product.sizes.trim() !== '') {
                sizes = JSON.parse(product.sizes);
              }
            } catch (error) {
              console.error('Erreur parsing sizes:', error);
            }
            
            return {
              ...product,
              colors,
              sizes,
              image: product.imageUrl ? `http://localhost:4000${product.imageUrl}` : null,
              inStock: product.stock > 0,
              isNew: product.isNew === 1,  // Convertir 0/1 en booléen si nécessaire
              isSale: product.isSale === 1 || product.price < product.originalPrice
            };
          });
          
          // Ajout de logs de débogage
          console.log('Nombre total de produits reçus:', processedProducts.length);
          console.log('Produits avec isNew:', processedProducts.filter(p => p.isNew).length);
          console.log('Produits avec isSale:', processedProducts.filter(p => p.isSale).length);
          
          // Produits mis en avant (nouveaux ou en solde, ou les premiers produits si aucun n'est mis en avant)
          const featured = processedProducts.filter(p => p.isNew || p.isSale);
          setFeaturedProducts(featured.length > 0 ? featured.slice(0, 4) : processedProducts.slice(0, 4));
          
          // Filtrer par catégorie
          setRobes(processedProducts.filter(p => p.categorieId === 1).slice(0, 4));
          setAccessories(processedProducts.filter(p => p.categorieId === 2).slice(0, 4));
          setFoulards(processedProducts.filter(p => p.categorieId === 3).slice(0, 4));
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  // Images du carrousel
  const carouselImages = [
    '/images/bg/bg.jpg',
    '/images/bg/bg1.jpg'
  ];
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  function resetTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () => setCurrentSlide((prevSlide) => (prevSlide === carouselImages.length - 1 ? 0 : prevSlide + 1)),
      3000 // 5 secondes par slide
    );

    return () => {
      resetTimeout();
    };
  }, [currentSlide, carouselImages.length]);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative w-screen h-screen overflow-hidden -mt-12">
        <div className="absolute inset-0 bg-black/20 transition-colors z-10"></div>
        
        {/* Carrousel d'images */}
        <div className="relative h-full w-full overflow-hidden">
          {carouselImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
            >
              <img 
                src={image} 
                alt="Hero image" 
                className="w-full h-full object-cover object-center"
                style={{width: '100vw', height: '100vh', maxWidth: 'none'}}  
              />
              <div className="absolute inset-0 bg-black/30"></div>
            </div>
          ))}
          
          {/* Indicateurs de slide */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-white' : 'bg-white/50'
                }`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Voir l'image ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center w-full h-full text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-wide drop-shadow-lg">Élégance et Modestie</h1>
          <p className="text-xl md:text-3xl mb-10 max-w-3xl drop-shadow-md">
            Découvrez notre nouvelle collection de vêtements élégants pour femmes
          </p>
          <Link href="/boutique" className="px-8 py-3 bg-white/20 backdrop-blur-sm text-white border-2 border-white hover:bg-white/30 transition-colors text-lg font-semibold rounded-md">
            Découvrir la collection
          </Link>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="mt-16 w-full">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Nos catégories</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Robes Category */}
          <div className="relative h-80 rounded-lg overflow-hidden group">
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors filter blur-sm"></div>
            <div  className="absolute inset-0 bg-cover bg-center "
              style={{ backgroundImage: "url('/images/categories/abaya.png')" }} // Remplace avec le chemin de ton image
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-50 text-center p-6 ">
                <h3 className="text-2xl font-bold mb-2">Abaya</h3>
                <Link href="/categories/robes" className="px-4 py-2 bg-white text-amber-900 rounded-md hover:bg-gray-100 transition-colors">
                  Découvrir
                </Link>
              </div>
            </div>
          </div>
          {/* Hijabs Category */}
          <div className="relative h-80 rounded-lg overflow-hidden group">
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
            <div  className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/images/categories/jewellery.png')" }} // Remplace avec le chemin de ton image
            ></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
              <h3 className="text-2xl font-bold mb-2">Accesories</h3>
              <p className="mb-4">Ajoutez une touche d'élégance</p>
              <Link href="/categories/Accesories" className="px-4 py-2 bg-white text-amber-900 rounded-md hover:bg-gray-100 transition-colors">
                Découvrir
              </Link>
            </div>
          </div>
          
          {/* Foulards Category */}
          <div className="relative h-80 rounded-lg overflow-hidden group">
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
            <div  className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/images/categories/foulard.png')" }} // Remplace avec le chemin de ton image
            ></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
              <h3 className="text-2xl font-bold mb-2">Foulards</h3>
              <p className="mb-4">Pour un style modeste et raffiné</p>
              <Link href="/categories/foulards" className="px-4 py-2 bg-white text-amber-900 rounded-md hover:bg-gray-100 transition-colors">
                Découvrir
              </Link>
            </div>
          </div>
        </div>
        </div>
      </section>
      
      {/* Best Sellers */}
      <section className="mt-16 w-full mb-12">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
          <div>
            
            <h2 className="text-2xl font-bold mb-8">Meilleures ventes</h2>
            <p className="text-gray-600 mt-2">Nos produits les plus populaires</p>
          </div>
        </div>
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Chargement des produits...</p>
          </div>
        ) : (
          <ProductGrid products={featuredProducts} />
        )}
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;