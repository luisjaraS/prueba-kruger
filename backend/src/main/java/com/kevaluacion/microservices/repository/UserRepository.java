package com.kevaluacion.microservices.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kevaluacion.microservices.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);
}