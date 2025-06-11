import React, { useState, useEffect, useCallback } from 'react';
import Button from '../components/Button';
import DataTable from '../components/shared/DataTable';
import FormInput from '../components/shared/FormInput';
import Modal from '../components/shared/Modal';
import { ProductsService } from '../services/products.service';
import { CategoriesService } from '../services/categories.service';
import { ColorsService } from '../services/colors.service';
import { SizesService } from '../services/sizes.service';
// Import notification context
import { useNotification } from '../context/NotificationContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [productImages, setProductImages] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categorieId: '',
    slug: ''
  });
  const { showNotification } = useNotification();

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ProductsService.getAllProducts();
      setProducts(data.products || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      showNotification('Failed to load products', 'error');
      setLoading(false);
    }
  }, [showNotification]);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await CategoriesService.getAllCategories();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      showNotification('Failed to load categories', 'error');
    }
  }, [showNotification]);

  const fetchColors = useCallback(async () => {
    try {
      const data = await ColorsService.getAllColors();
      setColors(data.colors || []);
    } catch (error) {
      console.error('Error fetching colors:', error);
      showNotification('Failed to load colors', 'error');
    }
  }, [showNotification]);

  const fetchSizes = useCallback(async () => {
    try {
      const data = await SizesService.getAllSizes();
      setSizes(data.sizes || []);
    } catch (error) {
      console.error('Error fetching sizes:', error);
      showNotification('Failed to load sizes', 'error');
    }
  }, [showNotification]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchColors();
    fetchSizes();
  }, [fetchProducts, fetchCategories, fetchColors, fetchSizes]);

  const fetchProductColors = async (productId) => {
    try {
      const data = await ProductsService.getProductColors(productId);
      return data.colors || [];
    } catch (error) {
      console.error(`Error fetching colors for product ${productId}:`, error);
      return [];
    }
  };

  const fetchProductSizes = async (productId) => {
    try {
      const data = await ProductsService.getProductSizes(productId);
      return data.sizes || [];
    } catch (error) {
      console.error(`Error fetching sizes for product ${productId}:`, error);
      return [];
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleColorChange = (e) => {
    const colorId = parseInt(e.target.value);
    if (e.target.checked) {
      setSelectedColors([...selectedColors, colorId]);
    } else {
      setSelectedColors(selectedColors.filter(id => id !== colorId));
    }
  };

  const handleSizeChange = (e) => {
    const sizeId = parseInt(e.target.value);
    if (e.target.checked) {
      setSelectedSizes([...selectedSizes, sizeId]);
    } else {
      setSelectedSizes(selectedSizes.filter(id => id !== sizeId));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Store the files for upload
      setImageFiles(prevFiles => [...prevFiles, ...files]);
      
      // Create previews for all files
      const readers = files.map(file => {
        return new Promise(resolve => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              file,
              preview: reader.result,
              isPrimary: imagePreview.length === 0 // First image is primary by default
            });
          };
          reader.readAsDataURL(file);
        });
      });
      
      // Wait for all file previews to be generated
      Promise.all(readers).then(newPreviews => {
        setImagePreview(prevPreviews => {
          // If there are no existing previews, mark the first new one as primary
          if (prevPreviews.length === 0 && newPreviews.length > 0) {
            newPreviews[0].isPrimary = true;
          }
          return [...prevPreviews, ...newPreviews];
        });
      });
    }
  };

  const removeImagePreview = (index) => {
    const newImageFiles = [...imageFiles];
    newImageFiles.splice(index, 1);
    setImageFiles(newImageFiles);
    
    const newImagePreview = [...imagePreview];
    newImagePreview.splice(index, 1);
    setImagePreview(newImagePreview);
  };

  const setPrimaryPreview = (index) => {
    const newImagePreview = imagePreview.map((img, i) => ({
      ...img,
      isPrimary: i === index
    }));
    setImagePreview(newImagePreview);
  };

  const fetchProductImages = async (productId) => {
    try {
      const response = await ProductsService.getProductImages(productId);
      setProductImages(response.images || []);
    } catch (error) {
      console.error('Error fetching product images:', error);
      // Don't show notification for 404 errors (no images yet)
      if (error.response && error.response.status !== 404) {
        showNotification('Failed to load product images', 'error');
      }
      // Return empty array instead of throwing
      return [];
    }
  };

  const deleteProductImage = async (imageId) => {
    try {
      await ProductsService.deleteProductImage(imageId);
      // Update the product images list
      setProductImages(productImages.filter(img => img.id !== imageId));
      showNotification('Image deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting product image:', error);
      showNotification('Failed to delete image', 'error');
    }
  };

  const setProductPrimaryImage = async (productId, imageId) => {
    try {
      await ProductsService.setPrimaryImage(productId, imageId);
      // Update the product images list to reflect the new primary image
      setProductImages(productImages.map(img => ({
        ...img,
        isPrimary: img.id === imageId
      })));
      showNotification('Primary image set successfully', 'success');
    } catch (error) {
      console.error('Error setting primary image:', error);
      showNotification('Failed to set primary image', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      categorieId: '',
      slug: ''
    });
    setSelectedColors([]);
    setSelectedSizes([]);
    setImageFiles([]);
    setImagePreview([]);
    setProductImages([]);
    setIsEditing(false);
    setSelectedProduct(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Validate form data
      if (!formData.name || !formData.price || !formData.stock) {
        showNotification('Please fill in all required fields', 'error');
        setLoading(false);
        return;
      }
      
      // Create slug from name if not provided
      if (!formData.slug) {
        formData.slug = formData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }
      
      // Format data to match backend expectations
      const productData = {
        ...formData,
        // Convert price to float/number
        price: parseFloat(formData.price),
        // Convert stock to integer
        stock: parseInt(formData.stock, 10),
        // Ensure categorieId is an integer if present
        categorieId: formData.categorieId ? parseInt(formData.categorieId, 10) : undefined
      };
      
      let productId;
      
      if (isEditing && selectedProduct) {
        // Update existing product
        await ProductsService.updateProduct(selectedProduct.id, productData);
        productId = selectedProduct.id;
        showNotification('Product updated successfully', 'success');
      } else {
        // Create new product
        const response = await ProductsService.createProduct(productData);
        productId = response.id;
        showNotification('Product created successfully', 'success');
      }
      
      // Process colors, sizes, and image only if we have a valid productId
      if (productId) {
        // Handle colors
        try {
          // Get current colors for the product
          const currentColors = isEditing ? await fetchProductColors(productId) : [];
          const currentColorIds = currentColors.map(color => color.id);
          
          // Add new colors
          for (const colorId of selectedColors) {
            if (!currentColorIds.includes(colorId)) {
              await ProductsService.addColorToProduct(productId, colorId);
            }
          }
          
          // Remove colors that were deselected
          for (const colorId of currentColorIds) {
            if (!selectedColors.includes(colorId)) {
              await ProductsService.removeColorFromProduct(productId, colorId);
            }
          }
        } catch (colorError) {
          console.error('Error updating product colors:', colorError);
          showNotification('Failed to update product colors', 'warning');
        }

        // Handle sizes
        try {
          const currentSizes = isEditing ? await fetchProductSizes(productId) : [];
          const currentSizeIds = currentSizes.map(size => size.id);
          
          // Add new sizes
          for (const sizeId of selectedSizes) {
            if (!currentSizeIds.includes(sizeId)) {
              await ProductsService.addSizeToProduct(productId, sizeId);
            }
          }
          
          // Remove sizes that were deselected
          for (const sizeId of currentSizeIds) {
            if (!selectedSizes.includes(sizeId)) {
              await ProductsService.removeSizeFromProduct(productId, sizeId);
            }
          }
        } catch (sizeError) {
          console.error('Error updating product sizes:', sizeError);
          showNotification('Failed to update product sizes', 'warning');
        }
        
        // Handle image uploads
        if (imageFiles.length > 0) {
          try {
            console.log(`Preparing to upload ${imageFiles.length} images for product ${productId}`);
            
            // Use bulk upload for multiple images
            const result = await ProductsService.uploadMultipleProductImages(productId, imageFiles);
            
            console.log('Upload result:', result);
            showNotification(`${result.images?.length || 0} product images uploaded successfully`, 'success');
            
            // If there were any failed uploads, show a warning
            if (result.failed && result.failed.length > 0) {
              showNotification(`${result.failed.length} images failed to upload`, 'warning');
            }
          } catch (imageError) {
            console.error('Error uploading product images:', imageError);
            showNotification('Failed to upload product images', 'warning');
          }
        }
      }
      
      // Reset form and refresh product list
      resetForm();
      setShowForm(false);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      showNotification('Failed to save product', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (product) => {
    setIsEditing(true);
    setSelectedProduct(product);
    setFormData({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categorieId: product.categorieId,
      slug: product.slug
    });
    
    // Fetch product colors, sizes, and images
    try {
      const productColors = await fetchProductColors(product.id);
      setSelectedColors(productColors.map(color => color.id));
      
      const productSizes = await fetchProductSizes(product.id);
      setSelectedSizes(productSizes.map(size => size.id));
      
      // Fetch product images
      await fetchProductImages(product.id);
      
      setShowForm(true);
    } catch (error) {
      console.error('Error fetching product details:', error);
      showNotification('Failed to load product details', 'error');
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;
    
    try {
      await ProductsService.deleteProduct(selectedProduct.id);
      showNotification('Product deleted successfully', 'success');
      fetchProducts();
      setShowDeleteModal(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      showNotification('Failed to delete product', 'error');
    }
  };

  const confirmDelete = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const columns = [
    { 
      key: 'name', 
      header: 'Name',
      render: (product) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{product.name}</div>
          <div className="text-sm text-gray-500">{product.slug}</div>
        </div>
      )
    },
    { 
      key: 'categorieId', 
      header: 'Category',
      render: (product) => {
        const category = categories.find(c => c.id === product.categorieId);
        return <span>{category ? category.name : 'Uncategorized'}</span>;
      }
    },
    { 
      key: 'price', 
      header: 'Price',
      render: (product) => <span>{product.price} MAD</span>
    },
    { 
      key: 'stock', 
      header: 'Stock',
      render: (product) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
        </span>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-amber-800">Products</h2>
        <Button onClick={() => {
          resetForm();
          setShowForm(!showForm);
        }}>
          {showForm ? 'View Products List' : 'Add New Product'}
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      ) : showForm ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-amber-800 mb-4">
            {isEditing ? 'Edit Product' : 'New Product'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <FormInput
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                
                <FormInput
                  label="Description"
                  name="description"
                  type="textarea"
                  value={formData.description}
                  onChange={handleInputChange}
                />
                
                <FormInput
                  label="Slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="product-url-slug"
                />
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Images</label>
                  <div className="mt-1 flex items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      multiple
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-amber-50 file:text-amber-700
                        hover:file:bg-amber-100"
                    />
                  </div>
                  
                  {/* New image previews */}
                  {imagePreview.length > 0 && (
                    <div className="mt-2">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">New Images</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {imagePreview.map((img, index) => (
                          <div key={`new-${index}`} className="relative group">
                            <img 
                              src={img.preview} 
                              alt={`Preview ${index}`} 
                              className={`h-24 w-full object-cover rounded-md ${img.isPrimary ? 'ring-2 ring-amber-500' : ''}`} 
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <button 
                                type="button" 
                                onClick={() => removeImagePreview(index)}
                                className="p-1 bg-red-500 text-white rounded-full mr-2"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                              <button 
                                type="button" 
                                onClick={() => setPrimaryPreview(index)}
                                className="p-1 bg-amber-500 text-white rounded-full"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                              </button>
                            </div>
                            {img.isPrimary && (
                              <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs px-1 rounded-bl-md rounded-tr-md">
                                Primary
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Existing images (when editing) */}
                  {isEditing && productImages.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Existing Images</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {productImages.map((img) => (
                          <div key={img.id} className="relative group">
                            <img 
                              src={`http://localhost:4000${img.imageUrl}`} 
                              alt={`Product ${img.id}`} 
                              className={`h-24 w-full object-cover rounded-md ${img.isPrimary ? 'ring-2 ring-amber-500' : ''}`} 
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <button 
                                type="button" 
                                onClick={() => deleteProductImage(img.id)}
                                className="p-1 bg-red-500 text-white rounded-full mr-2"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                              <button 
                                type="button" 
                                onClick={() => setProductPrimaryImage(selectedProduct.id, img.id)}
                                className="p-1 bg-amber-500 text-white rounded-full"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                              </button>
                            </div>
                            {img.isPrimary && (
                              <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs px-1 rounded-bl-md rounded-tr-md">
                                Primary
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <FormInput
                  label="Category"
                  name="categorieId"
                  type="select"
                  value={formData.categorieId}
                  onChange={handleInputChange}
                  options={[
                    { value: '', label: 'Select a category' },
                    ...categories.map(category => ({
                      value: category.id,
                      label: category.name
                    }))
                  ]}
                  required
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    label="Price (MAD)"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                  
                  <FormInput
                    label="Stock"
                    name="stock"
                    type="number"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Colors</label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border border-gray-300 rounded-md">
                    {colors.map(color => (
                      <div key={color.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`color-${color.id}`}
                          value={color.id}
                          checked={selectedColors.includes(color.id)}
                          onChange={handleColorChange}
                          className="mr-2"
                        />
                        <label htmlFor={`color-${color.id}`} className="flex items-center">
                          <div 
                            className="w-4 h-4 rounded-full mr-2" 
                            style={{ backgroundColor: color.code }}
                          ></div>
                          <span>{color.name}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sizes</label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border border-gray-300 rounded-md">
                    {sizes.map(size => (
                      <div key={size.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`size-${size.id}`}
                          value={size.id}
                          checked={selectedSizes.includes(size.id)}
                          onChange={handleSizeChange}
                          className="mr-2"
                        />
                        <label htmlFor={`size-${size.id}`}>{size.name}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-6 space-x-3">
              <Button 
                type="button" 
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800"
              >
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? 'Update Product' : 'Save Product'}
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-amber-800 mb-4">Products List</h3>
          <DataTable
            columns={columns}
            data={products}
            onEdit={handleEdit}
            onDelete={confirmDelete}
            emptyMessage="No products available"
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Delete"
      >
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            Are you sure you want to delete this product? This action cannot be undone.
          </p>
        </div>
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={handleDelete}
          >
            Delete
          </button>
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 sm:mt-0 sm:w-auto sm:text-sm"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Products;
