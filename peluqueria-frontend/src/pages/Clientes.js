import React, { useEffect, useState } from 'react';
import { obtenerClientes, crearCliente, eliminarCliente, actualizarCliente } from '../services/clienteService';

/**
 * Valida que una cédula ecuatoriana sea correcta:
 * - Longitud exacta de 10 dígitos.
 * - Los dos primeros dígitos (provincia) entre 00 y 24.
 * - Tercer dígito menor que 6.
 * - Dígito verificador (último) calculado con el algoritmo de coeficientes [2,1,2,1,2,1,2,1,2].
 *
 * @param {string} cedula Cadena de 10 dígitos (puede venir sin ceros iniciales).
 * @return {boolean} True si la cédula es válida, false en caso contrario.
 */
function validarCedulaEcuador(cedula) {
    if (!/^\d{10}$/.test(cedula)) {
        return false;
    }
    const digitos = cedula.split('').map(d => parseInt(d, 10));
    const provincia = Number(cedula.substring(0, 2));
    if (provincia < 1 || provincia > 24) {
        return false;
    }
    if (digitos[2] < 0 || digitos[2] > 5) {
        return false;
    }
    const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    let suma = 0;
    for (let i = 0; i < 9; i++) {
        let producto = digitos[i] * coeficientes[i];
        if (producto >= 10) {
            producto -= 9;
        }
        suma += producto;
    }
    const decenaSuperior = Math.ceil(suma / 10) * 10;
    let digitoVerificador = decenaSuperior - suma;
    if (digitoVerificador === 10) {
        digitoVerificador = 0;
    }
    return digitoVerificador === digitos[9];
}




