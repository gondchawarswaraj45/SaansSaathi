package com.saanssaathi.app;

import com.saanssaathi.app.common.ApiResponse;
import com.saanssaathi.app.controller.MapDataController;
import com.saanssaathi.app.model.dto.response.MapPopupDTO;
import com.saanssaathi.app.model.dto.response.MapStationDTO;
import com.saanssaathi.app.model.entity.AqiReading;
import com.saanssaathi.app.model.entity.MonitoringStation;
import com.saanssaathi.app.repository.AqiReadingRepository;
import com.saanssaathi.app.repository.MonitoringStationRepository;
import com.saanssaathi.app.service.AqiCalculationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MapDataControllerTest {

    @Mock
    private MonitoringStationRepository stationRepository;

    @Mock
    private AqiReadingRepository aqiReadingRepository;

    @Mock
    private AqiCalculationService aqiCalculationService;

    @InjectMocks
    private MapDataController mapDataController;

    private MonitoringStation sampleStation;

    @BeforeEach
    void setUp() {
        sampleStation = MonitoringStation.builder()
                .id(1L)
                .name("Anand Vihar, Delhi")
                .areaName("Anand Vihar ISBT")
                .latitude(28.6476)
                .longitude(77.3158)
                .provider("DPCC")
                .isActive(true)
                .build();
    }

    @Test
    @DisplayName("Should return monitoring stations with CPCB colors and coordinates")
    void testGetStations() {
        when(stationRepository.findByIsActiveTrue()).thenReturn(List.of(sampleStation));
        when(aqiReadingRepository.findTopByStationIdOrderByMeasuredAtDesc(1L)).thenReturn(Optional.empty());
        when(aqiCalculationService.getCategory(anyInt())).thenReturn(AqiReading.Category.POOR);

        ResponseEntity<ApiResponse<List<MapStationDTO>>> response = mapDataController.getStations(null, null);

        assertThat(response).isNotNull();
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().isSuccess()).isTrue();

        List<MapStationDTO> stations = response.getBody().getData();
        assertThat(stations).hasSize(1);
        assertThat(stations.get(0).getName()).isEqualTo("Anand Vihar, Delhi");
        assertThat(stations.get(0).getLatitude()).isEqualTo(28.6476);
        assertThat(stations.get(0).getColorHex()).isNotNull();
    }

    @Test
    @DisplayName("Should return station popup telemetry with pollutants and advisory")
    void testGetStationPopup() {
        when(stationRepository.findById(1L)).thenReturn(Optional.of(sampleStation));
        when(aqiCalculationService.getCategory(anyInt())).thenReturn(AqiReading.Category.VERY_POOR);

        ResponseEntity<ApiResponse<MapPopupDTO>> response = mapDataController.getStationPopup(1L);

        assertThat(response).isNotNull();
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().isSuccess()).isTrue();

        MapPopupDTO popup = response.getBody().getData();
        assertThat(popup.getStationName()).isEqualTo("Anand Vihar, Delhi");
        assertThat(popup.getPollutants()).containsKey("PM2.5");
        assertThat(popup.getPollutants()).containsKey("PM10");
        assertThat(popup.getHealthAdvisory()).isNotBlank();
    }
}
