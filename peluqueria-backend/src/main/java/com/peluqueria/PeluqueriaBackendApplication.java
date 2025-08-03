package com.peluqueria;

import java.util.Arrays;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PeluqueriaBackendApplication {

    public static void main(String[] args) {

        String[] safeArgs = Arrays.stream(args)
                .filter(arg -> arg.matches("--spring\\.profiles\\.active=(dev|prod)"))
                .toArray(String[]::new);

        SpringApplication.run(PeluqueriaBackendApplication.class, safeArgs);
    }

}