export default function Clientes() {
    const [clientes, setClientes] = useState([]);
    const [filtroCedula, setFiltroCedula] = useState("");
    const [nuevoCliente, setNuevoCliente] = useState({
        cedula: "",
        nombre: "",
        apellido: "",
        telefono: "",
        email: "",
        direccion: "",
        estadoCivil: "",
        sexo: "",
        enfermedadesCapi: "",
        alergias: "",
        preferenciasProd: "",
        fechaNac: ""
    });
    const [modoEdicion, setModoEdicion] = useState(false);
    const [errorCedula, setErrorCedula] = useState("");

    useEffect(() => {
        cargarClientes();
    }, []);

    const cargarClientes = () => {
        obtenerClientes()
            .then(response => setClientes(response.data))
            .catch(error => console.error("Error al obtener clientes:", error));
    };

    const manejarCambio = (e) => {
        setNuevoCliente({
            ...nuevoCliente,
            [e.target.name]: e.target.value
        });
    };

    const manejarEnvio = (e) => {
        e.preventDefault();

        // Validamos la cédula antes de crear/actualizar:
        if (!validarCedulaEcuador(nuevoCliente.cedula)) {
            setErrorCedula("Cédula inválida. Debe ser una cédula ecuatoriana correcta.");
            return;
        } else {
            setErrorCedula("");
        }

        if (modoEdicion) {
            actualizarCliente(nuevoCliente.cedula, nuevoCliente)
                .then(() => {
                    setNuevoCliente({
                        cedula: "", nombre: "", apellido: "", telefono: "", email: "",
                        direccion: "", estadoCivil: "", sexo: "", enfermedadesCapi: "",
                        alergias: "", preferenciasProd: "", fechaNac: ""
                    });
                    setModoEdicion(false);
                    cargarClientes();
                })
                .catch(error => console.error("Error al actualizar cliente:", error));
        } else {
            crearCliente(nuevoCliente)
                .then(() => {
                    setNuevoCliente({
                        cedula: "", nombre: "", apellido: "", telefono: "", email: "",
                        direccion: "", estadoCivil: "", sexo: "", enfermedadesCapi: "",
                        alergias: "", preferenciasProd: "", fechaNac: ""
                    });
                    cargarClientes();
                })
                .catch(error => console.error("Error al crear cliente:", error));
        }
    };

    const handleEliminar = (cedula) => {
        if (window.confirm("¿Estás seguro de eliminar este cliente?")) {
            eliminarCliente(cedula)
                .then(() => cargarClientes())
                .catch((error) => console.error("Error al eliminar cliente:", error));
        }
    };

    const editarCliente = (cliente) => {
        setNuevoCliente(cliente);
        setModoEdicion(true);
    };

    return (
        <div className="container mt-4">
            <h2>Registro de Cliente</h2>
            <form className="row g-3" onSubmit={manejarEnvio}>
                
                    <div className="col-md-4">
                        <label className="form-label">Cédula</label>
                        <input
                            type="text"
                            className="form-control"
                            name="cedula"
                            value={nuevoCliente.cedula}
                            onChange={(e) => {
                                setNuevoCliente({ ...nuevoCliente, cedula: e.target.value });
                                setErrorCedula(""); // Limpiar mensaje en cuanto empiece a escribir
                            }}
                            required
                            disabled={modoEdicion}
                        />
                        {errorCedula && (
                            <div className="text-danger mt-1">{errorCedula}</div>
                        )}
                    </div>
                
                <div className="col-md-4">
                    <label className="form-label">Nombre</label>
                    <input type="text" className="form-control" name="nombre"
                        value={nuevoCliente.nombre} onChange={manejarCambio} required />
                </div>
                <div className="col-md-4">
                    <label className="form-label">Apellido</label>
                    <input type="text" className="form-control" name="apellido"
                        value={nuevoCliente.apellido} onChange={manejarCambio} required />
                </div>
                <div className="col-md-4">
                    <label className="form-label">Teléfono</label>
                    <input type="text" className="form-control" name="telefono"
                        value={nuevoCliente.telefono} onChange={manejarCambio} required />
                </div>
                <div className="col-md-4">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" name="email"
                        value={nuevoCliente.email} onChange={manejarCambio} required />
                </div>
                <div className="col-md-4">
                    <label className="form-label">Dirección</label>
                    <input type="text" className="form-control" name="direccion"
                        value={nuevoCliente.direccion} onChange={manejarCambio} required />
                </div>
                <div className="col-md-4">
                    <label className="form-label">Estado Civil</label>
                    <select className="form-select" name="estadoCivil"
                        value={nuevoCliente.estadoCivil} onChange={manejarCambio} required>
                        <option value="">Seleccione...</option>
                        <option value="Soltero">Soltero</option>
                        <option value="Casado">Casado</option>
                        <option value="Divorciado">Divorciado</option>
                        <option value="Viudo">Viudo</option>
                        <option value="Unión Libre">Unión Libre</option>
                    </select>
                </div>
                <div className="col-md-4">
                    <label className="form-label">Sexo</label>
                    <select className="form-select" name="sexo"
                        value={nuevoCliente.sexo} onChange={manejarCambio} required>
                        <option value="">Seleccione...</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                    </select>
                </div>
                <div className="col-md-4">
                    <label className="form-label">Fecha de Nacimiento</label>
                    <input type="date" className="form-control" name="fechaNac"
                        value={nuevoCliente.fechaNac} onChange={manejarCambio} required />
                </div>
                <div className="col-md-6">
                    <label className="form-label">Enfermedades Capilares</label>
                    <input type="text" className="form-control" name="enfermedadesCapi"
                        value={nuevoCliente.enfermedadesCapi} onChange={manejarCambio} />
                </div>
                <div className="col-md-6">
                    <label className="form-label">Alergias</label>
                    <input type="text" className="form-control" name="alergias"
                        value={nuevoCliente.alergias} onChange={manejarCambio} />
                </div>
                <div className="col-md-12">
                    <label className="form-label">Preferencias de Productos</label>
                    <input type="text" className="form-control" name="preferenciasProd"
                        value={nuevoCliente.preferenciasProd} onChange={manejarCambio} />
                </div>
                <div className="col-md-12">
                    <button type="submit" className="btn btn-primary-custom mt-3">
                        {modoEdicion ? "Actualizar Cliente" : "Guardar Cliente"}
                    </button>
                </div>
            </form>

            <div className="row mt-5">
                <div className="col-md-6">
                    <h2>Listado de Clientes</h2>
                </div>
                <div className="col-md-6 text-end">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar por cédula..."
                        value={filtroCedula}
                        onChange={(e) => setFiltroCedula(e.target.value)}
                    />
                </div>
            </div>
            <table className="table table-bordered table-hover mt-3">
                <thead className="table-dark">
                    <tr>
                        <th>Cédula</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Teléfono</th>
                        <th>Email</th>
                        <th>Fecha Nac.</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {clientes
                        .filter(c => c.cedula.includes(filtroCedula))
                        .map(cliente => (
                        <tr key={cliente.cedula}>
                            <td>{cliente.cedula}</td>
                            <td>{cliente.nombre}</td>
                            <td>{cliente.apellido}</td>
                            <td>{cliente.telefono}</td>
                            <td>{cliente.email}</td>
                            <td>{cliente.fechaNac}</td>
                            <td>
                                <button
                                    className="btn btn-warning btn-sm me-2"
                                    onClick={() => editarCliente(cliente)}
                                >
                                    Editar
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleEliminar(cliente.cedula)}
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

