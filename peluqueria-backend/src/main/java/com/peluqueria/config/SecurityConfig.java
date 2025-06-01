package com.peluqueria.config;

import com.peluqueria.model.Usuario;
import com.peluqueria.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private UsuarioService usuarioService;

    // 1) UserDetailsService para cargar usuario desde BD
    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            Usuario u = usuarioService.buscarPorUsername(username);
            if (u == null) {
                throw new UsernameNotFoundException("Usuario no encontrado: " + username);
            }
            UserDetails user = User.builder()
                    .username(u.getUsername())
                    .password(u.getPassword())
                    .roles(u.getRol()) // “ADMIN” o “USER”
                    .build();
            return user;
        };
    }

    // 2) PasswordEncoder (BCrypt)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 3) Configuración CORS (para que el navegador permita llamadas de React en localhost:3000)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    // 4) Cadena de filtros de seguridad
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // 4.1) Activar CORS
                .cors().and()

                // 4.2) Desactivar CSRF (API REST + Basic Auth)
                .csrf().disable()

                // 4.3) Autorización de rutas:
                .authorizeHttpRequests(authorize -> authorize
                        // → Permitir que cualquier usuario autenticado haga GET /api/usuarios/**
                        .requestMatchers(HttpMethod.GET, "/api/usuarios/**").hasAnyRole("ADMIN", "USER")

                        // → Solo ADMIN puede crear, editar y eliminar usuarios
                        .requestMatchers(HttpMethod.POST, "/api/usuarios/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/usuarios/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/usuarios/**").hasRole("ADMIN")

                        // → El resto de /api/** requiere solo autenticación (ADMIN o USER)
                        .requestMatchers("/api/**").authenticated()

                        // → Páginas públicas (frontend estático, login, favicon…)
                        .requestMatchers("/", "/index.html", "/static/**", "/login", "/favicon.ico").permitAll()
                )
                // 4.4) Usar HTTP Basic
                .httpBasic();

        return http.build();
    }

    // 5) Exponer AuthenticationManager (para futuras extensiones, si se requiere)
    @Bean
    public AuthenticationManager authManager(HttpSecurity http,
                                             PasswordEncoder passwordEncoder,
                                             UserDetailsService userDetailsService) throws Exception {
        return http.getSharedObject(AuthenticationManagerBuilder.class)
                .userDetailsService(userDetailsService)
                .passwordEncoder(passwordEncoder)
                .and()
                .build();
    }
}
