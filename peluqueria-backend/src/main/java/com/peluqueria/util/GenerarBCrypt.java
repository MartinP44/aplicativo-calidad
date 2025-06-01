package com.peluqueria.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

public class GenerarBCrypt {
    public static void main(String[] args) {
        // 1) Instanciar el encoder
        PasswordEncoder encoder = new BCryptPasswordEncoder();

        // 2) Define la contraseña en texto plano que quieres hashear
        String rawPassword = "admin123";

        // 3) Genera el hash
        String hashed = encoder.encode(rawPassword);

        // 4) Imprime el resultado
        System.out.println("Raw:     " + rawPassword);
        System.out.println("Hashed:  " + hashed);
    }
}

