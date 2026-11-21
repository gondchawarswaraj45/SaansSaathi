package com.saanssaathi.app;

import com.saanssaathi.app.model.dto.request.LoginRequest;
import com.saanssaathi.app.model.dto.request.RegisterRequest;
import com.saanssaathi.app.model.dto.response.AuthResponse;
import com.saanssaathi.app.model.entity.User;
import com.saanssaathi.app.repository.RefreshTokenRepository;
import com.saanssaathi.app.repository.UserRepository;
import com.saanssaathi.app.security.JwtTokenProvider;
import com.saanssaathi.app.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @InjectMocks
    private AuthServiceImpl authService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .id(1L)
                .email("test@saanssaathi.in")
                .fullName("Test User")
                .passwordHash("encodedPassword")
                .role(User.Role.USER)
                .isActive(true)
                .isVerified(true)
                .build();
    }

    @Test
    void register_Success() {
        RegisterRequest request = RegisterRequest.builder()
                .email("test@saanssaathi.in")
                .fullName("Test User")
                .password("Password@123")
                .build();

        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);
        when(jwtTokenProvider.generateAccessToken(anyString(), any(), anyString())).thenReturn("mockAccessToken");
        when(jwtTokenProvider.generateRefreshToken()).thenReturn("mockRefreshToken");
        when(jwtTokenProvider.getAccessTokenExpirationMs()).thenReturn(3600000L);
        when(jwtTokenProvider.getRefreshTokenExpirationMs()).thenReturn(604800000L);

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("mockAccessToken", response.getAccessToken());
        assertEquals("mockRefreshToken", response.getRefreshToken());
        assertEquals("test@saanssaathi.in", response.getUser().getEmail());
    }

    @Test
    void login_Success() {
        LoginRequest request = LoginRequest.builder()
                .email("test@saanssaathi.in")
                .password("Password@123")
                .build();

        when(userRepository.findByEmail("test@saanssaathi.in")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("Password@123", "encodedPassword")).thenReturn(true);
        when(jwtTokenProvider.generateAccessToken(anyString(), any(), anyString())).thenReturn("mockAccessToken");
        when(jwtTokenProvider.generateRefreshToken()).thenReturn("mockRefreshToken");
        when(jwtTokenProvider.getAccessTokenExpirationMs()).thenReturn(3600000L);
        when(jwtTokenProvider.getRefreshTokenExpirationMs()).thenReturn(604800000L);

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("mockAccessToken", response.getAccessToken());
        assertEquals("test@saanssaathi.in", response.getUser().getEmail());
    }

    @Test
    void login_InvalidPassword_ThrowsException() {
        LoginRequest request = LoginRequest.builder()
                .email("test@saanssaathi.in")
                .password("WrongPassword")
                .build();

        when(userRepository.findByEmail("test@saanssaathi.in")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("WrongPassword", "encodedPassword")).thenReturn(false);

        assertThrows(IllegalArgumentException.class, () -> authService.login(request));
    }
}
