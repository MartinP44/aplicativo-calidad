import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, almacenarCredenciales } from '../services/authService';
import logo from '../assets/images/logo.png'

export default function Login({ setUser }) {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const manejarSubmit = (e) => {
        e.preventDefault();

        // 1) Intentamos autenticar con backend
        login(username, password)
            .then(res => {
                // Si llega aquí, las credenciales son válidas.
                const usuarios = res.data; // array de todos los usuarios
                // Buscamos el objeto que coincide con el username para extraer su rol
                const encontrado = usuarios.find(u => u.username === username);
                const rol = encontrado ? encontrado.rol : 'USER';

                // 2) Guardamos credenciales en localStorage
                almacenarCredenciales(username, password, rol);

                // 3) Actualizamos el estado “user” en App.js
                setUser({ username, auth: window.btoa(`${username}:${password}`), rol });

                // 4) Redirigimos a Home
                navigate('/');
            })
            .catch(err => {
                console.error('Error en login:', err);
                setError('Usuario o contraseña incorrectos');
                // Limpiamos los campos
                setUsername('');
                setPassword('');
            });
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '400px' }}>
            <div className="text-center mb-4">
                <img src={logo} alt="logo peluqueria" style={{width: '150px'}}/>
            </div>
            <h2 className="mb-4">Iniciar Sesión</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={manejarSubmit}>
                <div className="mb-3">
                    <label className="form-label">Usuario</label>
                    <input
                        type="text"
                        className="form-control"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary-custom w-100">
                    Ingresar
                </button>
            </form>
        </div>
    );
}
