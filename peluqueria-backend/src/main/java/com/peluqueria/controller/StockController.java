package com.peluqueria.controller;

import com.peluqueria.model.Stock;
import com.peluqueria.service.StockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stock")
public class StockController {

    @Autowired
    private StockService stockService;

    @GetMapping
    public List<Stock> listar() {
        return stockService.listarTodos();
    }

    @PostMapping
    public Stock guardar(@RequestBody Stock stock) {
        return stockService.guardar(stock);
    }

    @PutMapping("/{id}")
    public Stock actualizar(@PathVariable Integer id, @RequestBody Stock stock) {
        stock.setId(id);
        return stockService.guardar(stock);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        stockService.eliminarPorId(id);
    }
}

