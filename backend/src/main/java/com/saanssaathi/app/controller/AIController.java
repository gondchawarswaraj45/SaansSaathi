package com.saanssaathi.app.controller;

import com.saanssaathi.app.common.ApiResponse;
import com.saanssaathi.app.model.dto.request.ChatMessageRequest;
import com.saanssaathi.app.model.dto.response.AqiExplanationResponse;
import com.saanssaathi.app.model.dto.response.ChatMessageResponse;
import com.saanssaathi.app.model.dto.response.ChatSessionResponse;
import com.saanssaathi.app.model.entity.User;
import com.saanssaathi.app.service.GeminiService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Tag(name = "AI Air Quality Assistant (Gemini)", description = "AI chat, health guidance, personalized indoor strategies, and pollutant term explanations")
public class AIController {

    private final GeminiService geminiService;

    @PostMapping("/chat")
    @Operation(summary = "Send chat message to SaansSaathi AI with context and guardrails")
    public ResponseEntity<ApiResponse<ChatMessageResponse>> chat(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ChatMessageRequest request) {
        ChatMessageResponse response = geminiService.chat(user.getId(), request);
        return ResponseEntity.ok(ApiResponse.success(response, "AI response generated successfully"));
    }

    @GetMapping("/chat/sessions")
    @Operation(summary = "List all chat sessions for the logged-in user")
    public ResponseEntity<ApiResponse<List<ChatSessionResponse>>> getSessions(
            @AuthenticationPrincipal User user) {
        List<ChatSessionResponse> sessions = geminiService.getUserSessions(user.getId());
        return ResponseEntity.ok(ApiResponse.success(sessions, "User chat sessions retrieved"));
    }

    @PostMapping("/chat/sessions")
    @Operation(summary = "Create a new chat conversation session")
    public ResponseEntity<ApiResponse<ChatSessionResponse>> createSession(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) String title) {
        ChatSessionResponse session = geminiService.createSession(user.getId(), title);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(session, "Chat session created"));
    }

    @GetMapping("/chat/sessions/{id}/messages")
    @Operation(summary = "Get historical messages for a chat session")
    public ResponseEntity<ApiResponse<List<ChatMessageResponse>>> getSessionMessages(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        List<ChatMessageResponse> messages = geminiService.getSessionMessages(user.getId(), id);
        return ResponseEntity.ok(ApiResponse.success(messages, "Session messages retrieved"));
    }

    @DeleteMapping("/chat/sessions/{id}")
    @Operation(summary = "Delete a chat session and its message history")
    public ResponseEntity<ApiResponse<Void>> deleteSession(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        geminiService.deleteSession(user.getId(), id);
        return ResponseEntity.ok(ApiResponse.success(null, "Chat session deleted"));
    }

    @PostMapping("/indoor-plan")
    @Operation(summary = "Generate an AI indoor clean air plan based on latest home assessment")
    public ResponseEntity<ApiResponse<String>> generateIndoorPlan(
            @AuthenticationPrincipal User user) {
        String plan = geminiService.generateIndoorPlanAI(user.getId());
        return ResponseEntity.ok(ApiResponse.success(plan, "AI indoor plan generated"));
    }

    @PostMapping("/family-recommendations")
    @Operation(summary = "Generate an AI family protection plan based on members and AQI")
    public ResponseEntity<ApiResponse<String>> generateFamilyPlan(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false, defaultValue = "285") Integer aqi) {
        String plan = geminiService.generateFamilyRecommendationsAI(user.getId(), aqi);
        return ResponseEntity.ok(ApiResponse.success(plan, "AI family plan generated"));
    }

    @GetMapping("/explain")
    @Operation(summary = "Get detailed explanation, sources, and precautions for an air quality term")
    public ResponseEntity<ApiResponse<AqiExplanationResponse>> explainTerm(
            @RequestParam(defaultValue = "PM2.5") String term) {
        AqiExplanationResponse explanation = geminiService.explainAqiTerm(term);
        return ResponseEntity.ok(ApiResponse.success(explanation, "AQI term explanation retrieved"));
    }
}
