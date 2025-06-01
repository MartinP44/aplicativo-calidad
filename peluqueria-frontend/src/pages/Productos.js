import React, { useEffect, useState } from 'react';
import {
    obtenerProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto
} from '../services/productoService';

export default function Productos() {
    const [productos, setProductos] = useState([]);
    const [filtroNombre, setFiltroNombre] = useState("");
    const [modoEdicion, setModoEdicion] = useState(false);
    const [productoActual, setProductoActual] = useState({
        id: "",
        nombre: "",
        precio: "",
        numLote: "",
        fechaCaducidad: "",
        tipo: "",
        stockMin: ""
    });

    useEffect(() => {
        cargarProductos();
    }, []);

    const cargarProductos = () => {
        obtenerProductos()
            .then(res => setProductos(res.data))
            .catch(err => console.error("Error al cargar productos:", err));
    };

    const manejarCambio = (e) => {
        setProductoActual({
            ...productoActual,
            [e.target.name]: e.target.value
        });
    };

    const manejarEnvio = (e) => {
        e.preventDefault();
        const accion = modoEdicion
            ? actualizarProducto(productoActual.id, productoActual)
            : crearProducto(productoActual);
        accion
            .then(() => {
                resetearFormulario();
                cargarProductos();
            })
            .catch(err => console.error("Error al guardar producto:", err));
    };

    const resetearFormulario = () => {
        setProductoActual({
            id: "",
            nombre: "",
            precio: "",
            numLote: "",
            fechaCaducidad: "",
            tipo: "",
            stockMin: ""
        });
        setModoEdicion(false);
    };

    const editarProducto = (producto) => {
        setProductoActual(producto);
        setModoEdicion(true);
    };

    const eliminarProductoId = (id) => {
        if (window.confirm("¿Seguro que deseas eliminar este producto?")) {
            eliminarProducto(id)
                .then(() => cargarProductos())
                .catch(err => console.error("Error al eliminar producto:", err));
        }
    };

    return (
        <div className="container mt-4">
            <h2>{modoEdicion ? "Editar Producto" : "Registrar Producto"}</h2>
            <form className="row g-3" onSubmit={manejarEnvio}>
                <div className="col-md-4">
                    <label>Nombre</label>
                    <input className="form-control" name="nombre" value={productoActual.nombre} onChange={manejarCambio} required />
                </div>
                <div className="col-md-2">
                    <label>Precio</label>
                    <input type="number" step="0.01" className="form-control" name="precio" value={productoActual.precio} onChange={manejarCambio} required />
                </div>
                <div className="col-md-2">
                    <label>Número de Lote</label>
                    <input className="form-control" name="numLote" value={productoActual.numLote} onChange={manejarCambio} />
                </div>
                <div className="col-md-2">
                    <label>Fecha Caducidad</label>
                    <input type="date" className="form-control" name="fechaCaducidad" value={productoActual.fechaCaducidad} onChange={manejarCambio} />
                </div>
                <div className="col-md-4">
                    <label className="form-label">Tipo de Producto</label>
                    <select className="form-select" name="tipo" value={productoActual.tipo} onChange={manejarCambio} required>
                        <option value="">Seleccione...</option>
                        <option value="Cuidado del cabello">Cuidado del cabello</option>
                        <option value="Styling">Styling</option>
                        <option value="Coloración">Coloración</option>
                        <option value="Accesorios para el cabello">Accesorios para el cabello</option>
                        <option value="Tratamientos capilares especializados">Tratamientos capilares especializados</option>
                        <option value="Productos para barbería">Productos para barbería</option>
                        <option value="Productos de higiene y desinfección">Productos de higiene y desinfección</option>
                    </select>
                </div>
                <div className="col-md-2">
                    <label>Stock Mínimo</label>
                    <input type="number" className="form-control" name="stockMin" value={productoActual.stockMin} onChange={manejarCambio} />
                </div>
                <div className="col-md-12">
                    <button type="submit" className="btn btn-primary-custom mt-3">
                        {modoEdicion ? "Actualizar" : "Guardar"}
                    </button>
                </div>
            </form>

            <div className="row mt-5">
                <div className="col-md-6">
                    <h2>Listado de Productos</h2>
                </div>
                <div className="col-md-6 text-end">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar por nombre..."
                        value={filtroNombre}
                        onChange={(e) => setFiltroNombre(e.target.value)}
                    />
                </div>
            </div>
            <table className="table table-bordered table-hover mt-3">
                <thead className="table-dark">
                    <tr>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Lote</th>
                        <th>Caducidad</th>
                        <th>Tipo</th>
                        <th>Stock Mín</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {productos
                    .filter(p => p.nombre.toLowerCase().includes(filtroNombre.toLowerCase()))
                    .map(p => (
                        <tr key={p.id}>
                            <td>{p.nombre}</td>
                            <td>{p.precio}</td>
                            <td>{p.numLote}</td>
                            <td>{p.fechaCaducidad}</td>
                            <td>{p.tipo}</td>
                            <td>{p.stockMin}</td>
                            <td>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => editarProducto(p)}>Editar</button>
                                <button className="btn btn-danger btn-sm" onClick={() => eliminarProductoId(p.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
