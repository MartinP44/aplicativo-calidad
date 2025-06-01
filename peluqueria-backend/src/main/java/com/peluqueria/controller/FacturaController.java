package com.peluqueria.controller;

import com.peluqueria.model.Factura;
import com.peluqueria.service.FacturaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/facturas")
@CrossOrigin(origins = "*")
public class FacturaController {

    @Autowired
    private FacturaService facturaService;

    @GetMapping
    public List<Factura> listar() {
        return facturaService.listarTodas();
    }

    @PostMapping
    public Factura guardar(@RequestBody Factura factura) {
        return facturaService.guardar(factura);
    }

    @GetMapping("/{id}")
    public Factura buscar(@PathVariable Integer id) {
        return facturaService.buscarPorId(id);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        facturaService.eliminarPorId(id);
    }
}

