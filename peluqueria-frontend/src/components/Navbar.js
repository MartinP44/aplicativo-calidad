import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png'

// Función para extraer rol de localStorage
function obtenerRol() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.rol : null;
}

export default function Navbar() {
    const navigate = useNavigate();
    const rol = obtenerRol();

    const logout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-custom">
            <div className="container-fluid">
                <NavLink className="navbar-brand" to="/">
                    <img src={logo} alt='Logo peluqueria' style={{width: '40px', marginRight: '8px'}}/>
                    <span>Peluquería</span>
                </NavLink>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon" />
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    isActive ? 'nav-link active' : 'nav-link'
                                }
                            >
                                Home
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                to="/clientes"
                                className={({ isActive }) =>
                                    isActive ? 'nav-link active' : 'nav-link'
                                }
                            >
                                Clientes
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                to="/productos"
                                className={({ isActive }) =>
                                    isActive ? 'nav-link active' : 'nav-link'
                                }
                            >
                                Productos
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                to="/citas"
                                className={({ isActive }) =>
                                    isActive ? 'nav-link active' : 'nav-link'
                                }
                            >
                                Citas
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                to="/stock"
                                className={({ isActive }) =>
                                    isActive ? 'nav-link active' : 'nav-link'
                                }
                            >
                                Stock
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                to="/facturacion"
                                className={({ isActive }) =>
                                    isActive ? 'nav-link active' : 'nav-link'
                                }
                            >
                                Facturación
                            </NavLink>
                        </li>

                        {/* Enlace Usuarios: solo si rol === "ADMIN" */}
                        {rol === 'ADMIN' && (
                            <li className="nav-item">
                                <NavLink
                                    to="/usuarios"
                                    className={({ isActive }) =>
                                        isActive ? 'nav-link active' : 'nav-link'
                                    }
                                >
                                    Usuarios
                                </NavLink>
                            </li>
                        )}
                    </ul>

                    {/* Botón de Logout en el extremo derecho */}
                    <button className="btn btn-outline-light" onClick={logout}>
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </nav>
    );
}
