package com.saanssaathi.app.service.impl;

import com.saanssaathi.app.model.dto.request.LoginRequest;
import com.saanssaathi.app.model.dto.request.RefreshTokenRequest;
import com.saanssaathi.app.model.dto.request.RegisterRequest;
import com.saanssaathi.app.model.dto.response.AuthResponse;
import com.saanssaathi.app.model.dto.response.UserResponse;
import com.saanssaathi.app.model.entity.RefreshToken;
import com.saanssaathi.app.model.entity.User;
import com.saanssaathi.app.repository.RefreshTokenRepository;
import com.saanssaathi.app.repository.UserRepository;
import com.saanssaathi.app.security.JwtTokenProvider;
import com.saanssaathi.app.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("An account with email " + request.getEmail() + " already exists.");
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .role(User.Role.USER)
                .isVerified(true)
                .isActive(true)
                .build();

        User savedUser = userRepository.save(user);

        return createAuthResponse(savedUser);
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password credentials."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password credentials.");
        }

        if (!user.isActive()) {
            throw new IllegalArgumentException("User account is disabled. Please contact support.");
        }

        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        return createAuthResponse(user);
    }

    @Override
    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        RefreshToken storedToken = refreshTokenRepository.findByTokenHash(request.getRefreshToken())
                .orElseThrow(() -> new IllegalArgumentException("Invalid or revoked refresh token."));

        if (storedToken.isRevoked() || storedToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            refreshTokenRepository.delete(storedToken);
            throw new IllegalArgumentException("Refresh token has expired or been revoked. Please sign in again.");
        }

        User user = storedToken.getUser();
        // Rotate refresh token
        refreshTokenRepository.delete(storedToken);

        return createAuthResponse(user);
    }

    @Override
    @Transactional
    public void logout(String refreshToken) {
        refreshTokenRepository.findByTokenHash(refreshToken)
                .ifPresent(refreshTokenRepository::delete);
    }

    @Override
    public UserResponse getCurrentUser(User user) {
        return toUserResponse(user);
    }

    private AuthResponse createAuthResponse(User user) {
        String accessToken = jwtTokenProvider.generateAccessToken(
                user.getEmail(), user.getId(), user.getRole().name());
        String refreshTokenString = jwtTokenProvider.generateRefreshToken();

        LocalDateTime expiresAt = LocalDateTime.now()
                .plusSeconds(jwtTokenProvider.getRefreshTokenExpirationMs() / 1000);

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .tokenHash(refreshTokenString)
                .expiresAt(expiresAt)
                .build();

        refreshTokenRepository.save(refreshToken);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshTokenString)
                .tokenType("Bearer")
                .expiresIn(jwtTokenProvider.getAccessTokenExpirationMs() / 1000)
                .user(toUserResponse(user))
                .build();
    }

    private UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .isVerified(user.isVerified())
                .build();
    }
}
