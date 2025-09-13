
package com.kevaluacion.microservices.service.impl;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kevaluacion.microservices.dto.req.LoginRequest;
import com.kevaluacion.microservices.dto.res.LoginResponse;
import com.kevaluacion.microservices.model.User;
import com.kevaluacion.microservices.repository.UserRepository;
import com.kevaluacion.microservices.service.AuthenticationService;
import com.kevaluacion.microservices.utils.jwt.JwtUtil;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class AuthenticationImpl implements AuthenticationService {

    @Autowired
    private JwtUtil jwtUtilMethods;

    @Autowired
    private UserRepository userRepository;


    @Override
    public LoginResponse login(LoginRequest request) {
    	log.info("Peticion recibida: login");
        
    User user = userRepository.findByEmail(request.getEmail())
        .orElseThrow(() -> {
            log.error("Error en: login - usuario no encontrado");
            return new RuntimeException("User not found");
        });


        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.error("Error en: login - contraseña incorrecta");
            throw new RuntimeException("Invalid credentials");
        }

    String token = jwtUtilMethods.createToken(user);
    return new LoginResponse(token);
    }
}
