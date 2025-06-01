import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import {
    obtenerStock,
    crearIngresoStock,
    eliminarIngresoStock
} from '../services/stockService';
import { obtenerProductos } from '../services/productoService';

export default function Stock() {
    const [stock, setStock] = useState([]);
    const [productos, setProductos] = useState([]);
    const [registro, setRegistro] = useState({
        producto: { id: "" },
        cantidad: "",
        fechaIngreso: ""
    });

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = () => {
        obtenerStock()
            .then(res => setStock(res.data))
            .catch(err => console.error("Error al cargar stock:", err));
        obtenerProductos()
            .then(res => setProductos(res.data))
            .catch(err => console.error("Error al cargar productos:", err));
    };

    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setRegistro({ ...registro, [name]: value });
    };

    const manejarSeleccionProducto = (opcion) => {
        if (opcion) {
            setRegistro({ ...registro, producto: { id: opcion.value } });
        } else {
            setRegistro({ ...registro, producto: { id: "" } });
        }
    };

    const manejarEnvio = (e) => {
        e.preventDefault();
        crearIngresoStock(registro)
            .then(() => {
                setRegistro({ producto: { id: "" }, cantidad: "", fechaIngreso: "" });
                cargarDatos();
            })
            .catch(err => console.error("Error al guardar ingreso de stock:", err));
    };

    const eliminarRegistro = (id) => {
        if (window.confirm("¿Eliminar este ingreso de stock?")) {
            eliminarIngresoStock(id)
                .then(() => cargarDatos())
                .catch(err => console.error("Error al eliminar:", err));
        }
    };

    return (
        <div className="container mt-4">
            <h2>Registrar Ingreso de Stock</h2>
            <form className="row g-3" onSubmit={manejarEnvio}>
                <div className="col-md-5">
                    <label>Producto</label>
                    <Select
                        options={productos.map(p => ({
                            value: p.id,
                            label: `${p.nombre} - $${p.precio}`
                        }))}
                        onChange={manejarSeleccionProducto}
                        value={
                            registro.producto.id
                                ? {
                                    value: registro.producto.id,
                                    label: `${productos.find(p => p.id === registro.producto.id)?.nombre || ''}`
                                }
                                : null
                        }
                        placeholder="Seleccione un producto"
                        isSearchable
                        isClearable
                        required
                    />
                </div>
                <div className="col-md-3">
                    <label>Cantidad</label>
                    <input type="number" className="form-control" name="cantidad"
                        value={registro.cantidad} onChange={manejarCambio} required />
                </div>
                <div className="col-md-3">
                    <label>Fecha Ingreso</label>
                    <input type="date" className="form-control" name="fechaIngreso"
                        value={registro.fechaIngreso} onChange={manejarCambio} required />
                </div>
                <div className="col-md-1 d-flex align-items-end">
                    <button type="submit" className="btn btn-primary-custom">Guardar</button>
                </div>
            </form>

            <h2 className="mt-5">Historial de Ingresos</h2>
            <table className="table table-bordered table-hover mt-3">
                <thead className="table-dark">
                    <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Fecha de ingreso</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {stock.map(s => (
                        <tr key={s.id}>
                            <td>{s.producto.nombre}</td>
                            <td>{s.cantidad}</td>
                            <td>{s.fechaIngreso}</td>
                            <td>
                                <button className="btn btn-danger btn-sm" onClick={() => eliminarRegistro(s.id)}>
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
