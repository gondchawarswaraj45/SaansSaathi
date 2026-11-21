package com.saanssaathi.app.service.impl;

import com.saanssaathi.app.exception.ResourceNotFoundException;
import com.saanssaathi.app.model.dto.request.ChatMessageRequest;
import com.saanssaathi.app.model.dto.response.AqiExplanationResponse;
import com.saanssaathi.app.model.dto.response.ChatMessageResponse;
import com.saanssaathi.app.model.dto.response.ChatSessionResponse;
import com.saanssaathi.app.model.entity.*;
import com.saanssaathi.app.repository.*;
import com.saanssaathi.app.service.GeminiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class GeminiServiceImpl implements GeminiService {

    private final ChatSessionRepository sessionRepository;
    private final ChatMessageRepository messageRepository;
    private final UserRepository userRepository;
    private final FamilyMemberRepository familyMemberRepository;
    private final FamilyGroupRepository familyGroupRepository;
    private final IndoorAssessmentRepository assessmentRepository;

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    @Value("${gemini.api.model:gemini-1.5-flash}")
    private String geminiModel;

    private static final String MEDICAL_DISCLAIMER =
            "⚠️ Medical Disclaimer: For air quality awareness and precautionary guidance only. Not medical advice. Never alter prescribed respiratory or cardiac medications without consulting a qualified physician.";

    private final RestClient restClient = RestClient.create();

    @Override
    @Transactional
    public ChatMessageResponse chat(Long userId, ChatMessageRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Get or create session
        ChatSession session;
        if (request.getSessionId() != null) {
            session = sessionRepository.findByIdAndUserId(request.getSessionId(), userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Chat session not found with id: " + request.getSessionId()));
        } else {
            String title = generateSessionTitle(request.getMessage());
            session = sessionRepository.save(ChatSession.builder()
                    .user(user)
                    .title(title)
                    .build());
        }

        // Save USER message
        ChatMessage userMsg = ChatMessage.builder()
                .session(session)
                .role(ChatMessage.MessageRole.USER)
                .content(request.getMessage())
                .build();
        messageRepository.save(userMsg);

        // Build context from family profiles & home assessment
        String context = buildUserContext(userId, request.getCurrentAqi(), request.getCity());

        // Generate response with Gemini API or intelligent expert fallback
        String aiReply = callGeminiOrFallback(request.getMessage(), context);

        // Ensure disclaimer is appended if missing
        if (!aiReply.contains("Disclaimer")) {
            aiReply = aiReply + "\n\n" + MEDICAL_DISCLAIMER;
        }

        // Save ASSISTANT message
        ChatMessage assistantMsg = ChatMessage.builder()
                .session(session)
                .role(ChatMessage.MessageRole.ASSISTANT)
                .content(aiReply)
                .tokensUsed(aiReply.length() / 4)
                .build();
        ChatMessage savedAssistantMsg = messageRepository.save(assistantMsg);

        // Update session lastActive
        session.setLastActive(LocalDateTime.now());
        sessionRepository.save(session);

        return ChatMessageResponse.builder()
                .id(savedAssistantMsg.getId())
                .sessionId(session.getId())
                .role("ASSISTANT")
                .content(savedAssistantMsg.getContent())
                .disclaimer(MEDICAL_DISCLAIMER)
                .createdAt(savedAssistantMsg.getCreatedAt())
                .build();
    }

    @Override
    @Transactional
    public ChatSessionResponse createSession(Long userId, String title) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        ChatSession session = sessionRepository.save(ChatSession.builder()
                .user(user)
                .title(title != null && !title.isBlank() ? title : "New Air Quality Chat")
                .build());

        return mapToSessionResponse(session);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChatSessionResponse> getUserSessions(Long userId) {
        return sessionRepository.findByUserIdOrderByLastActiveDesc(userId).stream()
                .map(this::mapToSessionResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChatMessageResponse> getSessionMessages(Long userId, Long sessionId) {
        sessionRepository.findByIdAndUserId(sessionId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Chat session not found with id: " + sessionId));

        return messageRepository.findBySessionIdOrderByCreatedAtAsc(sessionId).stream()
                .map(m -> ChatMessageResponse.builder()
                        .id(m.getId())
                        .sessionId(sessionId)
                        .role(m.getRole().name())
                        .content(m.getContent())
                        .disclaimer(MEDICAL_DISCLAIMER)
                        .createdAt(m.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteSession(Long userId, Long sessionId) {
        ChatSession session = sessionRepository.findByIdAndUserId(sessionId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Chat session not found with id: " + sessionId));
        sessionRepository.delete(session);
    }

    @Override
    public String generateIndoorPlanAI(Long userId) {
        Optional<IndoorAssessment> assessOpt = assessmentRepository.findTopByUserIdOrderByCreatedAtDesc(userId);
        if (assessOpt.isEmpty()) {
            return "Please complete the Home Assessment first so SaansSaathi AI can evaluate your specific ventilation layout and cooking emission sources.";
        }
        IndoorAssessment a = assessOpt.get();
        String prompt = String.format("Generate a customized 4-step indoor air purification and source control protocol for a home with %d rooms, %d windows, cooking fuel %s, air purifier: %s, exhaust fan: %s, incense: %s, mosquito coil: %s, budget: ₹%d.",
                a.getRoomCount(), a.getWindowCount(), a.getCookingFuel(), a.getHasAirPurifier(), a.getHasExhaustFan(), a.getUsesIncense(), a.getUsesMosquitoCoil(), a.getBudgetRupees());
        return callGeminiOrFallback(prompt, "System: Indian indoor air quality specialist. Grounded in CPCB & EPA science.");
    }

    @Override
    public String generateFamilyRecommendationsAI(Long userId, Integer aqi) {
        int targetAqi = aqi != null ? aqi : 285;
        String context = buildUserContext(userId, targetAqi, null);
        String prompt = "Generate a comprehensive family air defense strategy for today's AQI: " + targetAqi + ". Include specific rules for kids, elderly members, and working commuters.";
        return callGeminiOrFallback(prompt, context);
    }

    @Override
    public AqiExplanationResponse explainAqiTerm(String term) {
        if (term == null || term.isBlank()) {
            term = "PM2.5";
        }
        String cleanTerm = term.trim().toUpperCase();

        switch (cleanTerm) {
            case "PM2.5":
            case "PM25":
                return AqiExplanationResponse.builder()
                        .term("PM2.5")
                        .fullName("Fine Particulate Matter (Aerodynamic diameter ≤ 2.5 micrometers)")
                        .meaning("Microscopic combustion particles 30 times thinner than a human hair that remain airborne indefinitely and penetrate deep into alveoli and the bloodstream.")
                        .primarySources("Vehicular exhaust, biomass/stubble burning, industrial combustion, coal-fired power plants, and secondary aerosol chemistry.")
                        .healthImpact("Triggers systemic vascular inflammation, asthma attacks, stroke, and reduced lung capacity. High winter spikes correlate with elevated emergency room admissions.")
                        .safeThreshold("CPCB 24-hr standard: 60 µg/m³. WHO 24-hr guideline: 15 µg/m³.")
                        .protectionActions(List.of(
                                "Wear snug-fitting N95/FFP2 respirator when outdoor AQI > 200",
                                "Run True HEPA air purifier in sealed bedroom",
                                "Avoid outdoor exercise during 6 AM – 9 AM temperature inversion"
                        ))
                        .scientificCitation("WHO Global Air Quality Guidelines (2021) & Lancet Commission on Pollution and Health")
                        .build();

            case "PM10":
                return AqiExplanationResponse.builder()
                        .term("PM10")
                        .fullName("Respirable Particulate Matter (Diameter ≤ 10 micrometers)")
                        .meaning("Coarser inhalable dust particles that enter through the nasal passage and settle in the upper trachea and bronchi.")
                        .primarySources("Road dust resuspension, construction activities, desert winds, and agricultural tilling.")
                        .healthImpact("Causes nasal congestion, severe throat irritation, persistent dry cough, and exacerbates bronchitis.")
                        .safeThreshold("CPCB 24-hr standard: 100 µg/m³. WHO 24-hr guideline: 45 µg/m³.")
                        .protectionActions(List.of(
                                "Wet mop (pocha) indoor floors daily instead of dry sweeping (jhadu)",
                                "Install window nylon mesh to block windblown street dust",
                                "Wash face and gargle with lukewarm saline water after returning from outdoors"
                        ))
                        .scientificCitation("CPCB National Ambient Air Quality Standards & US EPA Particulate Matter Criteria")
                        .build();

            case "TEMPERATURE_INVERSION":
            case "INVERSION":
                return AqiExplanationResponse.builder()
                        .term("Temperature Inversion")
                        .fullName("Winter Atmospheric Boundary Layer Inversion")
                        .meaning("A meteorological phenomenon where a layer of cold air gets trapped at the ground beneath a warmer layer of air, acting like an airtight lid that traps urban emissions.")
                        .primarySources("Radiational nocturnal surface cooling, low wind velocities (< 1.5 m/s), and calm anticyclonic winter weather.")
                        .healthImpact("Causes severe multi-day smog episodes across the Indo-Gangetic Plains where PM2.5 concentrations escalate past 400 µg/m³ despite steady emission volumes.")
                        .safeThreshold("Normal daytime vertical mixing restores after 11:30 AM as sunlight warms the ground layer.")
                        .protectionActions(List.of(
                                "Keep doors and windows sealed from 6:00 AM to 10:00 AM",
                                "Ventilate indoor living areas strictly between 1:00 PM and 3:30 PM",
                                "Postpone early morning outdoor workouts to afternoon hours"
                        ))
                        .scientificCitation("India Meteorological Department (IMD) Winter Smog Atmospheric Profiling")
                        .build();

            default:
                return AqiExplanationResponse.builder()
                        .term(term)
                        .fullName("Air Quality Metric: " + term)
                        .meaning("An atmospheric parameter monitored under India's Central Pollution Control Board (CPCB) National Air Quality Index framework.")
                        .primarySources("Urban industrial and transportation activities.")
                        .healthImpact("Excess exposure can irritate respiratory airways and weaken immune responses.")
                        .safeThreshold("Follow CPCB 0-50 (Good) to 401-500 (Severe) safety advisories.")
                        .protectionActions(List.of(
                                "Monitor real-time station AQI before outdoor activities",
                                "Use N95 mask during high-smog periods",
                                "Maintain clean indoor air room"
                        ))
                        .scientificCitation("CPCB National Air Quality Index Document (2014)")
                        .build();
        }
    }

    private String buildUserContext(Long userId, Integer aqi, String city) {
        StringBuilder sb = new StringBuilder();
        sb.append("Current Location AQI Context: ");
        sb.append(aqi != null ? aqi : 285).append(" (Indian CPCB Scale). ");
        if (city != null && !city.isBlank()) {
            sb.append("City: ").append(city).append(". ");
        }

        // Family members
        try {
            Optional<FamilyGroup> group = familyGroupRepository.findByUserId(userId);
            if (group.isPresent()) {
                List<FamilyMember> members = familyMemberRepository.findByFamilyGroupIdAndIsActiveTrue(group.get().getId());
                if (!members.isEmpty()) {
                    sb.append("Family Members: ");
                    for (FamilyMember m : members) {
                        sb.append(String.format("[%s, AgeGroup: %s, Sensitivity: %s, OutdoorHours: %dh]; ",
                                m.getName(), m.getAgeGroup(), m.getSensitiveCategory(), m.getDailyOutdoorHours()));
                    }
                }
            }
        } catch (Exception e) {
            log.debug("No family info found: {}", e.getMessage());
        }

        // Home assessment
        try {
            assessmentRepository.findTopByUserIdOrderByCreatedAtDesc(userId).ifPresent(a -> {
                sb.append(String.format("Home: %d rooms, Purifier: %s, Exhaust: %s, Fuel: %s, Incense: %s, Budget: ₹%d.",
                        a.getRoomCount(), a.getHasAirPurifier(), a.getHasExhaustFan(), a.getCookingFuel(), a.getUsesIncense(), a.getBudgetRupees()));
            });
        } catch (Exception e) {
            log.debug("No assessment info found: {}", e.getMessage());
        }

        return sb.toString();
    }

    private String callGeminiOrFallback(String prompt, String context) {
        if (geminiApiKey != null && !geminiApiKey.isBlank() && !geminiApiKey.equalsIgnoreCase("your_gemini_api_key_here")) {
            try {
                String systemInstruction = "You are SaansSaathi AI – an expert Urban Air Quality & Family Health Protection Companion specializing in Indian winter smog and domestic air quality.\n" +
                        "CRITICAL MEDICAL GUARDRAILS:\n" +
                        "1. Do not diagnose medical conditions or alter prescribed medications.\n" +
                        "2. Urge clinical consultation for acute breathlessness or chest pain.\n" +
                        "3. Do not invent fake sensor numbers. Ground recommendations in CPCB guidance.\n" +
                        "4. Context: " + context;

                Map<String, Object> requestBody = Map.of(
                        "contents", List.of(
                                Map.of(
                                        "role", "user",
                                        "parts", List.of(Map.of("text", prompt))
                                )
                        ),
                        "systemInstruction", Map.of(
                                "parts", List.of(Map.of("text", systemInstruction))
                        ),
                        "generationConfig", Map.of(
                                "temperature", 0.4,
                                "maxOutputTokens", 1024
                        )
                );

                String url = String.format("https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s",
                        geminiModel, geminiApiKey);

                Map response = restClient.post()
                        .uri(url)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(requestBody)
                        .retrieve()
                        .body(Map.class);

                if (response != null && response.containsKey("candidates")) {
                    List candidates = (List) response.get("candidates");
                    if (!candidates.isEmpty()) {
                        Map firstCand = (Map) candidates.get(0);
                        Map content = (Map) firstCand.get("content");
                        if (content != null && content.containsKey("parts")) {
                            List parts = (List) content.get("parts");
                            if (!parts.isEmpty()) {
                                Map firstPart = (Map) parts.get(0);
                                String text = (String) firstPart.get("text");
                                if (text != null && !text.isBlank()) {
                                    return text;
                                }
                            }
                        }
                    }
                }
            } catch (Exception e) {
                log.warn("Gemini API call failed or timed out: {}. Using expert fallback generator.", e.getMessage());
            }
        }

        // Resilient Expert NLP Fallback Generator
        return generateExpertFallback(prompt, context);
    }

    private String generateExpertFallback(String prompt, String context) {
        String lower = prompt.toLowerCase();

        if (lower.contains("run") || lower.contains("jog") || lower.contains("exercise") || lower.contains("workout")) {
            return "🏃 **Outdoor Exercise Advisory during Smog:**\n\n" +
                    "• **Current Risk Assessment:** When outdoor AQI exceeds 200 (Poor to Severe), vigorous aerobic exercise increases your inhalation rate up to 10–12×, forcing toxic PM2.5 and ultrafine soot deep into alveolar lung tissues.\n" +
                    "• **Recommendation:** Postpone early morning (06:00–09:30 AM) outdoor jogs or football sessions. During this period, ground-level radiation temperature inversion traps emissions beneath cold stagnant air.\n" +
                    "• **Alternative:** Exercise indoors in a sealed room using yoga, bodyweight calisthenics, or stationary cycling, ideally with a HEPA air purifier operating.\n" +
                    "• **If outdoors is unavoidable:** Shift workouts to midday (1:00 PM – 3:30 PM) when solar warming dissipates ground smog, and wear a snugly fitted N95 respirator.\n\n" +
                    MEDICAL_DISCLAIMER;
        }

        if (lower.contains("school") || lower.contains("child") || lower.contains("kid")) {
            return "🧒 **Child & School Protection Strategy:**\n\n" +
                    "• **Physiological Vulnerability:** Children breathe more air per kilogram of body weight than adults and their developing lungs are highly vulnerable to particulate damage.\n" +
                    "• **School Commute:** Ensure children wear an age-appropriate, certified N95 or KF94 respirator with an airtight nasal clip during the morning school bus or auto commute.\n" +
                    "• **Outdoor Play:** Advise schools to suspend outdoor morning assembly and outdoor PT/sports sessions when AQI > 300, replacing them with indoor library or classroom activities.\n" +
                    "• **Hydration & Care:** Encourage warm water hydration and monitor for persistent dry coughs or eye watering.\n\n" +
                    MEDICAL_DISCLAIMER;
        }

        if (lower.contains("window") || lower.contains("ventilate") || lower.contains("air out")) {
            return "🪟 **Window Opening & Inversion Timing Guide:**\n\n" +
                    "• **Morning Hazard (06:00 AM – 10:00 AM):** Keep all exterior windows, balcony sliders, and ventilators firmly closed. Cold nocturnal air traps heavy vehicular soot and biomass smoke near the ground.\n" +
                    "• **Optimal Midday Window (01:00 PM – 03:30 PM):** This is the safest window for 20-30 minutes of cross-ventilation. Sunlight breaks down the inversion lid, allowing vertical mixing and lowering ambient particle density.\n" +
                    "• **Evening Lockdown (After 05:00 PM):** Latch all windows before sunset as ground temperature cools and smog builds up again.\n\n" +
                    MEDICAL_DISCLAIMER;
        }

        if (lower.contains("indoor") || lower.contains("purifier") || lower.contains("agarbatti") || lower.contains("coil")) {
            return "🏡 **Indoor Air Protection Protocols:**\n\n" +
                    "• **Source Control:** Discontinue burning agarbatti, dhoop, and chemical mosquito coils indoors. One incense stick generates as much fine particulate matter as 3–5 cigarettes.\n" +
                    "• **Kitchen Protocol:** Keep kitchen doors shut while cooking tadka or deep frying. Run kitchen exhaust fans during cooking and for at least 15 minutes afterward.\n" +
                    "• **Clean Air Room:** Designate the bedroom as your sanctuary. Seal bottom door undercuts with a rolled damp towel or foam sweep.\n" +
                    "• **Filtration:** Deploy a True HEPA H13 purifier or assemble an EPA-studied DIY Box Fan filter (MERV-13 filter strapped to a 20\" box fan for ~₹1,200).\n\n" +
                    MEDICAL_DISCLAIMER;
        }

        // Generic comprehensive response
        return "🌬️ **SaansSaathi Urban Air Protection Plan:**\n\n" +
                "Based on your profile and current urban smog conditions, here are the three highest-impact steps to safeguard your household:\n\n" +
                "1. **Exposure Mitigation:** Avoid non-essential outdoor commuting between 6:00 AM and 10:00 AM. When stepping outside, always wear a certified N95 respirator.\n" +
                "2. **Indoor Sanctuary:** Create a Clean Air Room in your primary bedroom by blocking door gap drafts and running continuous filtration.\n" +
                "3. **Zero Combustion Indoors:** Stop incense sticks and mosquito coils inside closed bedrooms. Use damp mopping (pocha) instead of dry brooms to avoid kicking up settled heavy metal dust.\n\n" +
                MEDICAL_DISCLAIMER;
    }

    private String generateSessionTitle(String firstMessage) {
        if (firstMessage == null || firstMessage.isBlank()) {
            return "Air Quality Consultation";
        }
        String clean = firstMessage.replaceAll("[^a-zA-Z0-9 ]", "").trim();
        if (clean.length() > 35) {
            clean = clean.substring(0, 35) + "...";
        }
        return clean.isEmpty() ? "Air Quality Chat" : clean;
    }

    private ChatSessionResponse mapToSessionResponse(ChatSession session) {
        return ChatSessionResponse.builder()
                .id(session.getId())
                .title(session.getTitle())
                .createdAt(session.getCreatedAt())
                .lastActive(session.getLastActive())
                .messageCount(session.getMessages() != null ? session.getMessages().size() : 0)
                .build();
    }
}
