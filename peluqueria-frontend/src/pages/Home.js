import React, { useEffect, useState } from 'react';
import { obtenerProductos } from '../services/productoService';
import { obtenerStock } from '../services/stockService';
import { obtenerCitas } from '../services/citaService';
import dayjs from 'dayjs';

export default function Home() {
    // ────────────────────────────────────────────────────────────────────────────
    // Estados para cargar datos
    // ────────────────────────────────────────────────────────────────────────────
    const [productos, setProductos] = useState([]);
    const [stockEntradas, setStockEntradas] = useState([]);
    const [citas, setCitas] = useState([]);

    // ────────────────────────────────────────────────────────────────────────────
    // Una vez montado el componente, solicitamos datos al backend
    // ────────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        // 1) Obtener todos los productos
        obtenerProductos()
            .then((res) => {
                // Asegurarse de que sea un arreglo
                const data = Array.isArray(res.data) ? res.data : [];
                setProductos(data);
            })
            .catch((err) => console.error('Error al cargar productos:', err));

        // 2) Obtener todas las entradas de stock
        obtenerStock()
            .then((res) => {
                const data = Array.isArray(res.data) ? res.data : [];
                setStockEntradas(data);
            })
            .catch((err) => console.error('Error al cargar stock:', err));

        // 3) Obtener todas las citas
        obtenerCitas()
            .then((res) => {
                const data = Array.isArray(res.data) ? res.data : [];
                setCitas(data);
            })
            .catch((err) => console.error('Error al cargar citas:', err));
    }, []);

    // ────────────────────────────────────────────────────────────────────────────
    // 1) Calcular productos por caducar en los próximos 7 días (o ya caducados)
    // ────────────────────────────────────────────────────────────────────────────
    const productosPorCaducar = productos.filter((p) => {
        if (!p.fechaCaducidad) return false;
        // dayjs para comparar fechas fácilmente
        const hoy = dayjs().startOf('day');
        const fechaCad = dayjs(p.fechaCaducidad); // p.fechaCaducidad es string "YYYY-MM-DD"
        const diff = fechaCad.diff(hoy, 'day'); // diferencia en días
        return diff <= 7; // incluye caducados (diff < 0) y los que cumplen 0 <= diff <= 7
    });

    // ────────────────────────────────────────────────────────────────────────────
    // 2) Calcular stock actual por producto sumando todas las entradas
    // ────────────────────────────────────────────────────────────────────────────
    // Creamos un map { productoId: totalCantidad }
    const inventarioMap = {};
    stockEntradas.forEach((ingreso) => {
        const pid = ingreso.producto.id;
        const cant = ingreso.cantidad;
        if (!inventarioMap[pid]) inventarioMap[pid] = 0;
        inventarioMap[pid] += cant;
    });
    // Ahora filtramos los productos cuyo stock ≤ stockMin
    const productosBajoStock = productos.filter((p) => {
        const actual = inventarioMap[p.id] || 0;
        return actual <= (p.stockMin ?? 0);
    });

    // ────────────────────────────────────────────────────────────────────────────
    // 3) Citas agendadas para hoy
    // ────────────────────────────────────────────────────────────────────────────
    // Convertimos hoy a formato "YYYY-MM-DD" para comparar strings
    const hoyStr = dayjs().format('YYYY-MM-DD');
    const citasHoy = citas.filter((c) => c.fecha === hoyStr);

    // ────────────────────────────────────────────────────────────────────────────
    // Render
    // ────────────────────────────────────────────────────────────────────────────
    return (
        <div>
            <h2 className="mb-4">Panel de Notificaciones</h2>

            {/* ───────────────────────────────────────────────────────────────────────── */}
            {/* 1) Alertas de productos por caducar */}
            {/* ───────────────────────────────────────────────────────────────────────── */}
            <div className="mb-5">
                <h4>Productos por caducar (próximos 7 días)</h4>
                {productosPorCaducar.length === 0 ? (
                    <div className="alert alert-custom-success" role="alert">
                        No hay productos por caducar en una semana.
                    </div>
                ) : (
                    <ul className="list-group">
                        {productosPorCaducar.map((p) => {
                            // Calcular cuántos días faltan
                            const dias = dayjs(p.fechaCaducidad).diff(dayjs().startOf('day'), 'day');
                            let texto;
                            if (dias < 0) {
                                texto = `Caducó hace ${Math.abs(dias)} día${Math.abs(dias) > 1 ? 's' : ''}`;
                            } else if (dias === 0) {
                                texto = 'Caduca hoy';
                            } else {
                                texto = `Caduca en ${dias} día${dias > 1 ? 's' : ''}`;
                            }
                            return (
                                <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>{p.nombre}</strong> (Lote: {p.numLote})
                                    </div>
                                    <span className="badge bg-warning text-dark">
                                        {texto} ({p.fechaCaducidad})
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>

            {/* ───────────────────────────────────────────────────────────────────────── */}
            {/* 2) Alertas de productos bajo stock */}
            {/* ───────────────────────────────────────────────────────────────────────── */}
            <div className="mb-5">
                <h4>Productos bajo nivel de stock</h4>
                {productosBajoStock.length === 0 ? (
                    <div className="alert alert-custom-success" role="alert">
                        Todos los productos están por encima de su stock mínimo.
                    </div>
                ) : (
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Stock Actual</th>
                                <th>Stock Mínimo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productosBajoStock.map((p) => {
                                const actual = inventarioMap[p.id] || 0;
                                return (
                                    <tr key={p.id} className="table-danger">
                                        <td>{p.nombre}</td>
                                        <td>{actual}</td>
                                        <td>{p.stockMin}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* ───────────────────────────────────────────────────────────────────────── */}
            {/* 3) Alertas de citas del día */}
            {/* ───────────────────────────────────────────────────────────────────────── */}
            <div className="mb-5">
                <h4>Citas agendadas para hoy ({hoyStr})</h4>
                {citasHoy.length === 0 ? (
                    <div className="alert alert-custom-info" role="alert">
                        No hay citas programadas para hoy.
                    </div>
                ) : (
                    <ul className="list-group">
                        {citasHoy.map((c) => (
                            <li key={c.id} className="list-group-item d-flex justify-content-between">
                                <div>
                                    <strong>Cédula:</strong> {c.cliente.cedula} — <strong>Nombre:</strong> {c.cliente.nombre} — <strong>Servicio:</strong> {c.servicio}
                                </div>
                                <span>{c.hora}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
