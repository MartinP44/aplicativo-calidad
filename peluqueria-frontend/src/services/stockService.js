import axios from 'axios';

const API_URL = "http://localhost:8080/api/stock";

export const obtenerStock = () => axios.get(API_URL);
export const crearIngresoStock = (registro) => axios.post(API_URL, registro);
export const eliminarIngresoStock = (id) => axios.delete(`${API_URL}/${id}`);
