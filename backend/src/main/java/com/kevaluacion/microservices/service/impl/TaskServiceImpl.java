package com.kevaluacion.microservices.service.impl;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kevaluacion.microservices.dto.res.TaskResponse;
import com.kevaluacion.microservices.dto.req.TaskRequest;
import com.kevaluacion.microservices.model.TaskState;
import com.kevaluacion.microservices.mapper.TaskMapper;
import com.kevaluacion.microservices.model.Task;
import com.kevaluacion.microservices.model.User;
import com.kevaluacion.microservices.repository.TaskRepository;
import com.kevaluacion.microservices.repository.UserRepository;
import com.kevaluacion.microservices.repository.ProjectRepository;
import com.kevaluacion.microservices.model.Project;
import com.kevaluacion.microservices.service.TaskService;
import com.kevaluacion.microservices.utils.error.exceptions.NotFoundObjectException;

import lombok.extern.log4j.Log4j2;


@Log4j2
@Service
public class TaskServiceImpl implements TaskService {
	@Autowired
	private TaskRepository taskRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private ProjectRepository projectRepository;

	public TaskResponse create(TaskRequest request, String name) {
		User user = userRepository.findByEmail(name).orElseThrow();
		log.info("Peticion recibida: create");
		Task task = new Task();
		task.setTitle(request.getTitle());
		task.setDescription(request.getDescription());
		task.setTaskState(request.getTaskState() != null ? request.getTaskState() : TaskState.PENDIENTE);
		task.setDueDate(request.getDueDate());
		task.setAssignedTo(userRepository.findByUsername(request.getAssignedTo()).orElse(user));
		Project project = projectRepository.findById(request.getProjectId())
			.orElseThrow(() -> new RuntimeException("Project not found with id: " + request.getProjectId()));
		task.setProject(project);
		return TaskMapper.toResponse(taskRepository.save(task));
	}

	public List<TaskResponse> findProjectByUser(String name,  LocalDate dateFrom, LocalDate dateTo) {
		log.info("Peticion recibida: findByUser");
		List<Task> response = taskRepository.findTasksByUserAndDateRange(name, dateFrom, dateTo);
		if (response.isEmpty()) {
			return new ArrayList<>();
		} else {
			return response.stream()
				.sorted(Comparator.comparing(Task::getId))
		        .map(TaskMapper::toResponse)
		        .toList();
		}
	}

	public List<TaskResponse> findProjectById(Long projectId) {
		log.info("Peticion recibida: findByProjectId");
	List<Task> response =  taskRepository.findByProjectIdAndStatus(projectId, "ACTIVE");
		if (response.isEmpty()) {
			return new ArrayList<>();
		} else {
			return response.stream()
				.sorted(Comparator.comparing(Task::getId))
		        .map(TaskMapper::toResponse)
		        .toList();
		}
	}

	public TaskResponse update(TaskRequest request, Long id) throws NotFoundObjectException {
		log.info("Peticion recibida: update");
		Task existing = taskRepository.findById(id)
				.orElseThrow(() -> {
					log.error("Error en: update");
					return new NotFoundObjectException("Task doesn't exist, ID: " + id);
				});

		existing.setTitle(request.getTitle());
		existing.setDescription(request.getDescription());
		existing.setDueDate(request.getDueDate());
		if (request.getTaskState() != null) {
			existing.setTaskState(request.getTaskState());
		}
		if (request.getAssignedTo() != null) {
			existing.setAssignedTo(userRepository.findByUsername(request.getAssignedTo()).orElse(existing.getAssignedTo()));
		}
		// Permitir actualizar el projectId si viene en la request
		if (request.getProjectId() != null) {
			Project project = projectRepository.findById(request.getProjectId())
				.orElseThrow(() -> new RuntimeException("Project not found with id: " + request.getProjectId()));
			existing.setProject(project);
		}
		return TaskMapper.toResponse(taskRepository.save(existing));
	}

	public void delete(Long id) throws NotFoundObjectException {
		log.info("Peticion recibida: delete");
		Task task = taskRepository.findById(id)
			.orElseThrow(() -> {
				log.error("Error en: delete");
				return new NotFoundObjectException("Task doesn't exist, ID: " + id);
			});
		task.setStatus("INACTIVE");
		taskRepository.save(task);
	}

}
