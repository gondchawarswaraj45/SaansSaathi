package com.saanssaathi.app.controller;

import com.saanssaathi.app.common.ApiResponse;
import com.saanssaathi.app.model.dto.request.IndoorAssessmentRequest;
import com.saanssaathi.app.model.dto.response.CleanAirRoomGuideDTO;
import com.saanssaathi.app.model.dto.response.DiyAirPurifierGuideDTO;
import com.saanssaathi.app.model.dto.response.IndoorAssessmentResponse;
import com.saanssaathi.app.model.dto.response.IndoorRecommendationDTO;
import com.saanssaathi.app.model.entity.User;
import com.saanssaathi.app.service.IndoorAirService;
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
@RequestMapping("/api/indoor")
@RequiredArgsConstructor
@Tag(name = "Indoor Air Quality Assistant", description = "Home assessments, indoor source control, Clean Air Room protocols, and DIY purifiers")
public class IndoorController {

    private final IndoorAirService indoorAirService;

    @PostMapping("/assessment")
    @Operation(summary = "Save home assessment and calculate tailored indoor protocol")
    public ResponseEntity<ApiResponse<IndoorAssessmentResponse>> saveAssessment(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody IndoorAssessmentRequest request) {
        IndoorAssessmentResponse response = indoorAirService.saveAssessment(user.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Indoor assessment saved and protocol generated"));
    }

    @GetMapping("/assessment")
    @Operation(summary = "Get latest home assessment for logged-in user")
    public ResponseEntity<ApiResponse<IndoorAssessmentResponse>> getLatestAssessment(
            @AuthenticationPrincipal User user) {
        Long userId = user != null ? user.getId() : null;
        IndoorAssessmentResponse response = indoorAirService.getLatestAssessment(userId);
        return ResponseEntity.ok(ApiResponse.success(response, "Latest indoor assessment retrieved"));
    }

    @GetMapping("/recommendations")
    @Operation(summary = "Get actionable indoor recommendations based on assessment")
    public ResponseEntity<ApiResponse<List<IndoorRecommendationDTO>>> getRecommendations(
            @AuthenticationPrincipal User user) {
        Long userId = user != null ? user.getId() : null;
        List<IndoorRecommendationDTO> recommendations = indoorAirService.getRecommendations(userId);
        return ResponseEntity.ok(ApiResponse.success(recommendations, "Indoor recommendations retrieved"));
    }

    @GetMapping("/clean-air-room")
    @Operation(summary = "Get EPA & NCDC Clean Air Room blueprint and sizing guide")
    public ResponseEntity<ApiResponse<CleanAirRoomGuideDTO>> getCleanAirRoomGuide() {
        CleanAirRoomGuideDTO guide = indoorAirService.getCleanAirRoomGuide();
        return ResponseEntity.ok(ApiResponse.success(guide, "Clean Air Room blueprint retrieved"));
    }

    @GetMapping("/diy-purifier-guide")
    @Operation(summary = "Get EPA-evaluated DIY box fan air cleaner assembly guide")
    public ResponseEntity<ApiResponse<DiyAirPurifierGuideDTO>> getDIYAirPurifierGuide() {
        DiyAirPurifierGuideDTO guide = indoorAirService.getDIYAirPurifierGuide();
        return ResponseEntity.ok(ApiResponse.success(guide, "DIY air cleaner guide retrieved"));
    }
}
