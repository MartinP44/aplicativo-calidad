// src/App.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Layout from './components/Layout';
import Home from './pages/Home';
import Clientes from './pages/Clientes';
import Productos from './pages/Productos';
import Citas from './pages/Citas';
import Stock from './pages/Stock';
import Factura from './pages/Factura';
import Login from './pages/Login';
import AdminUsuarios from './pages/AdminUsuarios'; // si existe

function App() {
  // 1) Cambiamos la lectura “estática” de localStorage por un estado reactivo:
  const [user, setUser] = useState(() => {
    // Esto solo corre una vez al montar el componente
    return JSON.parse(localStorage.getItem('user'));
  });

  return (
    <Router>
      <Routes>
        {/* 2) Ruta de login: pasamos setUser para que Login.jsx pueda actualizar el estado cuando loguee */}
        <Route path="/login" element={<Login setUser={setUser} />} />

        {/* 3) El resto de rutas (“/*”) solo se monta si user != null */}
        <Route
          path="/*"
          element={
            user ? (
              <Layout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<Home />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="productos" element={<Productos />} />
          <Route path="citas" element={<Citas />} />
          <Route path="stock" element={<Stock />} />
          <Route path="facturacion" element={<Factura />} />

          {/* Solo ADMIN ve esta ruta */}
          {user && user.rol === 'ADMIN' && (
            <Route path="usuarios" element={<AdminUsuarios />} />
          )}

          {/* Cualquier otro path redirige a home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
