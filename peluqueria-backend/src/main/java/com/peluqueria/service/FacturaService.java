package com.peluqueria.service;

import com.peluqueria.model.Factura;

import java.util.List;

public interface FacturaService {
    List<Factura> listarTodas();
    Factura guardar(Factura factura);
    Factura buscarPorId(Integer id);
    void eliminarPorId(Integer id);
}
