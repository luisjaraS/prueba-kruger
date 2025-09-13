package com.kevaluacion.microservices.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "task")
@EqualsAndHashCode(callSuper = false)
@AllArgsConstructor
@NoArgsConstructor
public class Task extends AuditModel {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotBlank(message = "Title must not be blank")
    @Size(max = 100, message = "Title must be at most 100 characters long")
	@NotNull
	@Size(min = 3, max = 100)
	private String title;

	@Size(max = 500, message = "Description must be at most 500 characters long")
	@Size(max = 255)
	private String description;

	@NotNull(message = "Status must not be null")
	@NotNull
	@Size(max = 20)
	private String status = "ACTIVE";


	@NotNull(message = "Task state must not be null")
	@Enumerated(EnumType.STRING)
	private TaskState taskState = TaskState.PENDIENTE;

	@FutureOrPresent(message = "Due date must be today or in the future")
	private LocalDate dueDate;
	private LocalDateTime createdAt = LocalDateTime.now();

	@ManyToOne
	private User assignedTo;
	@ManyToOne
	private Project project;
}