package com.peluqueria.controller;

import com.peluqueria.model.Usuario;
import com.peluqueria.service.UsuarioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Listar todos los usuarios (solo ADMIN puede llegar aquí, por SecurityConfig).
     */
    @GetMapping
    public List<Usuario> listarUsuarios() {
        return usuarioService.listarTodos();
    }

    /**
     * Crear un usuario nuevo.
     * El rol debe ser “ADMIN” o “USER”. La contraseña vendrá en texto plano.
     */
    @PostMapping
    public ResponseEntity<?> crearUsuario(@RequestBody Usuario u) {
        // Validaciones mínimas:
        if (u.getUsername() == null || u.getUsername().isEmpty()) {
            return ResponseEntity.badRequest().body("El username es obligatorio");
        }
        if (u.getPassword() == null || u.getPassword().isEmpty()) {
            return ResponseEntity.badRequest().body("La contraseña es obligatoria");
        }
        if (!"ADMIN".equalsIgnoreCase(u.getRol()) && !"USER".equalsIgnoreCase(u.getRol())) {
            return ResponseEntity.badRequest().body("El rol debe ser ADMIN o USER");
        }
        // Encriptar la contraseña antes de guardar
        u.setPassword(passwordEncoder.encode(u.getPassword()));
        Usuario creado = usuarioService.crear(u);
        return ResponseEntity.ok(creado);
    }

    /**
     * Eliminar un usuario por ID (solo ADMIN).
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarUsuario(@PathVariable Integer id) {
        Usuario existente = usuarioService.buscarPorId(id);
        if (existente == null) {
            return ResponseEntity.notFound().build();
        }
        usuarioService.eliminarPorId(id);
        return ResponseEntity.ok().build();
    }

    /**
     * (Opcional) Editar usuario: cambiar rol o nombre, pero no contraseña aquí.
     * Podrías exponer también un endpoint para cambiar contraseña si quieres.
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarUsuario(@PathVariable Integer id, @RequestBody Usuario u) {
        Usuario existente = usuarioService.buscarPorId(id);
        if (existente == null) {
            return ResponseEntity.notFound().build();
        }
        // Actualizamos campos permitidos (rol y username; no contraseña directamente)
        if (u.getUsername() != null && !u.getUsername().isEmpty()) {
            existente.setUsername(u.getUsername());
        }
        if ("ADMIN".equalsIgnoreCase(u.getRol()) || "USER".equalsIgnoreCase(u.getRol())) {
            existente.setRol(u.getRol());
        }
        // Si quisieras cambiar contraseña, deberías encriptarla:
        if (u.getPassword() != null && !u.getPassword().isEmpty()) {
            existente.setPassword(passwordEncoder.encode(u.getPassword()));
        }
        Usuario updated = usuarioService.crear(existente);
        return ResponseEntity.ok(updated);
    }
}

