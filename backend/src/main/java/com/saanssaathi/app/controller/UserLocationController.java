package com.saanssaathi.app.controller;

import com.saanssaathi.app.common.ApiResponse;
import com.saanssaathi.app.model.dto.request.UserLocationRequest;
import com.saanssaathi.app.model.entity.User;
import com.saanssaathi.app.model.entity.UserLocation;
import com.saanssaathi.app.repository.CityRepository;
import com.saanssaathi.app.repository.UserLocationRepository;
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
@RequestMapping("/api/locations")
@RequiredArgsConstructor
@Tag(name = "Saved Locations", description = "User home, office, and school location pins")
public class UserLocationController {

    private final UserLocationRepository locationRepository;
    private final CityRepository cityRepository;

    @GetMapping
    @Operation(summary = "List all saved locations for user")
    public ResponseEntity<ApiResponse<List<UserLocation>>> getLocations(@AuthenticationPrincipal User user) {
        List<UserLocation> locations = locationRepository.findByUserId(user.getId());
        return ResponseEntity.ok(ApiResponse.success(locations, "Locations retrieved"));
    }

    @PostMapping
    @Operation(summary = "Save a new location pin")
    public ResponseEntity<ApiResponse<UserLocation>> addLocation(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UserLocationRequest request) {

        UserLocation location = UserLocation.builder()
                .user(user)
                .name(request.getName())
                .areaName(request.getAreaName())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .isPrimary(request.isPrimary())
                .city(request.getCityId() != null ? cityRepository.findById(request.getCityId()).orElse(null) : null)
                .build();

        UserLocation saved = locationRepository.save(location);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(saved, "Location saved"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete saved location")
    public ResponseEntity<ApiResponse<Void>> deleteLocation(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        locationRepository.findById(id)
                .filter(loc -> loc.getUser().getId().equals(user.getId()))
                .ifPresent(locationRepository::delete);
        return ResponseEntity.ok(ApiResponse.success(null, "Location removed"));
    }
}
