package com.kevaluacion.microservices.dto.req;

import java.time.LocalDate;

import com.kevaluacion.microservices.model.TaskState;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TaskRequest {

    @NotBlank(message = "Title must not be blank")
    @Size(min = 3, max = 100)
    private String title;

    @Size(max = 255)
    private String description;

    @NotNull(message = "Task state must not be null")
    private TaskState taskState;

    @FutureOrPresent(message = "Due date must be today or in the future")
    private LocalDate dueDate;

    @NotNull(message = "Assigned user must not be null")
    private String assignedTo;

    @NotNull(message = "Project ID must not be null")
    private Long projectId;
}
