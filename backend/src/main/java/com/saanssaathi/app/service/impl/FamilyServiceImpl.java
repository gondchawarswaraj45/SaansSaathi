package com.saanssaathi.app.service.impl;

import com.saanssaathi.app.model.dto.request.FamilyMemberRequest;
import com.saanssaathi.app.model.dto.response.FamilyMemberResponse;
import com.saanssaathi.app.model.dto.response.FamilyProtectionPlanResponse;
import com.saanssaathi.app.model.entity.FamilyGroup;
import com.saanssaathi.app.model.entity.FamilyMember;
import com.saanssaathi.app.model.entity.User;
import com.saanssaathi.app.recommendation.RecommendationEngine;
import com.saanssaathi.app.repository.FamilyGroupRepository;
import com.saanssaathi.app.repository.FamilyMemberRepository;
import com.saanssaathi.app.service.AqiCalculationService;
import com.saanssaathi.app.service.FamilyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FamilyServiceImpl implements FamilyService {

    private final FamilyGroupRepository familyGroupRepository;
    private final FamilyMemberRepository familyMemberRepository;
    private final RecommendationEngine recommendationEngine;
    private final AqiCalculationService aqiCalculationService;

    @Override
    @Transactional
    public FamilyGroup getOrCreateFamilyGroup(User user, String familyName) {
        return familyGroupRepository.findByUser(user)
                .orElseGet(() -> {
                    String name = (familyName != null && !familyName.isBlank())
                            ? familyName : user.getFullName() + "'s Family";
                    FamilyGroup newGroup = FamilyGroup.builder()
                            .user(user)
                            .familyName(name)
                            .build();
                    return familyGroupRepository.save(newGroup);
                });
    }

    @Override
    @Transactional
    public FamilyMemberResponse addMember(User user, FamilyMemberRequest request) {
        FamilyGroup group = getOrCreateFamilyGroup(user, null);

        FamilyMember member = FamilyMember.builder()
                .familyGroup(group)
                .name(request.getName())
                .ageGroup(FamilyMember.AgeGroup.valueOf(request.getAgeGroup().toUpperCase()))
                .birthYear(request.getBirthYear())
                .sensitiveCategory(request.getSensitiveCategory() != null
                        ? FamilyMember.SensitiveCategory.valueOf(request.getSensitiveCategory().toUpperCase())
                        : FamilyMember.SensitiveCategory.NONE)
                .dailyOutdoorHours(request.getDailyOutdoorHours() != null ? request.getDailyOutdoorHours() : 1)
                .workScheduleStart(parseTime(request.getWorkScheduleStart()))
                .workScheduleEnd(parseTime(request.getWorkScheduleEnd()))
                .exercisePreference(request.getExercisePreference() != null
                        ? FamilyMember.ExercisePreference.valueOf(request.getExercisePreference().toUpperCase())
                        : FamilyMember.ExercisePreference.NONE)
                .isActive(true)
                .build();

        FamilyMember saved = familyMemberRepository.save(member);
        return toMemberResponse(saved);
    }

    @Override
    public List<FamilyMemberResponse> getMembers(User user) {
        FamilyGroup group = getOrCreateFamilyGroup(user, null);
        return familyMemberRepository.findByFamilyGroupIdAndIsActiveTrue(group.getId()).stream()
                .map(this::toMemberResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public FamilyMemberResponse updateMember(User user, Long memberId, FamilyMemberRequest request) {
        FamilyGroup group = getOrCreateFamilyGroup(user, null);
        FamilyMember member = familyMemberRepository.findById(memberId)
                .filter(m -> m.getFamilyGroup().getId().equals(group.getId()))
                .orElseThrow(() -> new IllegalArgumentException("Family member not found"));

        member.setName(request.getName());
        member.setAgeGroup(FamilyMember.AgeGroup.valueOf(request.getAgeGroup().toUpperCase()));
        if (request.getBirthYear() != null) member.setBirthYear(request.getBirthYear());
        if (request.getSensitiveCategory() != null) {
            member.setSensitiveCategory(FamilyMember.SensitiveCategory.valueOf(request.getSensitiveCategory().toUpperCase()));
        }
        if (request.getDailyOutdoorHours() != null) member.setDailyOutdoorHours(request.getDailyOutdoorHours());
        if (request.getWorkScheduleStart() != null) member.setWorkScheduleStart(parseTime(request.getWorkScheduleStart()));
        if (request.getWorkScheduleEnd() != null) member.setWorkScheduleEnd(parseTime(request.getWorkScheduleEnd()));
        if (request.getExercisePreference() != null) {
            member.setExercisePreference(FamilyMember.ExercisePreference.valueOf(request.getExercisePreference().toUpperCase()));
        }

        FamilyMember updated = familyMemberRepository.save(member);
        return toMemberResponse(updated);
    }

    @Override
    @Transactional
    public void deleteMember(User user, Long memberId) {
        FamilyGroup group = getOrCreateFamilyGroup(user, null);
        FamilyMember member = familyMemberRepository.findById(memberId)
                .filter(m -> m.getFamilyGroup().getId().equals(group.getId()))
                .orElseThrow(() -> new IllegalArgumentException("Family member not found"));

        member.setActive(false);
        familyMemberRepository.save(member);
    }

    @Override
    public FamilyProtectionPlanResponse getFamilyProtectionPlan(User user, int currentAqi) {
        FamilyGroup group = getOrCreateFamilyGroup(user, null);
        List<FamilyMember> members = familyMemberRepository.findByFamilyGroupIdAndIsActiveTrue(group.getId());

        List<RecommendationEngine.MemberRecommendation> memberPlans = members.stream()
                .map(m -> recommendationEngine.generateRecommendation(m, currentAqi))
                .collect(Collectors.toList());

        String category = aqiCalculationService.getCategory(currentAqi).name();
        String summary = String.format("Current ambient AQI is %d (%s). %d family member plans calibrated.",
                currentAqi, category, members.size());

        return FamilyProtectionPlanResponse.builder()
                .familyGroupId(group.getId())
                .familyName(group.getFamilyName())
                .currentAqi(currentAqi)
                .aqiCategory(category)
                .overallRiskSummary(summary)
                .memberPlans(memberPlans)
                .build();
    }

    private FamilyMemberResponse toMemberResponse(FamilyMember m) {
        return FamilyMemberResponse.builder()
                .id(m.getId())
                .name(m.getName())
                .ageGroup(m.getAgeGroup().name())
                .birthYear(m.getBirthYear())
                .sensitiveCategory(m.getSensitiveCategory().name())
                .dailyOutdoorHours(m.getDailyOutdoorHours())
                .workScheduleStart(m.getWorkScheduleStart() != null ? m.getWorkScheduleStart().toString() : null)
                .workScheduleEnd(m.getWorkScheduleEnd() != null ? m.getWorkScheduleEnd().toString() : null)
                .exercisePreference(m.getExercisePreference().name())
                .isActive(m.isActive())
                .build();
    }

    private LocalTime parseTime(String timeStr) {
        if (timeStr == null || timeStr.isBlank()) return null;
        try {
            return LocalTime.parse(timeStr);
        } catch (Exception e) {
            return null;
        }
    }
}
