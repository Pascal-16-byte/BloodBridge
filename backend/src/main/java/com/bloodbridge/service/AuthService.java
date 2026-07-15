package com.bloodbridge.service;

import com.bloodbridge.dto.request.LoginRequest;
import com.bloodbridge.dto.request.RegisterRequest;
import com.bloodbridge.dto.response.LoginResponse;
import com.bloodbridge.dto.response.UserResponse;

public interface AuthService {

    UserResponse register(RegisterRequest request);

    LoginResponse login(LoginRequest request);
}
