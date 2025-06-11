// src/App.js
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Articles from "./pages/Articles";
import Orders from "./pages/Orders";
import Admin from "./pages/admin";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Colors from "./pages/Colors";
import Sizes from "./pages/Sizes";
import Users from "./pages/Users";
import Admins from "./pages/Admins";
import Login from "./pages/Login";
import { NotificationProvider } from "./context/NotificationContext";
import AuthMiddleware from "./middleware/AuthMiddleware";
import { AdminService } from "./services/admin.service";

function App() {
  useEffect(() => {
    // Create default admin account when the app loads
    // This is just to ensure the admin account exists for demo purposes
    // In a real application, this would be handled during backend setup
    const checkAdminExists = async () => {
      try {
        // Check if admin is already logged in
        if (AdminService.isAuthenticated()) {
          console.log('Admin already authenticated');
        }
      } catch (error) {
        console.error('Error checking admin authentication:', error);
      }
    };

    checkAdminExists();
  }, []);

  return (
    <NotificationProvider>
      <Router>
        <Routes>
          {/* Redirect login page to dashboard */}
          <Route path="/login" element={<Navigate to="/dashboard" replace />} />

          {/* Protected routes that require admin authentication */}
          <Route path="/" element={
            <AuthMiddleware>
              <Layout>
                <Dashboard />
              </Layout>
            </AuthMiddleware>
          } />

          <Route path="/dashboard" element={
            <AuthMiddleware>
              <Layout>
                <Dashboard />
              </Layout>
            </AuthMiddleware>
          } />

          {/* Other protected routes */}
          <Route path="/articles" element={
            <AuthMiddleware>
              <Layout>
                <Articles />
              </Layout>
            </AuthMiddleware>
          } />

          <Route path="/products" element={
            <AuthMiddleware>
              <Layout>
                <Products />
              </Layout>
            </AuthMiddleware>
          } />

          <Route path="/categories" element={
            <AuthMiddleware>
              <Layout>
                <Categories />
              </Layout>
            </AuthMiddleware>
          } />

          <Route path="/colors" element={
            <AuthMiddleware>
              <Layout>
                <Colors />
              </Layout>
            </AuthMiddleware>
          } />

          <Route path="/sizes" element={
            <AuthMiddleware>
              <Layout>
                <Sizes />
              </Layout>
            </AuthMiddleware>
          } />

          <Route path="/orders" element={
            <AuthMiddleware>
              <Layout>
                <Orders />
              </Layout>
            </AuthMiddleware>
          } />

          <Route path="/users" element={
            <AuthMiddleware>
              <Layout>
                <Users />
              </Layout>
            </AuthMiddleware>
          } />

          <Route path="/admins" element={
            <AuthMiddleware>
              <Layout>
                <Admins />
              </Layout>
            </AuthMiddleware>
          } />

          <Route path="/admin" element={
            <AuthMiddleware>
              <Layout>
                <Admin />
              </Layout>
            </AuthMiddleware>
          } />

          {/* Redirect all other routes to dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </NotificationProvider>
  );
}

export default App;
