package com.peluqueria.service;


import com.peluqueria.model.Cita;
import com.peluqueria.repository.CitaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CitaServiceImpl implements CitaService{

    @Autowired
    private CitaRepository citaRepository;

    @Override
    public List<Cita> listarTodas() {
        return citaRepository.findAll();
    }

    @Override
    public Optional<Cita> buscarPorId(Integer id) {
        return citaRepository.findById(id);
    }

    @Override
    public Cita guardar(Cita cita) {
        return citaRepository.save(cita);
    }

    @Override
    public void eliminarPorId(Integer id) {
        citaRepository.deleteById(id);
    }
}
