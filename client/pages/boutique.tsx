import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { ProductGrid, Product } from '../components/ProductComponents';
import { Sliders, ChevronDown, X } from 'lucide-react';
import ProductsService from '../services/products.service';

const ShopPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: { min: 0, max: 100 },
    colors: [] as string[],
    sizes: [] as string[],
    sortBy: 'newest',
    inStock: false,
    onSale: false,
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Charger les produits depuis l'API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const result = await ProductsService.getAllProducts();

        // L'API renvoie un objet {count, products} au lieu d'un tableau direct
        if (result && result.products && Array.isArray(result.products)) {
          // Traiter les données selon la structure de l'API
          const processedProducts = result.products.map(product => {
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
              category: product.categorieId === 1 ? 'robes' : 
                        product.categorieId === 2 ? 'accessoires' : 
                        product.categorieId === 3 ? 'foulards' : 'autres',
              inStock: product.stock > 0,
              rating: 5 // Valeur par défaut pour le rating
            };
          });

          setProducts(processedProducts);
          setFilteredProducts(processedProducts);
        } else {
          console.error('Format de données incorrect:', result);
          setError('Format de données incorrect');
          setProducts([]);
          setFilteredProducts([]);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error);
        setError('Erreur lors de la récupération des produits');
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Extraire les données uniques pour les filtres
  const categories = ['robes', 'accessoires', 'foulards'];
  const allColors = Array.from(new Set(products.flatMap(p => p.colors || [])));
  const allSizes = Array.from(new Set(products.flatMap(p => p.sizes || [])));

  // Appliquer les filtres
  useEffect(() => {
    let result = [...products];

    // Filtre par catégorie
    if (filters.category) {
      result = result.filter(p => p.category === filters.category);
    }

    // Filtre par prix
    result = result.filter(p => 
      p.price >= filters.priceRange.min && 
      p.price <= filters.priceRange.max
    );

    // Filtre par couleurs
    if (filters.colors.length > 0) {
      result = result.filter(p => 
        p.colors?.some(color => filters.colors.includes(color))
      );
    }

    // Filtre par tailles
    if (filters.sizes.length > 0) {
      result = result.filter(p => 
        p.sizes?.some(size => filters.sizes.includes(size))
      );
    }

    // Filtre par stock
    if (filters.inStock) {
      result = result.filter(p => p.inStock);
    }

    // Filtre par promotion
    if (filters.onSale) {
      result = result.filter(p => p.isSale);
    }

    // Tri
    switch(filters.sortBy) {
      case 'price-low-high':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
      default:
        // Assumons que les IDs plus élevés sont plus récents
        result.sort((a, b) => b.id - a.id);
        break;
    }

    setFilteredProducts(result);
  }, [filters]);

  // Gestionnaires d'événements pour les filtres
  const handleCategoryChange = (category: string) => {
    setFilters(prev => ({ ...prev, category }));
  };

  const handlePriceChange = (min: number, max: number) => {
    setFilters(prev => ({ ...prev, priceRange: { min, max } }));
  };

  const handleColorToggle = (color: string) => {
    setFilters(prev => {
      const newColors = prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color];
      return { ...prev, colors: newColors };
    });
  };

  const handleSizeToggle = (size: string) => {
    setFilters(prev => {
      const newSizes = prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes: newSizes };
    });
  };

  const handleSortChange = (sortBy: string) => {
    setFilters(prev => ({ ...prev, sortBy }));
  };

  const handleInStockToggle = () => {
    setFilters(prev => ({ ...prev, inStock: !prev.inStock }));
  };

  const handleOnSaleToggle = () => {
    setFilters(prev => ({ ...prev, onSale: !prev.onSale }));
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      priceRange: { min: 0, max: 100 },
      colors: [],
      sizes: [],
      sortBy: 'newest',
      inStock: false,
      onSale: false,
    });
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filtres pour desktop */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Catégories</h3>
              <ul className="space-y-2">
                <li>
                  <button 
                    className={`w-full text-left px-2 py-1 rounded ${filters.category === '' ? 'bg-pink-100 text-amber-600' : ''}`}
                    onClick={() => handleCategoryChange('')}
                  >
                    Toutes les catégories
                  </button>
                </li>
                {categories.map(category => (
                  <li key={category}>
                    <button 
                      className={`w-full text-left px-2 py-1 rounded capitalize ${filters.category === category ? 'bg-pink-100 text-amber-600' : ''}`}
                      onClick={() => handleCategoryChange(category)}
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Prix</h3>
              <div className="flex items-center gap-2">
                <input 
                  type="range" 
                  min="0" 
                  max="100"
                  value={filters.priceRange.max}
                  onChange={(e) => handlePriceChange(filters.priceRange.min, parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between mt-2">
                <span>{filters.priceRange.min}€</span>
                <span>{filters.priceRange.max}€</span>
              </div>
            </div>

            {allColors.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Couleurs</h3>
                <div className="flex flex-wrap gap-2">
                  {allColors.map(color => (
                    <button
                      key={color}
                      onClick={() => handleColorToggle(color)}
                      className={`px-3 py-1 border rounded-full text-sm ${
                        filters.colors.includes(color) 
                          ? 'bg-pink-100 border-amber-600 text-amber-600' 
                          : 'border-gray-300'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {allSizes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Tailles</h3>
                <div className="flex flex-wrap gap-2">
                  {allSizes.map(size => (
                    <button
                      key={size}
                      onClick={() => handleSizeToggle(size)}
                      className={`w-10 h-10 flex items-center justify-center border rounded-md ${
                        filters.sizes.includes(size) 
                          ? 'bg-pink-100 border-amber-600 text-amber-600' 
                          : 'border-gray-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Autres filtres</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="inStock"
                    checked={filters.inStock}
                    onChange={handleInStockToggle}
                    className="mr-2"
                  />
                  <label htmlFor="inStock">En stock uniquement</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="onSale"
                    checked={filters.onSale}
                    onChange={handleOnSaleToggle}
                    className="mr-2"
                  />
                  <label htmlFor="onSale">En promotion</label>
                </div>
              </div>
            </div>

            <button
              onClick={resetFilters}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        </aside>

        {/* Contenu principal */}
        <div className="flex-grow ml-4">
          {/* En-tête avec options de tri et bouton filtres mobile */}
          <div className="flex flex-wrap items-center justify-between mt-3 mb-3">
            <h1 className="text-2xl font-bold mb-1 mt-0">Boutique</h1>

            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <label htmlFor="sort" className="mr-2 text-sm">Trier par:</label>
                <select
                  id="sort"
                  value={filters.sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
                >
                  <option value="newest">Plus récents</option>
                  <option value="price-low-high">Prix croissant</option>
                  <option value="price-high-low">Prix décroissant</option>
                  <option value="rating">Meilleures notes</option>
                </select>
              </div>

              <button
                className="md:hidden flex items-center gap-1 text-gray-700 px-3 py-1.5 border border-gray-300 rounded-md"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <Sliders size={18} />
                Filtres
              </button>
            </div>
          </div>

          {/* Info résultats */}
          <div className="mb-6">
            <p className="text-gray-600">
              {filteredProducts.length} produits trouvés
              {(filters.category || filters.colors.length > 0 || filters.sizes.length > 0 || filters.inStock || filters.onSale) && (
                <button 
                  onClick={resetFilters} 
                  className="ml-2 text-amber-600 hover:underline"
                >
                  Effacer les filtres
                </button>
              )}
            </p>
          </div>

          {/* État de chargement */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Chargement des produits...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
              >
                Réessayer
              </button>
            </div>
          ) : filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts} />
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 mb-4">Aucun produit ne correspond aux filtres sélectionnés.</p>
              <button 
                onClick={resetFilters}
                className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Modal de filtres pour mobile */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileFiltersOpen(false)}
          ></div>
          <div className="relative w-72 max-w-full bg-white h-full overflow-y-auto ml-auto">
            <div className="p-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-medium">Filtres</h3>
                <button 
                  onClick={() => setMobileFiltersOpen(false)}
                  className="text-gray-500"
                >
                  <X size={18} />
                </button>
              </div>
              
              {/* Contenu des filtres (même que desktop) */}
              <div className="mb-4">
                <h3 className="text-base font-medium mb-2">Catégories</h3>
                <ul className="space-y-1">
                  <li>
                    <button 
                      className={`w-full text-left px-2 py-1 rounded text-sm ${filters.category === '' ? 'bg-pink-100 text-amber-600' : ''}`}
                      onClick={() => handleCategoryChange('')}
                    >
                      Toutes les catégories
                    </button>
                  </li>
                  {categories.map(category => (
                    <li key={category}>
                      <button 
                        className={`w-full text-left px-2 py-1 rounded capitalize text-sm ${filters.category === category ? 'bg-pink-100 text-amber-600' : ''}`}
                        onClick={() => handleCategoryChange(category)}
                      >
                        {category}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Reste des filtres... */}
              {/* ... */}
              
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    resetFilters();
                    setMobileFiltersOpen(false);
                  }}
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700"
                >
                  Réinitialiser
                </button>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="flex-1 px-3 py-1.5 text-sm bg-amber-600 text-white rounded-md"
                >
                  Appliquer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ShopPage;