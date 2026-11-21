package com.saanssaathi.app;

import com.saanssaathi.app.model.dto.request.IndoorAssessmentRequest;
import com.saanssaathi.app.model.dto.response.CleanAirRoomGuideDTO;
import com.saanssaathi.app.model.dto.response.DiyAirPurifierGuideDTO;
import com.saanssaathi.app.model.dto.response.IndoorAssessmentResponse;
import com.saanssaathi.app.model.dto.response.IndoorRecommendationDTO;
import com.saanssaathi.app.model.entity.IndoorAssessment;
import com.saanssaathi.app.model.entity.User;
import com.saanssaathi.app.repository.IndoorAssessmentRepository;
import com.saanssaathi.app.repository.UserRepository;
import com.saanssaathi.app.service.impl.IndoorAirServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class IndoorAirServiceTest {

    @Mock
    private IndoorAssessmentRepository assessmentRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private IndoorAirServiceImpl indoorAirService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .email("family@saanssaathi.in")
                .fullName("Priya Sharma")
                .build();
    }

    @Test
    @DisplayName("Should save assessment and flag critical risks for biomass and mosquito coils")
    void testSaveAssessment_HighRiskScenario() {
        IndoorAssessmentRequest request = IndoorAssessmentRequest.builder()
                .roomCount(3)
                .windowCount(5)
                .floorNumber(2)
                .totalFloors(4)
                .hasAirPurifier(false)
                .hasExhaustFan(false)
                .hasChimney(false)
                .cookingFuel("BIOMASS")
                .usesIncense(true)
                .usesMosquitoCoil(true)
                .hasSmokingMember(false)
                .budgetRupees(1000)
                .hasChildren(true)
                .hasSeniors(true)
                .additionalNotes("Smog enters through living room balcony")
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(assessmentRepository.save(any(IndoorAssessment.class))).thenAnswer(invocation -> {
            IndoorAssessment a = invocation.getArgument(0);
            a.setId(10L);
            return a;
        });

        IndoorAssessmentResponse response = indoorAirService.saveAssessment(1L, request);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(10L);
        assertThat(response.getRiskLevel()).isEqualTo("CRITICAL");
        assertThat(response.getEstimatedIndoorAqiScore()).isGreaterThanOrEqualTo(70);

        List<IndoorRecommendationDTO> recs = response.getRecommendations();
        assertThat(recs).isNotEmpty();

        // Must recommend stopping mosquito coils
        boolean hasCoilRec = recs.stream().anyMatch(r -> r.getTitle().contains("Mosquito Coils"));
        assertThat(hasCoilRec).isTrue();

        // Must recommend stopping incense
        boolean hasIncenseRec = recs.stream().anyMatch(r -> r.getTitle().contains("Agarbatti"));
        assertThat(hasIncenseRec).isTrue();

        // Must recommend biomass transition
        boolean hasBiomassRec = recs.stream().anyMatch(r -> r.getTitle().contains("Biomass"));
        assertThat(hasBiomassRec).isTrue();

        // With low budget, must recommend DIY filter
        boolean hasDiyRec = recs.stream().anyMatch(r -> r.getTitle().contains("DIY Box Fan"));
        assertThat(hasDiyRec).isTrue();
    }

    @Test
    @DisplayName("Should return Clean Air Room guide with steps and sizing table")
    void testGetCleanAirRoomGuide() {
        CleanAirRoomGuideDTO guide = indoorAirService.getCleanAirRoomGuide();

        assertThat(guide).isNotNull();
        assertThat(guide.getTitle()).contains("Clean Air Room");
        assertThat(guide.getSetupSteps()).hasSizeGreaterThanOrEqualTo(5);
        assertThat(guide.getSizingTable()).isNotEmpty();
        assertThat(guide.getDoItems()).isNotEmpty();
        assertThat(guide.getDontItems()).isNotEmpty();
    }

    @Test
    @DisplayName("Should return EPA DIY Air Purifier guide with materials and steps")
    void testGetDIYAirPurifierGuide() {
        DiyAirPurifierGuideDTO guide = indoorAirService.getDIYAirPurifierGuide();

        assertThat(guide).isNotNull();
        assertThat(guide.getTitle()).contains("DIY Box Fan Air Filter");
        assertThat(guide.getMaterials()).hasSizeGreaterThanOrEqualTo(3);
        assertThat(guide.getSteps()).hasSizeGreaterThanOrEqualTo(4);
        assertThat(guide.getSafetyPrecautions()).isNotEmpty();
        assertThat(guide.getOfficialCitation()).contains("EPA");
    }
}
