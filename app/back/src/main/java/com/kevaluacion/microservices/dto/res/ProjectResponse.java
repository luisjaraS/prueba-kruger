package com.kevaluacion.microservices.dto.res;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProjectResponse {

    @NotNull
    private Long id;

    @NotNull
    @Size(min = 3, max = 100)
    private String name;

    @Size(max = 255)
    private String description;

    private LocalDateTime createdAt;

    @NotNull
    private String ownerUsername;
}