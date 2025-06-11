import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// This component is deprecated and redirects to Products page
const Articles = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to Products page on mount
    navigate('/products');
  }, [navigate]);

  return (
    <div className="p-6">
      <p className="text-gray-500">Redirecting to Products page...</p>
    </div>
  );
};

export default Articles;