package com.peluqueria.service;

import com.peluqueria.model.Cliente;

import java.util.List;
import java.util.Optional;

public interface ClienteService {
    List<Cliente> listarTodos();
    Optional<Cliente> buscarPorCedula(String cedula);
    Cliente guardar(Cliente cliente);
    void eliminarPorCedula(String cedula);
}
