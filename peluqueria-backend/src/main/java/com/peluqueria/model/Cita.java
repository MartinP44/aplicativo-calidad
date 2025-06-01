package com.peluqueria.model;


import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Getter
@Setter
public class Cita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fecha;
    @JsonFormat(pattern = "HH:mm")
    private LocalTime hora;
    private String servicio;
    private String observaciones;

    @ManyToOne
    @JoinColumn(name = "cliente_id", referencedColumnName = "cedula")
    private Cliente cliente;
}
