package com.peluqueria.repository;

import com.peluqueria.model.FacturaDetalle;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FacturaDetalleRepository extends JpaRepository<FacturaDetalle, Integer> {
}

