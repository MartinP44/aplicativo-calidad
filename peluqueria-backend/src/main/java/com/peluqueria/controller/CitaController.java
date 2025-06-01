package com.peluqueria.controller;


import com.peluqueria.model.Cita;
import com.peluqueria.service.CitaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/citas")
@CrossOrigin(origins = "*")
public class CitaController {

    @Autowired
    private CitaService citaService;

    @GetMapping
    public List<Cita> listarCitas() {
        return citaService.listarTodas();
    }

    @GetMapping("/{id}")
    public Optional<Cita> buscarCita(@PathVariable Integer id) {
        return citaService.buscarPorId(id);
    }

    @PostMapping
    public Cita crearCita(@RequestBody Cita cita) {
        return citaService.guardar(cita);
    }

    @PutMapping("/{id}")
    public Cita actualizarCita(@PathVariable Integer id, @RequestBody Cita cita) {
        cita.setId(id);
        return citaService.guardar(cita);
    }

    @DeleteMapping("/{id}")
    public void eliminarCita(@PathVariable Integer id) {
        citaService.eliminarPorId(id);
    }
}
