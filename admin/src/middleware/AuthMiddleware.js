import React from 'react';

// Auth middleware component - now bypasses authentication checks
const AuthMiddleware = ({ children }) => {
  // Auto-authenticate everyone without checks
  // Set default admin data in localStorage if needed
  if (!localStorage.getItem('user')) {
    const defaultAdmin = {
      id: 1,
      email: 'admin@example.com',
      full_name: 'Administrator',
      role: 'admin'
    };
    localStorage.setItem('user', JSON.stringify(defaultAdmin));
    localStorage.setItem('token', 'bypass-auth-token');
  }

  // Always render children without authentication check
  return children;
};

export default AuthMiddleware;
