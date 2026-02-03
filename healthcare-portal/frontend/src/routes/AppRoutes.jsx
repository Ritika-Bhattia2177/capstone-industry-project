import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import Loader from '../components/Loader';

// Lazy load all pages for better performance
const Login = lazy(() => import('../pages/Login'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Search = lazy(() => import('../pages/Search'));
const Book = lazy(() => import('../pages/Book'));
const Appointments = lazy(() => import('../pages/Appointments'));
const Profile = lazy(() => import('../pages/Profile'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />
      
      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/search" 
        element={
          <ProtectedRoute>
            <Search />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/book" 
        element={
          <ProtectedRoute>
            <Book />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/appointments" 
        element={
          <ProtectedRoute>
            <Appointments />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
      
      {/* Redirect root to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* 404 Route */}
      <Route path="*" element={<div style={{ padding: '20px' }}><h1>404 - Page Not Found</h1></div>} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
