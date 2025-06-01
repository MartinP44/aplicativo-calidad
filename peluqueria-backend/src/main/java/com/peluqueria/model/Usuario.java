package com.peluqueria.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "usuario")
@Getter
@Setter
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Nombre de usuario para el login (debe ser único)
    @Column(nullable = false, unique = true)
    private String username;

    // Hash de la contraseña (BCrypt)
    @Column(nullable = false)
    private String password;

    // Rol ("ADMIN" o "USER")
    @Column(nullable = false)
    private String rol;

}

