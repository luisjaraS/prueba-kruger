package com.kevaluacion.microservices.service.impl;

import java.security.Principal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kevaluacion.microservices.dto.res.ProjectResponse;
import com.kevaluacion.microservices.mapper.ProjectMapper;
import com.kevaluacion.microservices.model.Project;
import com.kevaluacion.microservices.model.Task;
import com.kevaluacion.microservices.model.User;
import com.kevaluacion.microservices.repository.ProjectRepository;
import com.kevaluacion.microservices.repository.TaskRepository;
import com.kevaluacion.microservices.repository.UserRepository;
import com.kevaluacion.microservices.service.ProjectService;
import com.kevaluacion.microservices.utils.error.exceptions.NotFoundObjectException;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class ProjectServiceImpl implements ProjectService {
    
    @Autowired
	private ProjectRepository projectRepository;
	
	@Autowired
	private TaskRepository taskRepository;

	@Autowired
	private UserRepository userRepository;

	@Override
	public ProjectResponse create(Project project, Principal principal) {
		User owner = userRepository.findByEmail(principal.getName()).orElseThrow();
		project.setUser(owner);
		log.info("Peticion recibida: create");
		return ProjectMapper.toResponse(projectRepository.save(project));
	}

	@Override
	public List<ProjectResponse> findProjectsByUserOwner(Principal principal) {
		User user = userRepository.findByEmail(principal.getName()).orElseThrow(() -> {
					log.error("Error en: update");
					return new NotFoundObjectException("User not found, Email: " +principal.getName() );
				});
		log.info("Peticion recibida: findAllByOwner");
		List<Project> responseEnt = projectRepository.findByUserIdOrderById(user.getId());

		if (responseEnt.isEmpty()) {
			return  new ArrayList<>();
		}
		else {
			return responseEnt.stream()
				.sorted(Comparator.comparing(Project::getId))
		        .map(ProjectMapper::toResponse)
		        .toList();
		}
	}

	public ProjectResponse update(Project project, Long id) throws NotFoundObjectException {
		log.info("Peticion recibida: update");
		Project existing = projectRepository.findById(id)
				.orElseThrow(() -> {
					log.error("Error en: update");
					return new NotFoundObjectException("Project not found, ID: " + id);
				});

		existing.setName(project.getName());
		existing.setDescription(project.getDescription());

		return ProjectMapper.toResponse(projectRepository.save(existing));
	}

	public void delete(Long id) throws NotFoundObjectException {
		log.info("Peticion recibida: delete");
		Project project = projectRepository.findById(id)
			.orElseThrow(() -> {
				log.error("Error en: delete");
				return new NotFoundObjectException("Project not found, ID:" + id);
			});
		project.setStatus("INACTIVE");
		projectRepository.save(project);
	List<Task> tasks = taskRepository.findByProjectIdAndStatus(id, "ACTIVE");
		if (!tasks.isEmpty()) {
			for (Task task: tasks) {
				task.setStatus("INACTIVE");
				taskRepository.save(task);
			}
		}
	}
}
