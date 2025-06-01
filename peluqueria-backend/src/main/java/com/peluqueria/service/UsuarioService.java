package com.peluqueria.service;

import com.peluqueria.model.Usuario;
import java.util.List;

public interface UsuarioService {
    List<Usuario> listarTodos();
    Usuario buscarPorId(Integer id);
    Usuario buscarPorUsername(String username);
    Usuario crear(Usuario u);
    void eliminarPorId(Integer id);
}

