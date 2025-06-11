import React, { useState, useEffect, useCallback } from 'react';
import Button from '../components/Button';
import DataTable from '../components/shared/DataTable';
import FormInput from '../components/shared/FormInput';
import Modal from '../components/shared/Modal';
import { SizesService } from '../services/sizes.service';
import { useNotification } from '../context/NotificationContext';

const Sizes = () => {
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const { showNotification } = useNotification();

  const fetchSizes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await SizesService.getAllSizes();
      setSizes(data.sizes || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sizes:', error);
      showNotification('Failed to load sizes', 'error');
      setLoading(false);
    }
  }, [showNotification]);
  
  useEffect(() => {
    fetchSizes();
  }, [fetchSizes]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: ''
    });
    setIsEditing(false);
    setSelectedSize(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isEditing && selectedSize) {
        await SizesService.updateSize(selectedSize.id, formData);
        showNotification('Size updated successfully', 'success');
      } else {
        await SizesService.createSize(formData);
        showNotification('Size created successfully', 'success');
      }
      
      fetchSizes();
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error('Error saving size:', error);
      showNotification('Failed to save size', 'error');
    }
  };

  const handleEdit = (size) => {
    setFormData({
      name: size.name || '',
      description: size.description || ''
    });
    setSelectedSize(size);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!selectedSize) return;
    
    try {
      await SizesService.deleteSize(selectedSize.id);
      showNotification('Size deleted successfully', 'success');
      fetchSizes();
      setShowDeleteModal(false);
      setSelectedSize(null);
    } catch (error) {
      console.error('Error deleting size:', error);
      showNotification('Failed to delete size', 'error');
    }
  };

  const confirmDelete = (size) => {
    setSelectedSize(size);
    setShowDeleteModal(true);
  };

  const columns = [
    { 
      key: 'name', 
      header: 'Name',
      render: (size) => (
        <div className="text-sm font-medium text-gray-900">{size.name}</div>
      )
    },
    { 
      key: 'description', 
      header: 'Description',
      render: (size) => (
        <div className="text-sm text-gray-500 max-w-md truncate">
          {size.description || 'No description'}
        </div>
      )
    },
    { 
      key: 'productsCount', 
      header: 'Products',
      render: (size) => (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
          {size.products?.length || 0} products
        </span>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-amber-800">Sizes</h2>
        <Button onClick={() => {
          resetForm();
          setShowForm(!showForm);
        }}>
          {showForm ? 'View Sizes List' : 'Add New Size'}
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      ) : showForm ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-amber-800 mb-4">
            {isEditing ? 'Edit Size' : 'New Size'}
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
                {isEditing ? 'Update Size' : 'Save Size'}
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-amber-800 mb-4">Sizes List</h3>
          <DataTable
            columns={columns}
            data={sizes}
            onEdit={handleEdit}
            onDelete={confirmDelete}
            emptyMessage="No sizes available"
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
            Are you sure you want to delete this size? This action cannot be undone.
          </p>
          <p className="text-sm text-red-500 mt-2">
            Warning: Deleting a size may affect products associated with it.
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

export default Sizes;
