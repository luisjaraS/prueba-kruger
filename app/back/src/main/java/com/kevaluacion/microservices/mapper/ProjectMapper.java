package com.kevaluacion.microservices.mapper;

import com.kevaluacion.microservices.dto.res.ProjectResponse;
import com.kevaluacion.microservices.model.Project;

public class ProjectMapper {
    
    public static ProjectResponse toResponse(Project project) {
        return ProjectResponse.builder()
            .id(project.getId())
            .name(project.getName())
            .description(project.getDescription())
            .createdAt(project.getCreatedAt())
            .ownerUsername(project.getUser().getUsername())
            .build();
    }
	
}
