package com.kevaluacion.microservices.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.*;

import java.security.Principal;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.kevaluacion.microservices.dto.res.ProjectResponse;
import com.kevaluacion.microservices.model.Project;
import com.kevaluacion.microservices.service.ProjectService;

@ExtendWith(MockitoExtension.class)
class ProjectControllerTest {

    @InjectMocks
    private ProjectController projectController;

    @Mock
    private ProjectService projectService;

    @Mock
    private Principal principal;

    @Test
    void shouldCreateProjectSuccessfully() {
        // Arrange
        Project request = new Project();
        request.setName("Accounting System");
        request.setDescription("Handles internal financial logic");

        ProjectResponse expected = new ProjectResponse(
            101L,
            "Accounting System",
            "Handles internal financial logic",
            null,
            "johndoe"
        );

        // No stubbing on principal.getName()
        when(projectService.create(request, principal)).thenReturn(expected);

        // Act
        ResponseEntity<ProjectResponse> response = projectController.create(request, principal);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expected, response.getBody());
    }

    @Test
    void shouldReturnAllProjectsOwnedByUser() {
        // Arrange
        List<ProjectResponse> expectedList = List.of(
            new ProjectResponse(1L, "ERP System", "Enterprise resource planning", null, "johndoe"),
            new ProjectResponse(2L, "CRM Tool", "Customer relationship management", null, "johndoe")
        );

        when(projectService.findProjectsByUserOwner(principal)).thenReturn(expectedList);

        // Act
        ResponseEntity<List<ProjectResponse>> response = projectController.getUserProjects(principal);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedList, response.getBody());
    }

    @Test
    void shouldUpdateProjectSuccessfully() {
        // Arrange
        Project request = new Project();
        request.setName("Intranet Portal");
        request.setDescription("Redesign of the internal company portal");

        ProjectResponse expected = new ProjectResponse(
            33L,
            "Intranet Portal",
            "Redesign of the internal company portal",
            null,
            "johndoe"
        );

        when(projectService.update(request, 33L)).thenReturn(expected);

        // Act
        ResponseEntity<ProjectResponse> response = projectController.update(request, 33L);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expected, response.getBody());
    }

    @Test
    void shouldDeleteProjectSuccessfully() {
        // Arrange
        doNothing().when(projectService).delete(44L);

        // Act
        ResponseEntity<Void> response = projectController.delete(44L);

        // Assert
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        assertNull(response.getBody());
    }
}
