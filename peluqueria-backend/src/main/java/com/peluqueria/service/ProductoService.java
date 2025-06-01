package com.peluqueria.service;

import com.peluqueria.model.Producto;

import java.util.List;
import java.util.Optional;

public interface ProductoService {
    List<Producto> listarTodos();
    Optional<Producto> buscarPorId(Integer id);
    Producto guardar(Producto producto);
    void eliminarPorId(Integer id);
}
