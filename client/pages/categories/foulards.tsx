import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { ProductGrid } from '../../components/ProductComponents';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import ProductsService from '../../services/products.service';

const FoulardsPage = () => {
  // État pour les produits et le chargement
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // État pour les filtres
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);

  // Chargement des produits depuis l'API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Récupérer tous les produits
        const result = await ProductsService.getAllProducts({});
        // L'API renvoie un objet {count, products} au lieu d'un tableau direct
        if (result && result.products && Array.isArray(result.products)) {
          // Traiter les données selon la structure de l'API
          const processedProducts = result.products
            .filter(product => product.categorieId === 2) // Filtrer uniquement les foulards (catégorie 2)
            .map(product => {
              // Parser les couleurs et tailles qui sont stockées sous forme de chaînes JSON
              let colors = [];
              let sizes = [];

              try {
                if (product.colors && typeof product.colors === 'string' && product.colors.trim() !== '') {
                  colors = JSON.parse(product.colors);
                }
              } catch (error) {
                console.error('Erreur de parsing des couleurs:', error);
              }

              try {
                if (product.sizes && typeof product.sizes === 'string' && product.sizes.trim() !== '') {
                  sizes = JSON.parse(product.sizes);
                }
              } catch (error) {
                console.error('Erreur de parsing des tailles:', error);
              }

              return {
                ...product,
                colors,
                sizes,
                image: product.imageUrl ? `http://localhost:4000${product.imageUrl}` : null,
                category: 'foulards',
                inStock: product.stock > 0
              };
            });

          setProducts(processedProducts);
        } else {
          console.error('Format de données incorrect:', result);
          setProducts([]);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Options disponibles
  const colors = ['Noir', 'Blanc', 'Beige', 'Rose', 'Bleu', 'Doré', 'Multicolore'];
  const materials = ['Coton', 'Satin', 'Soie', 'Mousseline', 'Viscose', 'Jersey'];

  // Gestion des filtres
  const handleColorToggle = (color) => {
    setSelectedColors(prev =>
      prev.includes(color)
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };
  
  const handleMaterialToggle = (material) => {
    setSelectedMaterials(prev =>
      prev.includes(material)
        ? prev.filter(m => m !== material)
        : [...prev, material]
    );
  };
  
  // Filtrage des produits
  const filteredProducts = products.filter(product => {
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    
    const matchesColor = selectedColors.length === 0 || 
      (product.colors && product.colors.some(color => selectedColors.includes(color)));
    
    const matchesMaterial = selectedMaterials.length === 0 || 
      (product.material && selectedMaterials.includes(product.material));
    
    return matchesPrice && matchesColor && matchesMaterial;
  });
  
  // Tri des produits
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
        return a.isNew ? -1 : b.isNew ? 1 : 0;
      default:
        return b.rating - a.rating; // populaires en premier par défaut
    }
  });

  return (
    <Layout>
      {/* Bannière de catégorie étendue */}
      <div className="relative h-60 md:h-80 overflow-hidden mb-8 w-screen -mx-[calc((100vw-100%)/2)]">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40"></div>
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/categories/foulard.png')" }}></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-2">Foulards</h1>
          <p className="text-lg md:text-xl max-w-2xl">L'élégance dans chaque détail</p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 mb-12">
        
        {/* Filtres et Grille de produits */}
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Contenu principal */}
          <div className="flex-1">
            {/* Info résultats et tri (desktop) */}
            <div className="hidden md:flex justify-between items-center mb-6">
              <p className="text-gray-600">{sortedProducts.length} articles trouvés</p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Trier par:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="p-1 border rounded text-sm"
                >
                  <option value="popular">Popularité</option>
                  <option value="price-low">Prix croissant</option>
                  <option value="price-high">Prix décroissant</option>
                  <option value="newest">Nouveautés</option>
                </select>
              </div>
            </div>
            
            {/* État de chargement */}
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Chargement des produits...</p>
              </div>
            ) : (
              /* Grille de produits */
              sortedProducts.length > 0 ? (
                <ProductGrid products={sortedProducts} />
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">Aucun produit ne correspond à vos critères de recherche.</p>
                  <button 
                    onClick={() => {
                      setPriceRange([0, 200]);
                      setSelectedColors([]);
                      setSelectedMaterials([]);
                    }}
                    className="mt-4 text-amber-700 hover:text-amber-800"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              )
            )}
          </div>
        </div> {/* Closes flex flex-col md:flex-row gap-6 */}
        </div> {/* Closes container mx-auto px-4 */}
    </Layout>
  );
};

export default FoulardsPage;
