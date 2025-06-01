// src/services/facturaService.js

import axios from 'axios';

// URL base de la API de facturas en tu backend Spring Boot
const API_URL = "http://localhost:8080/api/facturas";

/**
 * Obtiene todas las facturas.
 * GET http://localhost:8080/api/facturas
 */
export const obtenerFacturas = () => {
    return axios.get(API_URL);
};

/**
 * Obtiene una factura específica por su ID.
 * GET http://localhost:8080/api/facturas/{id}
 */
export const obtenerFacturaPorId = (id) => {
    return axios.get(`${API_URL}/${id}`);
};

/**
 * Crea (guarda) una nueva factura.
 * POST http://localhost:8080/api/facturas
 * Body: { cliente: { cedula }, fecha, detalles: [ ... ] }
 */
export const crearFactura = (factura) => {
    return axios.post(API_URL, factura);
};

/**
 * Elimina una factura por su ID.
 * DELETE http://localhost:8080/api/facturas/{id}
 * (opcional, si en tu caso necesitas eliminar facturas)
 */
export const eliminarFactura = (id) => {
    return axios.delete(`${API_URL}/${id}`);
};
