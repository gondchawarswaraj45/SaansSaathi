package com.saanssaathi.app.service;

import com.saanssaathi.app.model.dto.request.IndoorAssessmentRequest;
import com.saanssaathi.app.model.dto.response.CleanAirRoomGuideDTO;
import com.saanssaathi.app.model.dto.response.DiyAirPurifierGuideDTO;
import com.saanssaathi.app.model.dto.response.IndoorAssessmentResponse;
import com.saanssaathi.app.model.dto.response.IndoorRecommendationDTO;

import java.util.List;

public interface IndoorAirService {

    IndoorAssessmentResponse saveAssessment(Long userId, IndoorAssessmentRequest request);

    IndoorAssessmentResponse getLatestAssessment(Long userId);

    List<IndoorRecommendationDTO> getRecommendations(Long userId);

    CleanAirRoomGuideDTO getCleanAirRoomGuide();

    DiyAirPurifierGuideDTO getDIYAirPurifierGuide();
}
