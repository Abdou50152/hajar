import React, { useState, useEffect, useCallback } from 'react';
import Button from '../components/Button';
import DataTable from '../components/shared/DataTable';
import FormInput from '../components/shared/FormInput';
import Modal from '../components/shared/Modal';
import { ColorsService } from '../services/colors.service';
import { useNotification } from '../context/NotificationContext';

const Colors = () => {
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: ''
  });
  const { showNotification } = useNotification();

  const fetchColors = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ColorsService.getAllColors();
      setColors(data.colors || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching colors:', error);
      showNotification('Failed to load colors', 'error');
      setLoading(false);
    }
  }, [showNotification]);
  
  useEffect(() => {
    fetchColors();
  }, [fetchColors]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: ''
    });
    setIsEditing(false);
    setSelectedColor(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isEditing && selectedColor) {
        await ColorsService.updateColor(selectedColor.id, formData);
        showNotification('Color updated successfully', 'success');
      } else {
        await ColorsService.createColor(formData);
        showNotification('Color created successfully', 'success');
      }
      
      fetchColors();
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error('Error saving color:', error);
      showNotification('Failed to save color', 'error');
    }
  };

  const handleEdit = (color) => {
    setFormData({
      name: color.name || '',
      code: color.code || ''
    });
    setSelectedColor(color);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!selectedColor) return;
    
    try {
      await ColorsService.deleteColor(selectedColor.id);
      showNotification('Color deleted successfully', 'success');
      fetchColors();
      setShowDeleteModal(false);
      setSelectedColor(null);
    } catch (error) {
      console.error('Error deleting color:', error);
      showNotification('Failed to delete color', 'error');
    }
  };

  const confirmDelete = (color) => {
    setSelectedColor(color);
    setShowDeleteModal(true);
  };

  const columns = [
    { 
      key: 'name', 
      header: 'Name',
      render: (color) => (
        <div className="flex items-center">
          <div 
            className="w-6 h-6 rounded-full mr-2" 
            style={{ backgroundColor: color.code }}
          ></div>
          <div className="text-sm font-medium text-gray-900">{color.name}</div>
        </div>
      )
    },
    { 
      key: 'code', 
      header: 'Color Code',
      render: (color) => (
        <div className="text-sm text-gray-500">
          {color.code}
        </div>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-amber-800">Colors</h2>
        <Button onClick={() => {
          resetForm();
          setShowForm(!showForm);
        }}>
          {showForm ? 'View Colors List' : 'Add New Color'}
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      ) : showForm ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-amber-800 mb-4">
            {isEditing ? 'Edit Color' : 'New Color'}
          </h3>
          <form onSubmit={handleSubmit}>
            <FormInput
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Color Code</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                  className="h-10 w-10 rounded-md border border-gray-300"
                />
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                  placeholder="#RRGGBB"
                  required
                />
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
                {isEditing ? 'Update Color' : 'Save Color'}
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-amber-800 mb-4">Colors List</h3>
          <DataTable
            columns={columns}
            data={colors}
            onEdit={handleEdit}
            onDelete={confirmDelete}
            emptyMessage="No colors available"
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
            Are you sure you want to delete this color? This action cannot be undone.
          </p>
          <p className="text-sm text-red-500 mt-2">
            Warning: Deleting a color may affect products associated with it.
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

export default Colors;
