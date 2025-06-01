package com.peluqueria.repository;

import com.peluqueria.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductoRepository extends JpaRepository<Producto, Integer> {
    Producto findByNombre(String nombre);
}
