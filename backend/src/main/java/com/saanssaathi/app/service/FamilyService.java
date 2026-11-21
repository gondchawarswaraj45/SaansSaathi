package com.saanssaathi.app.service;

import com.saanssaathi.app.model.dto.request.FamilyMemberRequest;
import com.saanssaathi.app.model.dto.response.FamilyMemberResponse;
import com.saanssaathi.app.model.dto.response.FamilyProtectionPlanResponse;
import com.saanssaathi.app.model.entity.FamilyGroup;
import com.saanssaathi.app.model.entity.User;

import java.util.List;

public interface FamilyService {
    FamilyGroup getOrCreateFamilyGroup(User user, String familyName);
    FamilyMemberResponse addMember(User user, FamilyMemberRequest request);
    List<FamilyMemberResponse> getMembers(User user);
    FamilyMemberResponse updateMember(User user, Long memberId, FamilyMemberRequest request);
    void deleteMember(User user, Long memberId);
    FamilyProtectionPlanResponse getFamilyProtectionPlan(User user, int currentAqi);
}
