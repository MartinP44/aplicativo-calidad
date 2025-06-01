// src/services/usuarioService.js

import axios from 'axios';

const API_URL = "/usuarios"; // Ya tenemos baseURL=/api en setupAxios

export const obtenerUsuarios = () => {
    return axios.get(API_URL);
};

export const crearUsuario = (usuario) => {
    return axios.post(API_URL, usuario);
};

export const eliminarUsuario = (id) => {
    return axios.delete(`${API_URL}/${id}`);
};
