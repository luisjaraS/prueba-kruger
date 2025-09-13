package com.kevaluacion.microservices.dto.res;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import com.kevaluacion.microservices.model.TaskState;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TaskResponse {

	@NotNull
	private Long id;

	@NotNull
	@Size(min = 3, max = 100)
	private String title;

	@Size(max = 255)
	private String description;

	@NotNull
	private String status;

	@NotNull
	private TaskState taskState;

	private LocalDate dueDate;

	private LocalDateTime createdAt;

	@NotNull
	private String assignedTo;

	@NotNull
	private Long projectId;
}
