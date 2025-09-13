package com.kevaluacion.microservices.controller;

import java.util.Comparator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kevaluacion.microservices.dto.req.UserRequest;
import com.kevaluacion.microservices.dto.res.UserResponse;
import com.kevaluacion.microservices.mapper.UserMapper;
import com.kevaluacion.microservices.model.User;
import com.kevaluacion.microservices.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/users")
//@PreAuthorize("hasRole('ADMIN')")
public class UserController {

	@Autowired
	private UserService userService;

	@GetMapping
	public ResponseEntity<List<UserResponse>> listAll() {
		return ResponseEntity.ok(userService.getAllUsers().stream()
				.sorted(Comparator.comparing(User::getId))
		        .map(UserMapper::toResponse)
		        .toList());
	}

	@GetMapping("/{id}")
	public ResponseEntity<UserResponse> getById(@PathVariable Long id) {
		User user = userService.getById(id);
		UserResponse dto = UserMapper.toResponse(user);
		return ResponseEntity.ok(dto);
	}

	@PostMapping
	public ResponseEntity<UserResponse> create(@Valid @RequestBody UserRequest user) {
		return ResponseEntity.ok(UserMapper.toResponse(userService.createUser(user)));
	}
}