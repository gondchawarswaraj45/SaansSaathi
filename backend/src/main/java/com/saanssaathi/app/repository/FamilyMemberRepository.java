package com.saanssaathi.app.repository;

import com.saanssaathi.app.model.entity.FamilyMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FamilyMemberRepository extends JpaRepository<FamilyMember, Long> {
    List<FamilyMember> findByFamilyGroupIdAndIsActiveTrue(Long familyGroupId);
    List<FamilyMember> findByFamilyGroupId(Long familyGroupId);
}
