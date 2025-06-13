import React, { useState, useEffect, useCallback } from 'react';
import Button from '../components/Button';
import DataTable from '../components/shared/DataTable';
import FormInput from '../components/shared/FormInput';
import Modal from '../components/shared/Modal';
import { AdminService } from '../services/admin.service';
import { useNotification } from '../context/NotificationContext';

const Admins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'admin'
  });
  const { showNotification } = useNotification();

  const fetchAdmins = useCallback(async () => {
    try {
      setLoading(true);
      
      // Données de test statiques pour les administrateurs
      const testAdmins = [
        {
          id: 1,
          username: 'hajar',
          email: 'hajar@admin.com',
          role: 'superadmin'
        },
        {
          id: 2,
          username: 'admin',
          email: 'admin@example.com',
          role: 'admin'
        }
      ];
      
      setAdmins(testAdmins);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des administrateurs:', error);
      showNotification('Échec du chargement des administrateurs', 'error');
      setLoading(false);
    }
  }, [showNotification]);
  
  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'admin'
    });
    setIsEditing(false);
    setSelectedAdmin(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isEditing && selectedAdmin) {
        // Remove password if it's empty (not being updated)
        const adminData = {...formData};
        if (!adminData.password) {
          delete adminData.password;
        }
        
        await AdminService.updateAdmin(selectedAdmin.id, adminData);
        showNotification('Admin updated successfully', 'success');
      } else {
        await AdminService.createAdmin(formData);
        showNotification('Admin created successfully', 'success');
      }
      
      fetchAdmins();
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error('Error saving admin:', error);
      showNotification('Failed to save admin', 'error');
    }
  };

  const handleEdit = (admin) => {
    setFormData({
      username: admin.username || '',
      email: admin.email || '',
      password: '', // Don't populate password for security reasons
      role: admin.role || 'admin'
    });
    setSelectedAdmin(admin);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!selectedAdmin) return;
    
    try {
      await AdminService.deleteAdmin(selectedAdmin.id);
      showNotification('Admin deleted successfully', 'success');
      fetchAdmins();
      setShowDeleteModal(false);
      setSelectedAdmin(null);
    } catch (error) {
      console.error('Error deleting admin:', error);
      showNotification('Failed to delete admin', 'error');
    }
  };

  const confirmDelete = (admin) => {
    setSelectedAdmin(admin);
    setShowDeleteModal(true);
  };

  const columns = [
    { 
      key: 'username', 
      header: 'Username',
      render: (admin) => (
        <div className="text-sm font-medium text-gray-900">{admin.username}</div>
      )
    },
    { 
      key: 'email', 
      header: 'Email',
      render: (admin) => (
        <div className="text-sm text-gray-500">{admin.email}</div>
      )
    },
    { 
      key: 'role', 
      header: 'Role',
      render: (admin) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          admin.role === 'superadmin' 
            ? 'bg-purple-100 text-purple-800' 
            : 'bg-blue-100 text-blue-800'
        }`}>
          {admin.role}
        </span>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-amber-800">Admins</h2>
        <Button onClick={() => {
          resetForm();
          setShowForm(!showForm);
        }}>
          {showForm ? 'View Admins List' : 'Add New Admin'}
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      ) : showForm ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-amber-800 mb-4">
            {isEditing ? 'Edit Admin' : 'New Admin'}
          </h3>
          <form onSubmit={handleSubmit}>
            <FormInput
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
            
            <FormInput
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            
            <FormInput
              label={isEditing ? "New Password (leave empty to keep current)" : "Password"}
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required={!isEditing}
            />
            
            <FormInput
              label="Role"
              name="role"
              type="select"
              value={formData.role}
              onChange={handleInputChange}
              options={[
                { value: 'admin', label: 'Admin' },
                { value: 'superadmin', label: 'Super Admin' }
              ]}
              required
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
                {isEditing ? 'Update Admin' : 'Save Admin'}
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-amber-800 mb-4">Admins List</h3>
          <DataTable
            columns={columns}
            data={admins}
            onEdit={handleEdit}
            onDelete={confirmDelete}
            emptyMessage="No admins available"
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
            Are you sure you want to delete this admin? This action cannot be undone.
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

export default Admins;
