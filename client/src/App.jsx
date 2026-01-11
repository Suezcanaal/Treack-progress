import React from 'react';
import { AuthProvider, useAuth } from './AuthContext.jsx';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import SheetView from './pages/SheetView.jsx';

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  const location = useLocation();
  if (!token) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

function PublicRoot() {
  const { token } = useAuth();
  if (token) return <Navigate to="/dashboard" replace />;
  return <Landing />;
}

function RouterApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicRoot />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/sheet/:id" element={<ProtectedRoute><SheetView /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RouterApp />
    </AuthProvider>
  );
}
