package com.peluqueria.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class FacturaDetalle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // ────────────────────────────────────────────────────────────────────────────
    // Indicamos que esta propiedad es la “back reference” de la relación. Cuando
    // Jackson esté serializando una Factura, e incluya sus detalles, NO debe
    // volver a serializar la factura completa dentro de cada detalle.
    // ────────────────────────────────────────────────────────────────────────────
    @ManyToOne
    @JoinColumn(name = "factura_id")
    @JsonBackReference
    private Factura factura;

    private String tipo; // "PRODUCTO" o "SERVICIO"
    private String descripcion;
    private Double precio;
    private Integer cantidad;
}


