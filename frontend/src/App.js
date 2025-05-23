import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import UsuariosPage from './pages/UsuariosPage';
import LoginPage from './pages/LoginPage';
import './App.css';
import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  const location = useLocation();
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function Navbar() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  if (!token) return null;
  return (
    <AppBar position="static" color="default" sx={{ mb: 2 }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Button color="inherit" component={Link} to="/">Inicio</Button>
          <Button color="inherit" component={Link} to="/usuarios">Usuarios</Button>
        </Box>
        <Button color="error" variant="outlined" onClick={handleLogout}>Logout</Button>
      </Toolbar>
    </AppBar>
  );
}

function HomeInfo() {
  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 6, p: 3, bgcolor: 'white', borderRadius: 2, boxShadow: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>M3: Práctica Final</Typography>
      <Typography variant="h6" align="center" gutterBottom>Gestión de Usuarios (CRUD)</Typography>
      <Typography variant="body1" align="center" sx={{ mb: 2 }}>
        Esta es una página de gestión de usuarios donde puedes crear, leer, actualizar y eliminar usuarios.<br/>
        Utiliza un backend Node.js con SQL Server y un frontend en React con Material UI.<br/>
        Accede a la sección "Usuarios" para gestionar la información.
      </Typography>
      <Typography variant="subtitle1" align="center" color="text.secondary">
        Autor: Mauricio Perea
      </Typography>
    </Box>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={
          <PrivateRoute>
            <HomeInfo />
          </PrivateRoute>
        } />
        <Route path="/usuarios" element={
          <PrivateRoute>
            <UsuariosPage />
          </PrivateRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
