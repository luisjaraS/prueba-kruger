package com.kevaluacion.microservices.service;

import java.time.LocalDate;
import java.util.List;

import com.kevaluacion.microservices.dto.res.TaskResponse;
import com.kevaluacion.microservices.dto.req.TaskRequest;
import com.kevaluacion.microservices.utils.error.exceptions.NotFoundObjectException;

public interface TaskService {

	TaskResponse create(TaskRequest request, String name);

	List<TaskResponse> findProjectByUser(String name,  LocalDate dateFrom, LocalDate dateTo);

	List<TaskResponse> findProjectById(Long projectId);

	TaskResponse update(TaskRequest request, Long id) throws NotFoundObjectException;

	void delete(Long id) throws NotFoundObjectException;
}
