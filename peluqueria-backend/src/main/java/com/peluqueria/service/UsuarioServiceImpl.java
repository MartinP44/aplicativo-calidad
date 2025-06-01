package com.peluqueria.service;

import com.peluqueria.model.Usuario;
import com.peluqueria.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    @Override
    public Usuario buscarPorId(Integer id) {
        return usuarioRepository.findById(id).orElse(null);
    }

    @Override
    public Usuario buscarPorUsername(String username) {
        Optional<Usuario> op = usuarioRepository.findByUsername(username);
        return op.orElse(null);
    }

    @Override
    public Usuario crear(Usuario u) {
        return usuarioRepository.save(u);
    }

    @Override
    public void eliminarPorId(Integer id) {
        usuarioRepository.deleteById(id);
    }
}

