package com.kevaluacion.microservices.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.kevaluacion.microservices.model.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {

    @Query("""
        SELECT t FROM Task t
        WHERE t.assignedTo.email = :username
        AND t.status = 'ACTIVE'
        AND (CAST(:dateFrom AS date) IS NULL OR t.dueDate >= :dateFrom)
        AND (CAST(:dateTo AS date) IS NULL OR t.dueDate <= :dateTo)
        ORDER BY t.id ASC
    """)
    List<Task> findTasksByUserAndDateRange(
        @Param("username") String username,
        @Param("dateFrom") LocalDate dateFrom,
        @Param("dateTo") LocalDate dateTo
    );
    
    List<Task> findByProjectIdAndStatus(Long projectId, String status);
    
}