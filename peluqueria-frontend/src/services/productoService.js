import axios from 'axios';

const API_URL = "http://localhost:8080/api/productos";

export const obtenerProductos = () => axios.get(API_URL);
export const crearProducto = (producto) => axios.post(API_URL, producto);
export const actualizarProducto = (id, producto) => axios.put(`${API_URL}/${id}`, producto);
export const eliminarProducto = (id) => axios.delete(`${API_URL}/${id}`);