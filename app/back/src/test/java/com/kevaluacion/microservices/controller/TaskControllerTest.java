package com.kevaluacion.microservices.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.*;

import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.kevaluacion.microservices.dto.res.TaskResponse;

import com.kevaluacion.microservices.model.Project;
import com.kevaluacion.microservices.model.User;
import com.kevaluacion.microservices.model.TaskState;
import com.kevaluacion.microservices.dto.req.TaskRequest;
import com.kevaluacion.microservices.service.TaskService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@ExtendWith(MockitoExtension.class)
class TaskControllerTest {

    @InjectMocks
    private TaskController taskController;

    @Mock
    private TaskService taskService;

    @Mock
    private Principal principal;

    private User user;
    private Project project;

    @BeforeEach
    void setup() {
        user = new User();
        user.setId(101L);
        user.setUsername("johndoe");
        user.setEmail("johndoe@example.com");

        project = new Project();
        project.setId(202L);
        project.setName("Internal Tool");
        project.setDescription("Backoffice management system");
        project.setUser(user);
    }

    @Test
    void shouldCreateTaskSuccessfully() {
        TaskRequest taskRequest = TaskRequest.builder()
            .title("Generate Invoice")
            .description("Automate monthly billing")
            .taskState(TaskState.PENDIENTE)
            .dueDate(LocalDate.now())
            .assignedTo("johndoe")
            .projectId(202L)
            .build();

        TaskResponse expectedResponse = TaskResponse.builder()
            .id(1L)
            .title("Generate Invoice")
            .description("Automate monthly billing")
            .status("PENDIENTE")
            .dueDate(taskRequest.getDueDate())
            .createdAt(LocalDateTime.now())
            .assignedTo("johndoe")
            .projectId(202L)
            .build();

        when(principal.getName()).thenReturn("johndoe@example.com");
        when(taskService.create(taskRequest, "johndoe@example.com")).thenReturn(expectedResponse);

        ResponseEntity<TaskResponse> response = taskController.create(taskRequest, principal);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedResponse, response.getBody());
    }

    @Test
    void shouldGetTasksByUserWithoutDateFilters() {
    TaskResponse response1 = TaskResponse.builder()
        .id(10L)
        .title("Fix Bug")
        .description("Resolve login error")
        .status("IN_PROGRESS")
        .dueDate(LocalDate.now())
        .createdAt(LocalDateTime.now())
        .assignedTo("johndoe")
        .projectId(202L)
        .build();
    TaskResponse response2 = TaskResponse.builder()
        .id(11L)
        .title("Write Docs")
        .description("Create API documentation")
        .status("DONE")
        .dueDate(LocalDate.now())
        .createdAt(LocalDateTime.now())
        .assignedTo("johndoe")
        .projectId(202L)
        .build();

        when(principal.getName()).thenReturn("johndoe@example.com");
        when(taskService.findProjectByUser("johndoe@example.com", null, null)).thenReturn(List.of(response1, response2));

        ResponseEntity<List<TaskResponse>> result = taskController.getUserTasks(principal, null, null);

        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(2, result.getBody().size());
        assertEquals("Fix Bug", result.getBody().get(0).getTitle());
    }

    @Test
    void shouldGetTasksByProjectId() {
        Long projectId = 202L;
    TaskResponse response = TaskResponse.builder()
        .id(99L)
        .title("Deploy App")
        .description("Production release")
        .status("DONE")
        .dueDate(LocalDate.now())
        .createdAt(LocalDateTime.now())
        .assignedTo("johndoe")
        .projectId(projectId)
        .build();

        when(taskService.findProjectById(projectId)).thenReturn(List.of(response));

        ResponseEntity<List<TaskResponse>> result = taskController.getByProject(projectId);

        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(1, result.getBody().size());
        assertEquals("Deploy App", result.getBody().get(0).getTitle());
    }

    @Test
    void shouldUpdateTaskSuccessfully() {
        TaskRequest taskRequest = TaskRequest.builder()
            .title("Update Workflow")
            .description("Refactor logic")
            .taskState(TaskState.EN_PROGRESO)
            .dueDate(LocalDate.now())
            .assignedTo("johndoe")
            .projectId(202L)
            .build();

        TaskResponse updatedResponse = TaskResponse.builder()
            .id(55L)
            .title("Update Workflow")
            .description("Refactor logic")
            .status("EN_PROGRESO")
            .dueDate(taskRequest.getDueDate())
            .createdAt(LocalDateTime.now())
            .assignedTo("johndoe")
            .projectId(202L)
            .build();

        when(taskService.update(taskRequest, 55L)).thenReturn(updatedResponse);

        ResponseEntity<TaskResponse> response = taskController.update(taskRequest, 55L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Update Workflow", response.getBody().getTitle());
    }

    @Test
    void shouldDeleteTaskSuccessfully() {
        doNothing().when(taskService).delete(77L);

        ResponseEntity<Void> response = taskController.delete(77L);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        assertNull(response.getBody());
    }
}