package com.kevaluacion.microservices.service;

import com.kevaluacion.microservices.dto.req.LoginRequest;
import com.kevaluacion.microservices.dto.res.LoginResponse;

public interface AuthenticationService {
    LoginResponse login(LoginRequest request);

}
