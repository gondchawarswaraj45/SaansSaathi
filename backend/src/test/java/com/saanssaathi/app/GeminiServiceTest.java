package com.saanssaathi.app;

import com.saanssaathi.app.model.dto.request.ChatMessageRequest;
import com.saanssaathi.app.model.dto.response.AqiExplanationResponse;
import com.saanssaathi.app.model.dto.response.ChatMessageResponse;
import com.saanssaathi.app.model.entity.ChatMessage;
import com.saanssaathi.app.model.entity.ChatSession;
import com.saanssaathi.app.model.entity.User;
import com.saanssaathi.app.repository.*;
import com.saanssaathi.app.service.impl.GeminiServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class GeminiServiceTest {

    @Mock
    private ChatSessionRepository sessionRepository;

    @Mock
    private ChatMessageRepository messageRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private FamilyMemberRepository familyMemberRepository;

    @Mock
    private FamilyGroupRepository familyGroupRepository;

    @Mock
    private IndoorAssessmentRepository assessmentRepository;

    @InjectMocks
    private GeminiServiceImpl geminiService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .email("family@saanssaathi.in")
                .fullName("Sunita Verma")
                .build();
    }

    @Test
    @DisplayName("Should create new chat session and return answer with medical disclaimer")
    void testChat_CreatesSessionAndReturnsReply() {
        ChatMessageRequest request = ChatMessageRequest.builder()
                .message("Is it safe for my 8-year-old child to go to school in this smog?")
                .currentAqi(340)
                .city("Delhi")
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(sessionRepository.save(any(ChatSession.class))).thenAnswer(invocation -> {
            ChatSession s = invocation.getArgument(0);
            s.setId(101L);
            return s;
        });
        when(messageRepository.save(any(ChatMessage.class))).thenAnswer(invocation -> {
            ChatMessage m = invocation.getArgument(0);
            m.setId(501L);
            return m;
        });

        ChatMessageResponse response = geminiService.chat(1L, request);

        assertThat(response).isNotNull();
        assertThat(response.getSessionId()).isEqualTo(101L);
        assertThat(response.getContent()).contains("Child");
        assertThat(response.getContent()).contains("Disclaimer");
        assertThat(response.getDisclaimer()).contains("Medical Disclaimer");
    }

    @Test
    @DisplayName("Should provide inversion and indoor alternatives for running queries")
    void testChat_RunningAdvisory() {
        ChatMessageRequest request = ChatMessageRequest.builder()
                .message("Can I go for an outdoor morning run at 6 AM?")
                .currentAqi(290)
                .city("Faridabad")
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(sessionRepository.save(any(ChatSession.class))).thenAnswer(inv -> {
            ChatSession s = inv.getArgument(0);
            s.setId(102L);
            return s;
        });
        when(messageRepository.save(any(ChatMessage.class))).thenAnswer(inv -> {
            ChatMessage m = inv.getArgument(0);
            m.setId(502L);
            return m;
        });

        ChatMessageResponse response = geminiService.chat(1L, request);

        assertThat(response).isNotNull();
        assertThat(response.getContent()).contains("Outdoor Exercise Advisory");
        assertThat(response.getContent()).contains("temperature inversion");
    }

    @Test
    @DisplayName("Should accurately explain PM2.5 with sources, thresholds, and health impacts")
    void testExplainAqiTerm_PM25() {
        AqiExplanationResponse explanation = geminiService.explainAqiTerm("PM2.5");

        assertThat(explanation).isNotNull();
        assertThat(explanation.getTerm()).isEqualTo("PM2.5");
        assertThat(explanation.getFullName()).contains("Fine Particulate Matter");
        assertThat(explanation.getSafeThreshold()).contains("60 µg/m³");
        assertThat(explanation.getProtectionActions()).isNotEmpty();
        assertThat(explanation.getScientificCitation()).contains("WHO");
    }
}
