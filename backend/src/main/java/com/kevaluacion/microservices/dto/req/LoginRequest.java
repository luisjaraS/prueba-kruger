package com.kevaluacion.microservices.dto.req;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {

	@Email(message = "The email must be a valid email address")
    @NotBlank(message = "Email must not be blank")
    private String email;

    @NotBlank(message = "Password must not be blank")
    @Size(min = 3, message = "Password must be at least 3 characters long")
    private String password;
}
