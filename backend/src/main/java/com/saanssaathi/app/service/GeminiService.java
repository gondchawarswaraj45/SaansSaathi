package com.saanssaathi.app.service;

import com.saanssaathi.app.model.dto.request.ChatMessageRequest;
import com.saanssaathi.app.model.dto.response.AqiExplanationResponse;
import com.saanssaathi.app.model.dto.response.ChatMessageResponse;
import com.saanssaathi.app.model.dto.response.ChatSessionResponse;

import java.util.List;

public interface GeminiService {

    ChatMessageResponse chat(Long userId, ChatMessageRequest request);

    ChatSessionResponse createSession(Long userId, String title);

    List<ChatSessionResponse> getUserSessions(Long userId);

    List<ChatMessageResponse> getSessionMessages(Long userId, Long sessionId);

    void deleteSession(Long userId, Long sessionId);

    String generateIndoorPlanAI(Long userId);

    String generateFamilyRecommendationsAI(Long userId, Integer aqi);

    AqiExplanationResponse explainAqiTerm(String term);
}
