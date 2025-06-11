import React, { useState, useEffect, useCallback } from 'react';
import Button from '../components/Button';
import DataTable from '../components/shared/DataTable';
import FormInput from '../components/shared/FormInput';
import Modal from '../components/shared/Modal';
import { UsersService } from '../services/users.service';
import { useNotification } from '../context/NotificationContext';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: ''
  });
  const { showNotification } = useNotification();

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await UsersService.getAllUsers();
      setUsers(data.users || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      showNotification('Failed to load users', 'error');
      setLoading(false);
    }
  }, [showNotification]);
  
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      password: ''
    });
    setIsEditing(false);
    setSelectedUser(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isEditing && selectedUser) {
        // Remove password if it's empty (not being updated)
        const userData = {...formData};
        if (!userData.password) {
          delete userData.password;
        }
        
        await UsersService.updateUser(selectedUser.id, userData);
        showNotification('User updated successfully', 'success');
      } else {
        await UsersService.createUser(formData);
        showNotification('User created successfully', 'success');
      }
      
      fetchUsers();
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error('Error saving user:', error);
      showNotification('Failed to save user', 'error');
    }
  };

  const handleEdit = (user) => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      password: '' // Don't populate password for security reasons
    });
    setSelectedUser(user);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    
    try {
      await UsersService.deleteUser(selectedUser.id);
      showNotification('User deleted successfully', 'success');
      fetchUsers();
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      showNotification('Failed to delete user', 'error');
    }
  };

  const confirmDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const columns = [
    { 
      key: 'name', 
      header: 'Name',
      render: (user) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{user.name}</div>
          <div className="text-sm text-gray-500">{user.email}</div>
        </div>
      )
    },
    { 
      key: 'contact', 
      header: 'Contact',
      render: (user) => (
        <div>
          <div className="text-sm text-gray-500">{user.phone}</div>
          <div className="text-sm text-gray-500 truncate max-w-xs">{user.address}</div>
        </div>
      )
    },
    { 
      key: 'orders', 
      header: 'Orders',
      render: (user) => (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
          {user.orders?.length || 0} orders
        </span>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-amber-800">Users</h2>
        <Button onClick={() => {
          resetForm();
          setShowForm(!showForm);
        }}>
          {showForm ? 'View Users List' : 'Add New User'}
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      ) : showForm ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-amber-800 mb-4">
            {isEditing ? 'Edit User' : 'New User'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormInput
                  label="Name"
                  name="name"
                  value={formData.name}
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
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <FormInput
                  label="Address"
                  name="address"
                  type="textarea"
                  value={formData.address}
                  onChange={handleInputChange}
                />
                
                <FormInput
                  label={isEditing ? "New Password (leave empty to keep current)" : "Password"}
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required={!isEditing}
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
                {isEditing ? 'Update User' : 'Save User'}
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-amber-800 mb-4">Users List</h3>
          <DataTable
            columns={columns}
            data={users}
            onEdit={handleEdit}
            onDelete={confirmDelete}
            emptyMessage="No users available"
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
            Are you sure you want to delete this user? This action cannot be undone.
          </p>
          <p className="text-sm text-red-500 mt-2">
            Warning: Deleting a user will also delete all associated orders and data.
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

export default Users;
