package com.peluqueria.model;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Cliente {

    @Id
    private String cedula;

    private String nombre;
    private String apellido;
    private String telefono;
    private String email;
    private String direccion;
    private String estadoCivil;
    private String sexo;
    private String enfermedadesCapi;
    private String alergias;
    private String preferenciasProd;
    private java.sql.Date fechaNac;
}
