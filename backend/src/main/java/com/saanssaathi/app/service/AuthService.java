package com.saanssaathi.app.service;

import com.saanssaathi.app.model.dto.request.LoginRequest;
import com.saanssaathi.app.model.dto.request.RefreshTokenRequest;
import com.saanssaathi.app.model.dto.request.RegisterRequest;
import com.saanssaathi.app.model.dto.response.AuthResponse;
import com.saanssaathi.app.model.dto.response.UserResponse;
import com.saanssaathi.app.model.entity.User;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    AuthResponse refreshToken(RefreshTokenRequest request);
    void logout(String refreshToken);
    UserResponse getCurrentUser(User user);
}
