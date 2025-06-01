package com.peluqueria.service;

import com.peluqueria.model.Stock;

import java.util.List;
import java.util.Optional;

public interface StockService {
    List<Stock> listarTodos();
    Optional<Stock> buscarPorId(Integer id);
    Stock guardar(Stock stock);
    void eliminarPorId(Integer id);
}

