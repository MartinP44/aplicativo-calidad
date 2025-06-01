package com.peluqueria.service;


import com.peluqueria.model.Cliente;
import com.peluqueria.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClienteServiceImpl implements ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    @Override
    public List<Cliente> listarTodos(){
        return clienteRepository.findAll();
    }

    @Override
    public Optional<Cliente> buscarPorCedula(String cedula){
        return clienteRepository.findById(cedula);
    }

    @Override
    public Cliente guardar(Cliente cliente) {
        return clienteRepository.save(cliente);
    }

    @Override
    public void eliminarPorCedula(String cedula) {
        clienteRepository.deleteById(cedula);
    }
}
