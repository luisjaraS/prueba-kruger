package com.kevaluacion.microservices.mapper;


import com.kevaluacion.microservices.dto.res.TaskResponse;
import com.kevaluacion.microservices.model.Task;

public class TaskMapper {

	public static TaskResponse toResponse(Task task) {
        return TaskResponse.builder()
            .id(task.getId())
            .title(task.getTitle())
            .description(task.getDescription())
            .status(task.getStatus())
            .taskState(task.getTaskState())
            .dueDate(task.getDueDate())
            .createdAt(task.getCreatedAt())
            .assignedTo(task.getAssignedTo().getUsername())
            .projectId(task.getProject() != null ? task.getProject().getId() : null)
            .build();
    }

}