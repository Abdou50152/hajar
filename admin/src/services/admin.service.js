import api from './api';

export const AdminService = {
  // Login admin
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      
      // Store token and user data in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      // Check if user is admin
      if (response.data.user && response.data.user.role !== 'admin') {
        throw new Error('Unauthorized: Admin access required');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  // Get admin profile
  getProfile: async () => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await api.get('/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Check if user is admin
      if (response.data && response.data.role !== 'admin') {
        throw new Error('Unauthorized: Admin access required');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      throw error;
    }
  },

  // Get all admins
  getAllAdmins: async (skip = 0, limit = 10) => {
    try {
      const response = await api.get(`/admin?skip=${skip}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching admins:', error);
      throw error;
    }
  },

  // Get admin by ID
  getAdminById: async (id) => {
    try {
      const response = await api.get(`/admin/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching admin with id ${id}:`, error);
      throw error;
    }
  },

  // Create new admin
  createAdmin: async (adminData) => {
    try {
      const response = await api.post('/admin', adminData);
      return response.data;
    } catch (error) {
      console.error('Error creating admin:', error);
      throw error;
    }
  },

  // Update admin
  updateAdmin: async (id, adminData) => {
    try {
      const response = await api.put(`/admin/${id}`, adminData);
      return response.data;
    } catch (error) {
      console.error(`Error updating admin with id ${id}:`, error);
      throw error;
    }
  },

  // Delete admin
  deleteAdmin: async (id) => {
    try {
      const response = await api.delete(`/admin/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting admin with id ${id}:`, error);
      throw error;
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await api.post('/admin/change-password', passwordData);
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  },
  
  // Logout admin
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect to frontend client site after logout
    window.location.href = 'http://localhost:5000';
  },
  
  // Check if user is authenticated and is admin
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) return false;
    
    try {
      const userData = JSON.parse(user);
      return userData.role === 'admin';
    } catch (error) {
      console.error('Error parsing user data:', error);
      return false;
    }
  }
};

export default AdminService;
