package com.kevaluacion.microservices.mapper;

import com.kevaluacion.microservices.dto.req.UserRequest;
import com.kevaluacion.microservices.dto.res.UserResponse;
import com.kevaluacion.microservices.model.User;

public class UserMapper {

	public static UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    public static User toEntity(UserRequest dto) {
        return User.builder()
                .username(dto.getUsername())
                .email(dto.getEmail())
                .password(dto.getPassword())
                .role(dto.getRole())
                .build();
    }
}

