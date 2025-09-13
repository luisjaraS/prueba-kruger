package com.kevaluacion.microservices.service;

import java.security.Principal;
import java.util.List;

import com.kevaluacion.microservices.dto.res.ProjectResponse;
import com.kevaluacion.microservices.model.Project;
import com.kevaluacion.microservices.utils.error.exceptions.NotFoundObjectException;

public interface ProjectService {
    
    ProjectResponse create(Project project,  Principal principal);

	List<ProjectResponse> findProjectsByUserOwner(Principal principal);

	ProjectResponse update(Project project, Long id) throws NotFoundObjectException;

	void delete(Long id) throws NotFoundObjectException;
}
