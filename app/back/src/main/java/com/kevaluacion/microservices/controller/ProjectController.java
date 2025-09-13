package com.kevaluacion.microservices.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kevaluacion.microservices.dto.res.ProjectResponse;
import com.kevaluacion.microservices.model.Project;
import com.kevaluacion.microservices.service.ProjectService;


@RestController
@RequestMapping("/projects")
public class ProjectController {

	@Autowired
	private ProjectService projectService;
	

	@PostMapping
	public ResponseEntity<ProjectResponse> create(@RequestBody Project project, Principal principal) {
		return ResponseEntity.ok(projectService.create(project,principal));
	}

	@GetMapping
	public ResponseEntity<List<ProjectResponse>> getUserProjects(Principal principal) {
		return ResponseEntity.ok(projectService.findProjectsByUserOwner(principal));
	}

	@PutMapping("/{id}")
	public ResponseEntity<ProjectResponse> update(@RequestBody Project project, @PathVariable Long id) {
		return ResponseEntity.ok(projectService.update(project, id));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		projectService.delete(id);
		return ResponseEntity.noContent().build();
	}
}
