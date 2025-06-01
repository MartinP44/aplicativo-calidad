import axios from 'axios';

// La URL base de tu API
const API_URL = "http://localhost:8080/api";

// Devuelve el header “Basic” codificado con username:password
function generarHeaderAuth(username, password) {
    const token = window.btoa(`${username}:${password}`);
    return `Basic ${token}`;
}

// Función de login: no hay endpoint “/api/login” porque usamos HTTP Basic.
// Simplemente devolvemos el header si queremos probar credenciales (options).
export const login = (username, password) => {
    // Podemos hacer una llamada GET a un endpoint protegido para verificar credenciales.
    // Por ejemplo, GET /api/usuarios con Authorization Basic; si responde 200, son válidas.
    const headers = {
        Authorization: generarHeaderAuth(username, password),
    };
    return axios.get(`${API_URL}/usuarios`, { headers });
};

// Guardar credenciales en localStorage
export const almacenarCredenciales = (username, password, rol) => {
    const auth = window.btoa(`${username}:${password}`);
    // Almacenamos un objeto JSON con usuario, token y rol
    const data = { username, auth, rol };
    localStorage.setItem("user", JSON.stringify(data));
};

// Obtener credenciales guardadas
export const obtenerCredenciales = () => {
    return JSON.parse(localStorage.getItem("user"));
};

// Logout: borrar credenciales
export const logout = () => {
    localStorage.removeItem("user");
};

// Comprobar si hay usuario autenticado
export const estaAutenticado = () => {
    return localStorage.getItem("user") !== null;
};
