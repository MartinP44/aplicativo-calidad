package com.peluqueria.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
public class Factura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fecha;
    private Double total;

    // ────────────────────────────────────────────────────────────────────────────
    // Aquí indicamos que la relación “Detalle → Factura” es la back reference,
    // por lo que Jackson no tratará de volver a serializar la factura desde el detalle.
    // En el lado “padre” (Factura) usamos @JsonManagedReference para que sí incluya
    // la lista de detalles al serializar la factura, pero detenga la recursión.
    // ────────────────────────────────────────────────────────────────────────────
    @OneToMany(mappedBy = "factura", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<FacturaDetalle> detalles;
}

