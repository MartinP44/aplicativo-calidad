import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { obtenerClientes } from '../services/clienteService';
import {
    obtenerCitas,
    crearCita,
    actualizarCita,
    eliminarCita
} from '../services/citaService';

export default function Citas() {
    const [citas, setCitas] = useState([]);
    const [filtroFecha, setFiltroFecha] = useState("");
    const [clientes, setClientes] = useState([]);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [citaActual, setCitaActual] = useState({
        id: "",
        cliente: { cedula: "" },
        fecha: "",
        hora: "",
        servicio: "",
        observaciones: ""
    });

    useEffect(() => {
        cargarCitas();
        obtenerClientes()
            .then(res => setClientes(res.data))
            .catch(err => console.error("Error al cargar clientes:", err));
    }, []);

    const cargarCitas = () => {
        obtenerCitas()
            .then(res => setCitas(res.data))
            .catch(err => console.error("Error al cargar citas:", err));
    };

    const manejarCambio = (e) => {
        const { name, value } = e.target;
        if (name === "cedula") {
            setCitaActual({ ...citaActual, cliente: { cedula: value } });
        } else {
            setCitaActual({ ...citaActual, [name]: value });
        }
    };

    const manejarEnvio = (e) => {
        e.preventDefault();
        const accion = modoEdicion
            ? actualizarCita(citaActual.id, citaActual)
            : crearCita(citaActual);

        accion
            .then(() => {
                resetearFormulario();
                cargarCitas();
            })
            .catch(err => console.error("Error al guardar cita:", err));
    };

    const resetearFormulario = () => {
        setCitaActual({
            id: "",
            cliente: { cedula: "" },
            fecha: "",
            hora: "",
            servicio: "",
            observaciones: ""
        });
        setModoEdicion(false);
    };

    const editarCita = (cita) => {
        setCitaActual(cita);
        setModoEdicion(true);
    };

    const eliminarCitaId = (id) => {
        if (window.confirm("¿Eliminar esta cita?")) {
            eliminarCita(id)
                .then(() => cargarCitas())
                .catch(err => console.error("Error al eliminar cita:", err));
        }
    };

    return (
        <div className="container mt-4">
            <h2>{modoEdicion ? "Editar Cita" : "Registrar Cita"}</h2>
            <form className="row g-3" onSubmit={manejarEnvio}>
                <div className="col-md-3">
                    <label>Cédula del Cliente</label>
                    <Select
                        options={clientes.map(c => ({
                            value: c.cedula,
                            label: `${c.cedula} - ${c.nombre} ${c.apellido}`
                        }))}
                        onChange={(opcion) => {
                            if (opcion) {
                                setCitaActual({ ...citaActual, cliente: { cedula: opcion.value } });
                            } else {
                                setCitaActual({ ...citaActual, cliente: { cedula: "" } });
                            }
                        }}
                        value={
                            citaActual.cliente.cedula
                                ? {
                                    value: citaActual.cliente.cedula,
                                    label: `${citaActual.cliente.cedula} - ${clientes.find(c => c.cedula === citaActual.cliente.cedula)?.nombre || ''
                                        }`
                                }
                                : null
                        }
                        placeholder="Seleccione una cédula"
                        isClearable
                        isSearchable
                        required
                    />
                </div>

                <div className="col-md-3">
                    <label>Fecha</label>
                    <input type="date" className="form-control" name="fecha"
                        value={citaActual.fecha} onChange={manejarCambio} required />
                </div>
                <div className="col-md-3">
                    <label>Hora</label>
                    <input type="time" className="form-control" name="hora"
                        value={citaActual.hora} onChange={manejarCambio} required />
                </div>
                <div className="col-md-3">
                    <label>Servicio</label>
                    <select className="form-select" name="servicio" value={citaActual.servicio} onChange={manejarCambio} required>
                        <option value="">Seleccione...</option>
                        <option value="Corte">Corte</option>
                        <option value="Tinturado">Tinturado</option>
                        <option value="Peinado">Peinado</option>
                    </select>
                </div>
                <div className="col-md-12">
                    <label>Observaciones</label>
                    <textarea className="form-control" name="observaciones"
                        value={citaActual.observaciones} onChange={manejarCambio} />
                </div>
                <div className="col-md-12">
                    <button type="submit" className="btn btn-primary-custom">
                        {modoEdicion ? "Actualizar" : "Guardar"}
                    </button>
                </div>
            </form>

            <div className="row mt-5">
                <div className="col-md-6">
                    <h2>Listado de Citas</h2>
                </div>
                <div className="col-md-6 text-end">
                    <input
                        type="date"
                        className="form-control"
                        placeholder="Filtrar por fecha"
                        value={filtroFecha}
                        onChange={(e) => setFiltroFecha(e.target.value)}
                    />
                </div>
            </div>

            <table className="table table-bordered table-hover mt-3">
                <thead className="table-dark">
                    <tr>
                        <th>Cliente (Cédula)</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Servicio</th>
                        <th>Observaciones</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {citas
                        .filter(c => !filtroFecha || c.fecha === filtroFecha)
                        .map(c => (
                            <tr key={c.id}>
                                <td>{c.cliente.cedula} - {c.cliente.nombre}</td>
                                <td>{c.fecha}</td>
                                <td>{c.hora}</td>
                                <td>{c.servicio}</td>
                                <td>{c.observaciones}</td>
                                <td>
                                    <button className="btn btn-warning btn-sm me-2" onClick={() => editarCita(c)}>Editar</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => eliminarCitaId(c.id)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}
