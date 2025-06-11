import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { ProductGrid } from '../../components/ProductComponents';
import { Minus, Plus, Heart, Share, ShoppingBag, ChevronRight, Star, Truck, Package, RefreshCcw } from 'lucide-react';
import Link from 'next/link';
import AddToCartButton from '../../components/AddToCartButton';
import { useCart } from '../../contexts/CartContext';
import SizeGuideModal from '../../components/SizeGuideModal';
import ProductsService from '../../services/products.service';

const ProductDetailPage = () => {
  const parseProductOptions = (optionData: any, optionName: string): any[] => {
    let optionsArray: any[] = [];
    try {
      let rawOptions = optionData;
      if (rawOptions) {
        if (typeof rawOptions === 'string' && rawOptions.trim() !== '') {
          rawOptions = JSON.parse(rawOptions);
        }
        // At this point, rawOptions is either the parsed object/array or the original object/array
        if (Array.isArray(rawOptions)) {
          optionsArray = rawOptions;
        } else if (typeof rawOptions === 'object' && rawOptions !== null) {
          // If it's a single object, wrap it in an array
          optionsArray = [rawOptions];
        } else if (rawOptions) { // Log only if it was something initially but not array/object
          console.warn(`Format de ${optionName} inattendu après traitement:`, rawOptions);
        }
      }
    } catch (parseError) {
      console.error(`Erreur de parsing JSON pour ${optionName}:`, parseError);
      // optionsArray remains []
    }
    return optionsArray;
  };

  const router = useRouter();
  const { id } = router.query;
  const { addToCart } = useCart();

  // États pour le produit et le chargement
  const [product, setProduct] = useState<any | null>(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for selections
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<any | null>(null);
  const [selectedSize, setSelectedSize] = useState<any | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // For main image display

  // Récupérer le produit depuis l'API
  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          setError(null);

          // Récupérer les détails du produit
          const productData = await ProductsService.getProductById(Number(id));

          // Traiter les données selon la structure de l'API
          let colors = [];
          let sizes = [];

colors = parseProductOptions(productData.colors, 'couleurs du produit principal');

sizes = parseProductOptions(productData.sizes, 'tailles du produit principal');

          // NEW: Process gallery images
          let galleryImages: string[] = [];
          if (productData.images && Array.isArray(productData.images) && productData.images.length > 0) {
            galleryImages = productData.images.map((img: any) => 
              img.url ? `http://localhost:4000${img.url}` : null // Keep null for filtering
            ).filter(url => url !== null) as string[]; // Filter out nulls and assert type
            // If after filtering, gallery is empty but there was an imageUrl, use it
            if (galleryImages.length === 0 && productData.imageUrl) {
              galleryImages = [`http://localhost:4000${productData.imageUrl}`];
            }
          } else if (typeof productData.imageUrl === 'string' && productData.imageUrl.trim() !== '') {
            if (productData.imageUrl.startsWith('/')) {
              galleryImages = [`http://localhost:4000${productData.imageUrl}`];
            } else if (productData.imageUrl.startsWith('http')) {
              // It might already be a full URL
              galleryImages = [productData.imageUrl];
              console.log('productData.imageUrl seems to be a full URL already:', productData.imageUrl);
            } else {
              // It's a non-empty string but not a relative path starting with / or a full http URL
              console.warn('productData.imageUrl has an unexpected format:', productData.imageUrl, 'Will not use for gallery.');
              // galleryImages remains empty from this branch, relying on later placeholder logic if needed
            }
          }

          const processedProduct = {
            ...productData,
            colors,
            sizes,
            galleryImages: galleryImages, // Store all image URLs
            image: galleryImages.length > 0 ? galleryImages[0] : `http://localhost:4000/api/placeholder/800/800?text=${productData.name || 'Produit'}`, // Main image is the first or placeholder
            inStock: productData.stock > 0
          };

          setProduct(processedProduct);

          // Set selected image for the main display
          if (galleryImages.length > 0 && galleryImages[0]) {
            setSelectedImage(galleryImages[0]);
          } else if (typeof productData.imageUrl === 'string' && productData.imageUrl.trim() !== '' && productData.imageUrl.startsWith('/')) {
            const directImageUrl = `http://localhost:4000${productData.imageUrl}`;
            setSelectedImage(directImageUrl);
            // Also ensure galleryImages has this if it was missed
            if (galleryImages.length === 0) {
              processedProduct.galleryImages = [directImageUrl]; // Mutating processedProduct here, ensure it's intended or handle differently
            }
          } else {
            const placeholder = `http://localhost:4000/api/placeholder/800/800?text=${productData.name || 'Produit'}`;
            setSelectedImage(placeholder);
          }
          if (colors && colors.length > 0) {
            setSelectedColor(colors[0]);
          } else {
            setSelectedColor(null);
          }
          if (sizes && sizes.length > 0) {
            setSelectedSize(sizes[0]);
          } else {
            setSelectedSize(null);
          }

          // Récupérer les produits similaires de la même catégorie
          if (productData.categorieId) {
            const similarProductsData = await ProductsService.getAllProducts({
              categoryId: productData.categorieId,
              limit: 4
            });

            if (Array.isArray(similarProductsData)) {
              // Filtrer pour exclure le produit actuel
              const filteredProducts = similarProductsData
                .filter(p => p.id !== Number(id))
                .map(p => {
                  const pColors = parseProductOptions(p.colors, `couleurs pour produit similaire ${p.id}`);
                  const pSizes = parseProductOptions(p.sizes, `tailles pour produit similaire ${p.id}`);

                  return {
                    ...p,
                    colors: pColors,
                    sizes: pSizes,
                    image: p.imageUrl ? `http://localhost:4000${p.imageUrl}` : null,
                    inStock: p.stock > 0
                  };
                })
                .slice(0, 4);

              setSimilarProducts(filteredProducts);
            } else {
              setSimilarProducts([]);
            }
          }
        } catch (err) {
          console.error('Erreur lors de la récupération du produit:', err);
          setError('Produit non trouvé ou erreur lors du chargement');
        } finally {
          setLoading(false);
        }
      };

      fetchProduct();
    }
  }, [id]);

  // État de chargement ou d'erreur
  if (loading) {
    return (
      <Layout>
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold mb-4">Chargement du produit...</h1>
        </div>
      </Layout>
    );
  }

  // Si erreur ou produit non trouvé
  if (error || !product) {
    return (
      <Layout>
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold mb-4">Produit non trouvé</h1>
          <p className="text-gray-600 mb-6">Le produit que vous recherchez n'existe pas ou a été supprimé.</p>
          <Link href="/boutique" className="px-6 py-2 bg-amber-800 text-white rounded-md hover:bg-amber-700 transition-colors">
            Retour à la boutique
          </Link>
        </div>
      </Layout>
    );
  }

  // Event handlers
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    // S'assurer que selectedColor et selectedSize sont des chaînes
    const colorValue = selectedColor ? (typeof selectedColor === 'object' ? (selectedColor.name || selectedColor.label) : selectedColor) : 'N/A';
      
    const sizeValue = selectedSize ? (typeof selectedSize === 'object' ? (selectedSize.name || selectedSize.label) : selectedSize) : 'N/A';
      
    addToCart({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      color: colorValue,
      size: sizeValue,
      image: product.image || '/images/product-placeholder.png'
    });
  };

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-pink-600 transition-colors">Accueil</Link>
        <ChevronRight size={16} className="mx-2" />
        <Link href="/boutique" className="hover:text-pink-600 transition-colors">Boutique</Link>
        <ChevronRight size={16} className="mx-2" />
        <Link href={`/categories/${product.categorieId}`} className="hover:text-pink-600 transition-colors capitalize">{product.categorieName}</Link>
        <ChevronRight size={16} className="mx-2" />
        <span className="text-gray-900 font-medium truncate">{product.name}</span>
      </div>

      {/* Similar products */}
      {similarProducts.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-12">
          <h2 className="text-xl font-bold mb-6">Vous pourriez aussi aimer</h2>
          <ProductGrid products={similarProducts} />
        </section>
      )}

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10 px-4 sm:px-6 lg:px-8">
        {/* Product images */}
        <div className="md:col-span-2">
          {/* Main Image */}
          <div className="bg-gray-100 rounded-xl overflow-hidden mb-4 aspect-square shadow-md transition-all duration-300 ease-in-out">
            <img 
              src={selectedImage || `http://localhost:4000/api/placeholder/800/800?text=${product.name || 'Produit'}`} 
              alt={product.name || 'Image du produit'} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = `http://localhost:4000/api/placeholder/800/800?text=${product.name || 'Erreur'}`;
              }}
            />
          </div>
          {/* Thumbnails */}
          {product.galleryImages && product.galleryImages.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.galleryImages.map((imgUrl: string, index: number) => (
                <div 
                  key={index} 
                  className={`bg-gray-100 rounded-md overflow-hidden aspect-square shadow-sm hover:opacity-80 transform transition-all duration-200 ease-in-out cursor-pointer border-2 ${selectedImage === imgUrl ? 'border-amber-600' : 'border-transparent hover:border-amber-400'}`}
                  onClick={() => setSelectedImage(imgUrl)}
                >
                  <img 
                    src={imgUrl} 
                    alt={`${product.name} vue ${index + 1}`} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `http://localhost:4000/api/placeholder/200/200?text=Img ${index + 1}`;
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Product details */}
        <div className="md:col-span-3">
          {/* Badges */}
          <div className="flex space-x-2 mb-2">
            {product.isNew && (
              <span className="bg-green-500 text-white text-xs py-1 px-2 rounded">Nouveau</span>
            )}
            {product.isSale && (
              <span className="bg-red-500 text-white text-xs py-1 px-2 rounded">Solde</span>
            )}
          </div>
          
          {/* Title and price */}
          <h1 className="text-xl font-bold mb-2">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-4">
            {product.originalPrice ? (
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-amber-600">{product.price.toFixed(2)} DH</span>
                <span className="text-gray-500 line-through">{product.originalPrice.toFixed(2)} DH</span>
                <span className="bg-pink-100 text-amber-700 text-sm px-2 py-0.5 rounded">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                </span>
              </div>
            ) : (
              <span className="text-base font-bold text-amber-700">{product.price.toFixed(2)} DH</span>
            )}
          </div>
          

          
          <hr className="my-6" />
          

          
          {/* Color options */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <h2 className="text-base font-medium mb-2">Couleur</h2>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(color => {
                  // Gestion du cas où color est un objet ou une chaîne
                  const colorKey = typeof color === 'object' ? color.id || color.name || JSON.stringify(color) : color;
                  const colorName = typeof color === 'object' ? (color.name || color.label) : color;
                  const colorCode = typeof color === 'object' && color.code ? color.code : null;
                  
                  return (
                    <button
                      key={colorKey}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-1 border rounded-full text-sm flex items-center ${
                        selectedColor === color 
                          ? 'bg-pink-100 border-amber-800 text-amber-800' 
                          : 'border-gray-300'
                      }`}
                    >
                      {colorCode && (
                        <span 
                          className="w-3 h-3 rounded-full mr-1" 
                          style={{ backgroundColor: colorCode }}
                        />
                      )}
                      {colorName}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Size options */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-medium">Taille</h2>
                    <SizeGuideModal /> 
                    
                {/* <button className="text-sm text-pink-600 hover:underline">Guide des tailles</button> */}
              </div>
              
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => {
                  // Gestion du cas où size est un objet ou une chaîne
                  const sizeKey = typeof size === 'object' ? size.id || size.name || JSON.stringify(size) : size;
                  const sizeName = typeof size === 'object' ? (size.name || size.label) : size;
                  
                  return (
                    <button
                      key={sizeKey}
                      onClick={() => setSelectedSize(size)}
                      className={`w-10 h-10 flex items-center justify-center border rounded-md ${
                        selectedSize === size
                          ? 'bg-pink-100 border-amber-800 text-amber-800' 
                          : 'border-gray-300'
                      }`}
                    >
                      {sizeName}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Quantity */}
          <div className="mb-6">
            <h2 className="text-base font-medium mb-2">Quantité</h2>
            <div className="flex items-center">
              <button 
                onClick={decreaseQuantity}
                className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-l-md"
                disabled={quantity <= 1}
              >
                <Minus size={16} />
              </button>
              <div className="w-14 h-10 flex items-center justify-center border-t border-b border-gray-300">
                {quantity}
              </div>
              <button 
                onClick={increaseQuantity}
                className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-r-md"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Description */}
        <div className="mb-6">
            <h2 className="text-base font-medium mb-2">Description</h2>
            <p className="text-sm text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, 
              nunc ut aliquam ultricies, nunc nisl aliquet nunc, ut aliquam nisl nisl 
              vitae nisl. Sed euismod, nunc ut aliquam ultricies, nunc nisl aliquet 
              nunc, ut aliquam nisl nisl vitae nisl.
            </p>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-4 mb-8">
            <button 
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`flex-grow flex items-center justify-center gap-2 px-6 py-3 rounded-lg shadow hover:shadow-md transform transition-all duration-300 ease-in-out ${
                product.inStock 
                  ? 'bg-amber-800 text-white hover:bg-amber-700' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              } transition-colors`}
            >
              <ShoppingBag size={20} />
              {product.inStock ? 'Ajouter au panier' : 'En rupture de stock'}
            </button>
            <button className="w-12 h-12 flex items-center justify-center border border-gray-300 rounded-lg shadow-sm hover:shadow-md hover:bg-gray-100 hover:text-amber-700 transition-all duration-200 ease-in-out">
              <Heart size={20} />
            </button>
            <button className="w-12 h-12 flex items-center justify-center border border-gray-300 rounded-lg shadow-sm hover:shadow-md hover:bg-gray-100 hover:text-amber-700 transition-all duration-200 ease-in-out">
              <Share size={20} />
            </button>
          </div>
          
          {/* Additional info */}
          <div className="space-y-4">
            <div className="flex items-start gap-3 py-3">
              <div className="text-amber-700">
                <Truck size={24} />
              </div>
              <div>
                <h3 className="font-medium">Livraison disponible</h3>
                <p className="text-sm text-gray-600">Paiement à la livraison disponible</p>
              </div>
            </div>
            <div className="flex items-start gap-3 py-3">
              <div className="text-amber-700">
                <Package size={24} />
              </div>
              <div>
                <h3 className="font-medium">Produit authentique</h3>
                <p className="text-sm text-gray-600">Qualité garantie</p>
              </div>
            </div>
            <div className="flex items-start gap-3 py-3">
              <div className="text-amber-700">
                <RefreshCcw size={24} />
              </div>
              <div>
                <h3 className="font-medium">Retours faciles</h3>
                <p className="text-sm text-gray-600">Retournez votre commande dans les 30 jours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      

    </Layout>
  );
};

export default ProductDetailPage;