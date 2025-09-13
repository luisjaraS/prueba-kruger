package com.kevaluacion.microservices.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.kevaluacion.microservices.dto.req.UserRequest;
import com.kevaluacion.microservices.model.User;
import com.kevaluacion.microservices.utils.error.exceptions.NotFoundObjectException;

@Service
public interface UserService {

    User createUser(UserRequest user);

	List<User> getAllUsers();

	User getById(Long id) throws NotFoundObjectException;
}
