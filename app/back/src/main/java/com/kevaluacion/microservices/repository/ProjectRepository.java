package com.kevaluacion.microservices.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.kevaluacion.microservices.model.Project;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    @Query("SELECT p FROM Project p WHERE p.user.id = :userId AND p.status = 'ACTIVE' ORDER BY p.id ASC")
    List<Project> findByUserIdOrderById(Long userId);
}
