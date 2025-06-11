import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import DataTable from '../components/shared/DataTable';
import FormInput from '../components/shared/FormInput';
import Modal from '../components/shared/Modal';
import { CategoriesService } from '../services/categories.service';
// Import notification context
import { useNotification } from '../context/NotificationContext';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: ''
  });
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await CategoriesService.getAllCategories();
      setCategories(data.categories || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      showNotification('Failed to load categories', 'error');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      slug: ''
    });
    setIsEditing(false);
    setSelectedCategory(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isEditing && selectedCategory) {
        await CategoriesService.updateCategory(selectedCategory.id, formData);
        showNotification('Category updated successfully', 'success');
      } else {
        await CategoriesService.createCategory(formData);
        showNotification('Category created successfully', 'success');
      }
      
      fetchCategories();
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error('Error saving category:', error);
      showNotification('Failed to save category', 'error');
    }
  };

  const handleEdit = (category) => {
    setFormData({
      name: category.name || '',
      description: category.description || '',
      slug: category.slug || ''
    });
    setSelectedCategory(category);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;
    
    try {
      await CategoriesService.deleteCategory(selectedCategory.id);
      showNotification('Category deleted successfully', 'success');
      fetchCategories();
      setShowDeleteModal(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error('Error deleting category:', error);
      showNotification('Failed to delete category', 'error');
    }
  };

  const confirmDelete = (category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const columns = [
    { 
      key: 'name', 
      header: 'Name',
      render: (category) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{category.name}</div>
          <div className="text-sm text-gray-500">{category.slug}</div>
        </div>
      )
    },
    { 
      key: 'description', 
      header: 'Description',
      render: (category) => (
        <div className="text-sm text-gray-500 max-w-md truncate">
          {category.description || 'No description'}
        </div>
      )
    },
    { 
      key: 'productsCount', 
      header: 'Products',
      render: (category) => (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
          {category.products?.length || 0} products
        </span>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-amber-800">Categories</h2>
        <Button onClick={() => {
          resetForm();
          setShowForm(!showForm);
        }}>
          {showForm ? 'View Categories List' : 'Add New Category'}
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      ) : showForm ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-amber-800 mb-4">
            {isEditing ? 'Edit Category' : 'New Category'}
          </h3>
          <form onSubmit={handleSubmit}>
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
              placeholder="category-url-slug"
            />
            
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
                {isEditing ? 'Update Category' : 'Save Category'}
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-amber-800 mb-4">Categories List</h3>
          <DataTable
            columns={columns}
            data={categories}
            onEdit={handleEdit}
            onDelete={confirmDelete}
            emptyMessage="No categories available"
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
            Are you sure you want to delete this category? This action cannot be undone.
          </p>
          <p className="text-sm text-red-500 mt-2">
            Warning: Deleting a category may affect products associated with it.
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

export default Categories;
