package com.kevaluacion.microservices.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.kevaluacion.microservices.dto.req.UserRequest;
import com.kevaluacion.microservices.mapper.UserMapper;
import com.kevaluacion.microservices.model.User;
import com.kevaluacion.microservices.repository.UserRepository;
import com.kevaluacion.microservices.service.UserService;
import com.kevaluacion.microservices.utils.error.exceptions.NotFoundObjectException;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class UserServiceImpl implements UserService{
    
    @Autowired
	private UserRepository userRepository;


	 @Autowired
    private PasswordEncoder passwordEncoder;



	
	public User createUser(UserRequest user) {
		
		log.info("Peticion recibida: createUser");
		User req = UserMapper.toEntity(user);
        req.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(req);
	}

	public List<User> getAllUsers() {
		log.info("Peticion recibida: getAllUsers");
		return userRepository.findAll();
	}

	public User getById(Long id) throws NotFoundObjectException {
		log.info("Peticion recibida: getById");
		return userRepository.findById(id)
				.orElseThrow(() -> {
					log.error("Error en: getById");
					return new NotFoundObjectException("User not found, ID: " + id);
				});
	}
}
