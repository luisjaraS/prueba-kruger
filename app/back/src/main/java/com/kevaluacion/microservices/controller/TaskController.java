package com.kevaluacion.microservices.controller;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kevaluacion.microservices.dto.res.TaskResponse;
import com.kevaluacion.microservices.dto.req.TaskRequest;
import com.kevaluacion.microservices.service.TaskService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/tasks")
public class TaskController {

	@Autowired
	private TaskService taskService;
	

	@PostMapping
	public ResponseEntity<TaskResponse> create(@Valid @RequestBody TaskRequest request, Principal principal) {
		return ResponseEntity.ok(taskService.create(request, principal.getName()));
	}

	@GetMapping
	public ResponseEntity<List<TaskResponse>> getUserTasks(Principal principal, @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
	        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo) {
		return ResponseEntity.ok(taskService.findProjectByUser(principal.getName(), dateFrom,dateTo));
	}

	@GetMapping("/project/{projectId}")
	public ResponseEntity<List<TaskResponse>> getByProject(@PathVariable Long projectId) {
		return ResponseEntity.ok(taskService.findProjectById(projectId));
	}

	@PutMapping("/{id}")
	public ResponseEntity<TaskResponse> update(@Valid @RequestBody TaskRequest request, @PathVariable Long id) {
		return ResponseEntity.ok(taskService.update(request, id));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		taskService.delete(id);
		return ResponseEntity.noContent().build();
	}

}
