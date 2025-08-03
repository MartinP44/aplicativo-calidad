package com.peluqueria.controller;


import com.peluqueria.model.Cliente;
import com.peluqueria.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    @GetMapping
    public List<Cliente> listarClientes() {
        return clienteService.listarTodos();
    }

    @GetMapping("/{cedula}")
    public Optional<Cliente> buscarCliente(@PathVariable String cedula) {
        return clienteService.buscarPorCedula(cedula);
    }

    @PostMapping
    public Cliente crearCliente(@RequestBody Cliente cliente) {
        return clienteService.guardar(cliente);
    }

    @PutMapping("/{cedula}")
    public Cliente actualizarCliente(@PathVariable String cedula, @RequestBody Cliente cliente) {
        cliente.setCedula(cedula);
        return clienteService.guardar(cliente);
    }

    @DeleteMapping("/{cedula}")
    public void eliminarCliente(@PathVariable String cedula) {
        clienteService.eliminarPorCedula(cedula);
    }


}
