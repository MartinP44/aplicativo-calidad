import axios from 'axios';
import { obtenerCredenciales } from './services/authService';

// URL base
axios.defaults.baseURL = "http://localhost:8080/api";

// Interceptor que agrega Authorization a cada petición si el usuario está logueado
axios.interceptors.request.use((config) => {
    const cred = obtenerCredenciales();
    if (cred && cred.auth) {
        config.headers.Authorization = `Basic ${cred.auth}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
