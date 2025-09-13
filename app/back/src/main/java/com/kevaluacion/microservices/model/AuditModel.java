package com.kevaluacion.microservices.model;

import jakarta.persistence.MappedSuperclass;
import lombok.Data;

@MappedSuperclass
@Data
public class AuditModel {

	private String createdBy;
	private String updatedBy;
}
