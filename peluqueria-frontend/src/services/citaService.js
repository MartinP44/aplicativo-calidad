import axios from 'axios';

const API_URL = "http://localhost:8080/api/citas";

export const obtenerCitas = () => axios.get(API_URL);
export const crearCita = (cita) => axios.post(API_URL, cita);
export const actualizarCita = (id, cita) => axios.put(`${API_URL}/${id}`, cita);
export const eliminarCita = (id) => axios.delete(`${API_URL}/${id}`);
