// src/pages/Factura.js

import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import {
    obtenerFacturas,
    crearFactura,
} from '../services/facturaService';
import { obtenerClientes } from '../services/clienteService';
import { obtenerProductos } from '../services/productoService';

export default function Factura() {
    // ─────────────────────────────────────────────────────────────────────────────
    // Estados principales
    // ─────────────────────────────────────────────────────────────────────────────

    // Lista de cédulas de clientes para el dropdown
    const [clientes, setClientes] = useState([]);

    // Lista de productos (cada uno con { id, nombre, precio, ... })
    const [productos, setProductos] = useState([]);

    // Listado de facturas mostradas en la tabla
    const [facturas, setFacturas] = useState([]);

    // Tipo y valor para la búsqueda de facturas
    const [tipoBusqueda, setTipoBusqueda] = useState('numero'); // 'numero' | 'cedula' | 'fecha'
    const [busqueda, setBusqueda] = useState('');

    // ─────────────────────────────────────────────────────────────────────────────
    // Estado para crear una nueva factura
    // ─────────────────────────────────────────────────────────────────────────────

    const [nuevoFactura, setNuevoFactura] = useState({
        cliente: { cedula: '' },
        fecha: '',
        detalles: [] // Cada detalle: { tipo, descripcion, cantidad, precio }
    });

    // ─────────────────────────────────────────────────────────────────────────────
    // Carga inicial de datos: clientes, productos, facturas
    // ─────────────────────────────────────────────────────────────────────────────

    useEffect(() => {
        // 1. Obtener todas las cédulas de clientes
        obtenerClientes()
            .then(res => {
                const datos = Array.isArray(res.data) ? res.data : [];
                setClientes(datos.map(c => c.cedula));
            })
            .catch(err => console.error("Error al cargar clientes:", err));

        // 2. Obtener todos los productos disponibles
        obtenerProductos()
            .then(res => {
                const datos = Array.isArray(res.data) ? res.data : [];
                setProductos(datos);
            })
            .catch(err => console.error("Error al cargar productos:", err));

        // 3. Obtener todas las facturas para mostrarlas inicialmente
        cargarTodasFacturas();
    }, []);

    // ─────────────────────────────────────────────────────────────────────────────
    // Función para recargar TODAS las facturas (sin filtrar)
    // ─────────────────────────────────────────────────────────────────────────────

    const cargarTodasFacturas = () => {
        obtenerFacturas()
            .then(res => {
                const datos = Array.isArray(res.data) ? res.data : [];
                setFacturas(datos);
            })
            .catch(err => {
                console.error("Error al cargar facturas:", err);
                setFacturas([]); // Si falla, quedamos con array vacío
            });
    };

    // ─────────────────────────────────────────────────────────────────────────────
    // Funciones para manejar el formulario de nueva factura
    // ─────────────────────────────────────────────────────────────────────────────

    /**
     * Agrega un nuevo detalle vacío al array de detalles de la factura
     */
    const agregarDetalle = () => {
        setNuevoFactura(prev => ({
            ...prev,
            detalles: [
                ...prev.detalles,
                { tipo: '', descripcion: '', cantidad: 1, precio: 0 }
            ]
        }));
    };

    /**
     * Mapea servicios a un precio fijo:
     * - Corte: 5
     * - Tinturado: 30
     * - Peinado: 15
     */
    const precioServicio = {
        Corte: 5,
        Tinturado: 30,
        Peinado: 15
    };

    /**
     * Maneja los cambios en cada campo de un detalle:
     *   index: posición en el array detalles
     *   campo: 'tipo' | 'descripcion' | 'cantidad' | 'precio'
     *   valor: nuevo valor ingresado/seleccionado
     *
     * Si el campo es 'tipo', se reinicia descripción y precio.
     * Si el campo es 'descripcion', se autocompleta precio según:
     *   - Si es PRODUCTO: busca en productos por nombre y toma su precio.
     *   - Si es SERVICIO: usa precioServicio[cantidad].
     */
    const manejarCambioDetalle = (index, campo, valor) => {
        setNuevoFactura(prev => {
            const nuevosDetalles = [...prev.detalles];
            const detalle = { ...nuevosDetalles[index] };

            if (campo === 'tipo') {
                // Si cambia el tipo, reiniciar descripción y precio
                detalle.tipo = valor;
                detalle.descripcion = '';
                detalle.precio = 0;
            } else if (campo === 'descripcion') {
                // Cuando cambie la descripción, autocompletar precio
                detalle.descripcion = valor;

                if (detalle.tipo === 'PRODUCTO') {
                    // Buscar el producto por nombre
                    const prod = productos.find(p => p.nombre === valor);
                    detalle.precio = prod ? prod.precio : 0;
                } else if (detalle.tipo === 'SERVICIO') {
                    // Tomar precio fijo desde el mapa
                    detalle.precio = precioServicio[valor] || 0;
                }
            } else if (campo === 'cantidad') {
                // Convertir a número y asignar
                detalle.cantidad = Number(valor);
            } else if (campo === 'precio') {
                // Convertir a número y asignar (si el usuario decide cambiar manualmente)
                detalle.precio = Number(valor);
            }

            nuevosDetalles[index] = detalle;
            return { ...prev, detalles: nuevosDetalles };
        });
    };

    /**
     * Maneja el cambio de cédula del cliente en el dropdown
     */
    const manejarCambioCliente = (e) => {
        setNuevoFactura(prev => ({
            ...prev,
            cliente: { cedula: e.target.value }
        }));
    };

    /**
     * Guarda la factura validando:
     *  - Que exista cédula de cliente
     *  - Que haya al menos un detalle
     *  - Que cada detalle tenga tipo, descripción, cantidad > 0, precio > 0
     *  - Si no hay fecha, asigna la fecha actual
     *  - Envía POST /api/facturas con el objeto factura
     */
    const guardarFactura = () => {
        // Validar cédula
        if (!nuevoFactura.cliente.cedula) {
            alert("Selecciona la cédula del cliente antes de guardar.");
            return;
        }
        // Validar que haya al menos un detalle
        if (nuevoFactura.detalles.length === 0) {
            alert("Debes agregar al menos un ítem (producto o servicio).");
            return;
        }
        // Validar cada detalle
        for (const d of nuevoFactura.detalles) {
            if (!d.tipo) {
                alert("Todos los ítems deben tener un tipo (PRODUCTO o SERVICIO).");
                return;
            }
            if (!d.descripcion) {
                alert("Todos los ítems deben tener descripción.");
                return;
            }
            if (d.cantidad <= 0 || d.precio <= 0) {
                alert("Cantidad y precio de cada ítem deben ser mayores a cero.");
                return;
            }
        }

        // Si no hay fecha, asignar la fecha actual
        const hoy = new Date().toISOString().split('T')[0];
        const facturaAEnviar = {
            ...nuevoFactura,
            fecha: nuevoFactura.fecha || hoy
        };

        // Llamada al backend
        crearFactura(facturaAEnviar)
            .then(res => {
                const guardada = res.data || {};
                if (!guardada.cliente) {
                    alert("La factura se guardó pero no regresó información del cliente.");
                } else {
                    alert("Factura guardada exitosamente.");
                }
                // Agregar la factura guardada a la lista
                setFacturas(prev =>
                    Array.isArray(prev) ? [...prev, guardada] : [guardada]
                );
                // Resetear formulario
                setNuevoFactura({
                    cliente: { cedula: '' },
                    fecha: '',
                    detalles: []
                });
            })
            .catch(err => {
                console.error("Error al guardar factura:", err);
                const mensaje = err.response?.data?.message || "Error desconocido";
                alert("No se pudo guardar la factura: " + mensaje);
            });
    };

    // ─────────────────────────────────────────────────────────────────────────────
    // Función para buscar facturas según tipo y valor de búsqueda
    // ─────────────────────────────────────────────────────────────────────────────

    const buscarFacturas = () => {
        obtenerFacturas()
            .then(res => {
                const todas = Array.isArray(res.data) ? res.data : [];
                let filtradas = [];

                if (tipoBusqueda === 'numero') {
                    filtradas = todas.filter(f => f.id.toString() === busqueda);
                } else if (tipoBusqueda === 'cedula') {
                    filtradas = todas.filter(f => f.cliente?.cedula.includes(busqueda));
                } else if (tipoBusqueda === 'fecha') {
                    filtradas = todas.filter(f => f.fecha === busqueda);
                }

                setFacturas(filtradas);
            })
            .catch(err => {
                console.error("Error al buscar facturas:", err);
                setFacturas([]);
            });
    };

    // ─────────────────────────────────────────────────────────────────────────────
    // Exportar una factura a PDF usando jsPDF + jspdf-autotable
    // ─────────────────────────────────────────────────────────────────────────────

    const exportarPDF = (factura) => {
        const doc = new jsPDF();

        // Título y datos generales
        doc.text(`Factura N.º ${factura.id}`, 10, 10);
        doc.text(
            `Cliente (cédula): ${factura.cliente?.cedula || '---'}`,
            10,
            20
        );
        doc.text(`Fecha: ${factura.fecha}`, 10, 30);

        // Preparar filas para la tabla de detalles
        const filas = factura.detalles.map(d => [
            d.tipo,
            d.descripcion,
            d.cantidad,
            `$ ${d.precio.toFixed(2)}`,
            `$ ${(d.precio * d.cantidad).toFixed(2)}`
        ]);

        // Generar la tabla usando autoTable(doc, ...)
        autoTable(doc, {
            head: [['Tipo', 'Descripción', 'Cantidad', 'Precio Unit.', 'Subtotal']],
            body: filas,
            startY: 40
        });

        // Total al final de la tabla
        doc.text(
            `Total: $ ${factura.total.toFixed(2)}`,
            10,
            doc.lastAutoTable.finalY + 10
        );

        // Descargar el PDF
        doc.save(`Factura_${factura.id}.pdf`);
    };

    // ─────────────────────────────────────────────────────────────────────────────
    // Render del componente
    // ─────────────────────────────────────────────────────────────────────────────

    return (
        <div className="container mt-4">
            {/* ─────────────────────────────────────────────────────────────────────────── */}
            {/* Formulario para Generar Nueva Factura */}
            {/* ─────────────────────────────────────────────────────────────────────────── */}
            <h2>Generar Nueva Factura</h2>
            <div className="row mb-3">
                {/* 1) Selección de cédula de cliente */}
                <div className="col-md-4">
                    <label>Cédula del Cliente</label>
                    <select
                        className="form-select"
                        value={nuevoFactura.cliente.cedula}
                        onChange={manejarCambioCliente}
                    >
                        <option value="">-- Selecciona cédula --</option>
                        {clientes.map(ced => (
                            <option key={ced} value={ced}>
                                {ced}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 2) Fecha opcional de la factura */}
                <div className="col-md-3">
                    <label>Fecha (opcional)</label>
                    <input
                        type="date"
                        className="form-control"
                        value={nuevoFactura.fecha}
                        onChange={e =>
                            setNuevoFactura(prev => ({
                                ...prev,
                                fecha: e.target.value
                            }))
                        }
                    />
                </div>

                {/* 3) Botón para guardar la factura */}
                <div className="col-md-2 d-flex align-items-end">
                    <button className="btn btn-primary-custom w-100" onClick={guardarFactura}>
                        Guardar Factura
                    </button>
                </div>
            </div>

            {/* ─────────────────────────────────────────────────────────────────────────── */}
            {/* Sección de Detalles de la Factura */}
            {/* ─────────────────────────────────────────────────────────────────────────── */}
            <h5>Detalles de la Factura</h5>
            {nuevoFactura.detalles.map((d, idx) => (
                <div key={idx} className="row g-2 align-items-end mb-2">
                    {/* Tipo de ítem: PRODUCTO o SERVICIO */}
                    <div className="col-md-2">
                        <label>Tipo</label>
                        <select
                            className="form-select"
                            value={d.tipo}
                            onChange={e =>
                                manejarCambioDetalle(idx, 'tipo', e.target.value)
                            }
                        >
                            <option value="">Tipo</option>
                            <option value="PRODUCTO">Producto</option>
                            <option value="SERVICIO">Servicio</option>
                        </select>
                    </div>

                    {/* Descripción:
               - Si es PRODUCTO: dropdown con productos de la BD
               - Si es SERVICIO: dropdown de opciones estáticas */}
                    <div className="col-md-4">
                        <label>Descripción</label>
                        {d.tipo === 'PRODUCTO' ? (
                            <select
                                className="form-select"
                                value={d.descripcion}
                                onChange={e =>
                                    manejarCambioDetalle(idx, 'descripcion', e.target.value)
                                }
                            >
                                <option value="">-- Selecciona un producto --</option>
                                {productos.map(p => (
                                    <option key={p.id} value={p.nombre}>
                                        {p.nombre}
                                    </option>
                                ))}
                            </select>
                        ) : d.tipo === 'SERVICIO' ? (
                            <select
                                className="form-select"
                                value={d.descripcion}
                                onChange={e =>
                                    manejarCambioDetalle(idx, 'descripcion', e.target.value)
                                }
                            >
                                <option value="">-- Selecciona un servicio --</option>
                                <option value="Corte">Corte</option>
                                <option value="Tinturado">Tinturado</option>
                                <option value="Peinado">Peinado</option>
                            </select>
                        ) : (
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Selecciona tipo primero"
                                disabled
                            />
                        )}
                    </div>

                    {/* Cantidad */}
                    <div className="col-md-1">
                        <label>Cant.</label>
                        <input
                            type="number"
                            className="form-control"
                            min="1"
                            value={d.cantidad}
                            onChange={e =>
                                manejarCambioDetalle(idx, 'cantidad', e.target.value)
                            }
                        />
                    </div>

                    {/* Precio (autocompletado cuando se elige producto o servicio) */}
                    <div className="col-md-2">
                        <label>Precio</label>
                        <input
                            type="number"
                            step="0.01"
                            className="form-control"
                            value={d.precio}
                            onChange={e =>
                                manejarCambioDetalle(idx, 'precio', e.target.value)
                            }
                        />
                    </div>

                    {/* Botón eliminar detalle */}
                    <div className="col-md-1 d-flex align-items-center">
                        <button
                            className="btn btn-danger btn-sm"
                            onClick={() => {
                                setNuevoFactura(prev => {
                                    const arr = [...prev.detalles];
                                    arr.splice(idx, 1);
                                    return { ...prev, detalles: arr };
                                });
                            }}
                        >
                            ×
                        </button>
                    </div>
                </div>
            ))}

            {/* Botón para agregar un nuevo detalle */}
            <div className="mb-4">
                <button className="btn btn-secondary-custom" onClick={agregarDetalle}>
                    Agregar ítem
                </button>
            </div>

            <hr />

            {/* ─────────────────────────────────────────────────────────────────────────── */}
            {/* Sección de búsqueda de facturas */}
            {/* ─────────────────────────────────────────────────────────────────────────── */}
            <h3>Búsqueda de Facturas</h3>
            <div className="row g-2 mb-3">
                <div className="col-md-3">
                    <label>Tipo de búsqueda</label>
                    <select
                        className="form-select"
                        value={tipoBusqueda}
                        onChange={e => setTipoBusqueda(e.target.value)}
                    >
                        <option value="numero">Por número</option>
                        <option value="cedula">Por cédula</option>
                        <option value="fecha">Por fecha</option>
                    </select>
                </div>
                <div className="col-md-3">
                    <label>Valor de búsqueda</label>
                    {tipoBusqueda === 'fecha' ? (
                        <input
                            type="date"
                            className="form-control"
                            value={busqueda}
                            onChange={e => setBusqueda(e.target.value)}
                        />
                    ) : (
                        <input
                            type="text"
                            className="form-control"
                            placeholder={
                                tipoBusqueda === 'numero'
                                    ? 'Número de factura'
                                    : 'Cédula'
                            }
                            value={busqueda}
                            onChange={e => setBusqueda(e.target.value)}
                        />
                    )}
                </div>
                <div className="col-md-2 d-flex align-items-end">
                    <button
                        className="btn btn-primary-custom w-100"
                        onClick={buscarFacturas}
                    >
                        Buscar
                    </button>
                </div>
                <div className="col-md-2 d-flex align-items-end">
                    <button
                        className="btn btn-secondary-custom w-100"
                        onClick={cargarTodasFacturas}
                    >
                        Mostrar Todo
                    </button>
                </div>
            </div>

            {/* ─────────────────────────────────────────────────────────────────────────── */}
            {/* Tabla de Facturas Encontradas */}
            {/* ─────────────────────────────────────────────────────────────────────────── */}
            <h3>Facturas Encontradas</h3>
            <table className="table table-bordered table-hover">
                <thead className="table-dark">
                    <tr>
                        <th>#</th>
                        <th>Cédula</th>
                        <th>Fecha</th>
                        <th>Total</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {(Array.isArray(facturas) ? facturas : [])
                        // Filtramos solo facturas con cliente válido
                        .filter(f => f.cliente && f.cliente.cedula)
                        .map(f => (
                            <tr key={f.id}>
                                <td>{f.id}</td>
                                <td>{f.cliente.cedula}</td>
                                <td>{f.fecha}</td>
                                <td>${f.total?.toFixed(2)}</td>
                                <td>
                                    <button
                                        className="btn btn-success btn-sm"
                                        onClick={() => exportarPDF(f)}
                                    >
                                        Exportar PDF
                                    </button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}
