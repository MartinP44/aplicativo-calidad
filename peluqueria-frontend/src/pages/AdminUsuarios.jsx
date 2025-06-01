import React, { useEffect, useState } from 'react';
import {
    obtenerUsuarios as getUsuarios,
    crearUsuario as postUsuario,
    eliminarUsuario as deleteUsuario
} from '../services/usuarioService';

export default function AdminUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [nuevo, setNuevo] = useState({ username: '', password: '', rol: 'USER' });
    const [error, setError] = useState('');

    // Cargar todos los usuarios al montar
    useEffect(() => {
        cargarUsuarios();
    }, []);

    const cargarUsuarios = () => {
        getUsuarios()
            .then(res => setUsuarios(res.data))
            .catch(err => console.error('Error al cargar usuarios:', err));
    };

    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setNuevo(prev => ({ ...prev, [name]: value }));
    };

    const crear = (e) => {
        e.preventDefault();
        if (!nuevo.username || !nuevo.password) {
            setError('Username y contraseña obligatorios');
            return;
        }
        if (nuevo.rol !== 'ADMIN' && nuevo.rol !== 'USER') {
            setError('Rol inválido');
            return;
        }
        postUsuario(nuevo)
            .then(() => {
                setNuevo({ username: '', password: '', rol: 'USER' });
                setError('');
                cargarUsuarios();
            })
            .catch(err => {
                console.error('Error al crear usuario:', err);
                setError('No se pudo crear el usuario');
            });
    };

    const eliminar = (id) => {
        deleteUsuario(id)
            .then(() => cargarUsuarios())
            .catch(err => console.error('Error al eliminar:', err));
    };

    return (
        <div>
            <h2 className="mb-4">Gestión de Usuarios (Solo ADMIN)</h2>
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Formulario para crear usuario */}
            <form className="row g-3 mb-4" onSubmit={crear}>
                <div className="col-md-4">
                    <label className="form-label">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        name="username"
                        value={nuevo.username}
                        onChange={manejarCambio}
                        required
                    />
                </div>
                <div className="col-md-4">
                    <label className="form-label">Contraseña</label>
                    <input
                        type="password"
                        className="form-control"
                        name="password"
                        value={nuevo.password}
                        onChange={manejarCambio}
                        required
                    />
                </div>
                <div className="col-md-3">
                    <label className="form-label">Rol</label>
                    <select
                        className="form-select"
                        name="rol"
                        value={nuevo.rol}
                        onChange={manejarCambio}
                    >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>
                </div>
                <div className="col-md-1 d-flex align-items-end">
                    <button className="btn btn-success w-100" type="submit">
                        Crear
                    </button>
                </div>
            </form>

            {/* Tabla de usuarios existentes */}
            <table className="table table-striped">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map(u => (
                        <tr key={u.id}>
                            <td>{u.id}</td>
                            <td>{u.username}</td>
                            <td>{u.rol}</td>
                            <td>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => eliminar(u.id)}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
