package com.saanssaathi.app.controller;

import com.saanssaathi.app.common.ApiResponse;
import com.saanssaathi.app.model.dto.request.FamilyMemberRequest;
import com.saanssaathi.app.model.dto.response.FamilyMemberResponse;
import com.saanssaathi.app.model.dto.response.FamilyProtectionPlanResponse;
import com.saanssaathi.app.model.entity.FamilyGroup;
import com.saanssaathi.app.model.entity.User;
import com.saanssaathi.app.service.FamilyService;
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
@RequestMapping("/api/family")
@RequiredArgsConstructor
@Tag(name = "Family Management & Protection", description = "Profiles for children, seniors, asthmatics and rule-based recommendations")
public class FamilyController {

    private final FamilyService familyService;

    @GetMapping
    @Operation(summary = "Get user's family group")
    public ResponseEntity<ApiResponse<FamilyGroup>> getFamilyGroup(@AuthenticationPrincipal User user) {
        FamilyGroup group = familyService.getOrCreateFamilyGroup(user, null);
        return ResponseEntity.ok(ApiResponse.success(group, "Family group retrieved"));
    }

    @PostMapping
    @Operation(summary = "Create or update family group name")
    public ResponseEntity<ApiResponse<FamilyGroup>> createFamilyGroup(
            @AuthenticationPrincipal User user,
            @RequestParam String familyName) {
        FamilyGroup group = familyService.getOrCreateFamilyGroup(user, familyName);
        return ResponseEntity.ok(ApiResponse.success(group, "Family group configured"));
    }

    @GetMapping("/members")
    @Operation(summary = "Get list of all family members in group")
    public ResponseEntity<ApiResponse<List<FamilyMemberResponse>>> getMembers(@AuthenticationPrincipal User user) {
        List<FamilyMemberResponse> members = familyService.getMembers(user);
        return ResponseEntity.ok(ApiResponse.success(members, "Family members retrieved"));
    }

    @PostMapping("/members")
    @Operation(summary = "Add a new family member")
    public ResponseEntity<ApiResponse<FamilyMemberResponse>> addMember(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody FamilyMemberRequest request) {
        FamilyMemberResponse member = familyService.addMember(user, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(member, "Family member registered"));
    }

    @PutMapping("/members/{id}")
    @Operation(summary = "Update family member profile")
    public ResponseEntity<ApiResponse<FamilyMemberResponse>> updateMember(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @Valid @RequestBody FamilyMemberRequest request) {
        FamilyMemberResponse member = familyService.updateMember(user, id, request);
        return ResponseEntity.ok(ApiResponse.success(member, "Family member updated"));
    }

    @DeleteMapping("/members/{id}")
    @Operation(summary = "Remove family member")
    public ResponseEntity<ApiResponse<Void>> deleteMember(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        familyService.deleteMember(user, id);
        return ResponseEntity.ok(ApiResponse.success(null, "Family member removed"));
    }

    @GetMapping("/recommendations")
    @Operation(summary = "Get personalized family protection plan", description = "Evaluates vulnerability profiles against current AQI to formulate customized precautions")
    public ResponseEntity<ApiResponse<FamilyProtectionPlanResponse>> getProtectionPlan(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "285") int aqi) {
        FamilyProtectionPlanResponse plan = familyService.getFamilyProtectionPlan(user, aqi);
        return ResponseEntity.ok(ApiResponse.success(plan, "Personalized family plan formulated"));
    }
}
