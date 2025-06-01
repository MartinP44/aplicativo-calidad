package com.peluqueria.repository;

import com.peluqueria.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    // Para buscar por username al autenticar
    Optional<Usuario> findByUsername(String username);
}
