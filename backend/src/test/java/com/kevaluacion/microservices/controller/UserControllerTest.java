package com.kevaluacion.microservices.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

import java.util.List;

import com.kevaluacion.microservices.dto.req.UserRequest;
import com.kevaluacion.microservices.dto.res.UserResponse;
import com.kevaluacion.microservices.mapper.UserMapper;
import com.kevaluacion.microservices.model.User;
import com.kevaluacion.microservices.service.UserService;
import com.kevaluacion.microservices.utils.enums.Role;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @InjectMocks
    private UserController userController;

    @Mock
    private UserService userService;

    @Test
    void shouldReturnUserById() {
        // Arrange
        User user = new User(101L, "johndoe", "johndoe@example.com", "encrypted", Role.ADMIN);
        UserResponse expectedResponse = new UserResponse(101L, "johndoe", "johndoe@example.com", Role.ADMIN);

        when(userService.getById(101L)).thenReturn(user);

        try (MockedStatic<UserMapper> staticMapper = mockStatic(UserMapper.class)) {
            staticMapper.when(() -> UserMapper.toResponse(user)).thenReturn(expectedResponse);

            // Act
            ResponseEntity<UserResponse> response = userController.getById(101L);

            // Assert
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertEquals(expectedResponse, response.getBody());
        }
    }

    @Test
    void shouldReturnAllUsersSortedById() {
        // Arrange
        User user1 = new User(1L, "alex", "alex@example.com", "pwd", Role.USER);
        User user2 = new User(2L, "jane", "jane@example.com", "pwd", Role.ADMIN);

        UserResponse res1 = new UserResponse(1L, "alex", "alex@example.com", Role.USER);
        UserResponse res2 = new UserResponse(2L, "jane", "jane@example.com", Role.ADMIN);

        when(userService.getAllUsers()).thenReturn(List.of(user2, user1)); // unsorted

        try (MockedStatic<UserMapper> staticMapper = mockStatic(UserMapper.class)) {
            staticMapper.when(() -> UserMapper.toResponse(user1)).thenReturn(res1);
            staticMapper.when(() -> UserMapper.toResponse(user2)).thenReturn(res2);

            // Act
            ResponseEntity<List<UserResponse>> response = userController.listAll();

            // Assert
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertEquals(2, response.getBody().size());
            assertEquals("alex@example.com", response.getBody().get(0).getEmail()); // sorted by id
        }
    }

    @Test
    void shouldCreateUserSuccessfully() {
        // Arrange
        UserRequest request = new UserRequest("maria", "maria@example.com", "securePass", Role.USER);
        User savedUser = new User(10L, "maria", "maria@example.com", "hashedPass", Role.USER);
        UserResponse expectedResponse = new UserResponse(10L, "maria", "maria@example.com", Role.USER);

        when(userService.createUser(request)).thenReturn(savedUser);

        try (MockedStatic<UserMapper> staticMapper = mockStatic(UserMapper.class)) {
            staticMapper.when(() -> UserMapper.toResponse(savedUser)).thenReturn(expectedResponse);

            // Act
            ResponseEntity<UserResponse> response = userController.create(request);

            // Assert
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertEquals("maria@example.com", response.getBody().getEmail());
        }
    }
}
