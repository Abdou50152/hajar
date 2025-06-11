import React, { useState } from 'react';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import Dashboard from './Dashboard';
import Articles from './Articles';
import Orders from './Orders';
import Products from './Products';
import Categories from './Categories';
import Colors from './Colors';
import Sizes from './Sizes';
import Users from './Users';
import Admins from './Admins';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-amber-50">
      <Header />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="max-w-7xl mx-auto p-6">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'products' && <Products />}
        {activeTab === 'categories' && <Categories />}
        {activeTab === 'colors' && <Colors />}
        {activeTab === 'sizes' && <Sizes />}
        {activeTab === 'articles' && <Articles />}
        {activeTab === 'orders' && <Orders />}
        {activeTab === 'users' && <Users />}
        {activeTab === 'admins' && <Admins />}
      </main>
    </div>
  );
};

export default Admin;