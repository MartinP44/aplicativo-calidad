import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <>
      {/* Barra de navegación en la parte superior */}
      <Navbar />

      {/* Contenedor principal: aquí saldrán las páginas */}
      <div className="container mt-4">
        <Outlet />
      </div>
    </>
  );
}
