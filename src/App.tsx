import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import AdminPage from './pages/AdminPage';
import LivreurPage from './pages/LivreurPage';
import ProtectedRoute from './components/ProtectedRoute';

import { Toaster } from 'sonner';

function App() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <img src="/src/assets/logo.jpeg" className="w-20 h-20 rounded-full" alt="" />
      <h1 className="text-4xl font-bold mb-6 ">Sycelim Delivery</h1>

      <Router>
        <Routes>
          <Route path="/" element={<HomeWithNav />} />
          <Route path="/login" element={<LoginWithNav />} />
          <Route path="/register" element={<RegisterWithNav />} />
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminPage />
            </ProtectedRoute>
          } />
          <Route path="/livreur" element={
            <ProtectedRoute allowedRoles={["livreur"]}>
              <LivreurPage />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
      <Toaster position="top-right" richColors/>
    </div>
  );
}

function HomeWithNav() {
  const navigate = useNavigate();
  return <Home onLogin={() => navigate('/login')} onRegister={() => navigate('/register')} />;
}

function LoginWithNav() {
  const navigate = useNavigate();
  return <Login onSwitch={() => navigate('/register')} onBack={() => navigate('/')} />;
}

function RegisterWithNav() {
  const navigate = useNavigate();
  return <Register onSwitch={() => navigate('/login')} onBack={() => navigate('/')} />;
}

export default App;

