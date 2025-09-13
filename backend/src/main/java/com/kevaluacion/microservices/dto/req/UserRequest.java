package com.kevaluacion.microservices.dto.req;

import com.kevaluacion.microservices.utils.enums.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserRequest {

	@NotBlank(message = "Username must not be blank")
    @Size(max = 50, message = "Username must be at most 50 characters long")
    private String username;

    @Email(message = "Email must be valid")
    @NotBlank(message = "Email must not be blank")
    private String email;

    @NotBlank(message = "Password must not be blank")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;

    @NotNull(message = "Role must not be null")
    private Role role;
}
