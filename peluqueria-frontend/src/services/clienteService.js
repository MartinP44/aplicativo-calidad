import axios from "axios";

const API_URL = "http://localhost:8080/api/clientes";

export const obtenerClientes = () => axios.get(API_URL);

export const crearCliente = (cliente) => axios.post(API_URL, cliente);

export const eliminarCliente = (cedula) => axios.delete(`http://localhost:8080/api/clientes/${cedula}`);

export const actualizarCliente = (cedula, cliente) => axios.put(`http://localhost:8080/api/clientes/${cedula}`, cliente);