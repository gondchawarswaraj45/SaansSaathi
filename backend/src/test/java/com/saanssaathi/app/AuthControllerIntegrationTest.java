package com.saanssaathi.app;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.saanssaathi.app.model.dto.request.LoginRequest;
import com.saanssaathi.app.model.dto.request.RegisterRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@DisplayName("Authentication Controller Integration Test (SQLite)")
class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Should successfully register a new user in SQLite and return tokens")
    void shouldRegisterNewUser() throws Exception {
        String uniqueEmail = "priya.verma." + System.currentTimeMillis() + "@saanssaathi.org";
        RegisterRequest request = RegisterRequest.builder()
                .fullName("Priya Verma")
                .email(uniqueEmail)
                .password("SecurePass@123")
                .city("Pune")
                .phone("+919876543210")
                .build();

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.accessToken", notNullValue()))
                .andExpect(jsonPath("$.data.refreshToken", notNullValue()))
                .andExpect(jsonPath("$.data.user.email", is(uniqueEmail)))
                .andExpect(jsonPath("$.data.user.fullName", is("Priya Verma")));
    }

    @Test
    @DisplayName("Should successfully authenticate seeded admin user and return JWT")
    void shouldLoginDefaultAdmin() throws Exception {
        LoginRequest request = LoginRequest.builder()
                .email("admin@saanssaathi.org")
                .password("Admin@123")
                .build();

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.accessToken", notNullValue()))
                .andExpect(jsonPath("$.data.user.email", is("admin@saanssaathi.org")))
                .andExpect(jsonPath("$.data.user.role", is("ADMIN")));
    }

    @Test
    @DisplayName("Should reject invalid login credentials with 400 Bad Request")
    void shouldRejectInvalidCredentials() throws Exception {
        LoginRequest request = LoginRequest.builder()
                .email("admin@saanssaathi.org")
                .password("WrongPassword999")
                .build();

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.errorCode", is("INVALID_ARGUMENT")));
    }
}
