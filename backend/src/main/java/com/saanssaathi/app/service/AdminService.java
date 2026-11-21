package com.saanssaathi.app.service;

import com.saanssaathi.app.model.dto.request.BroadcastNotificationRequest;
import com.saanssaathi.app.model.dto.response.AdminStatsResponse;
import com.saanssaathi.app.model.dto.response.AdminUserDTO;
import com.saanssaathi.app.model.dto.response.ApiHealthDTO;

import java.util.List;

public interface AdminService {

    AdminStatsResponse getPlatformStats();

    List<AdminUserDTO> getAllUsers();

    AdminUserDTO toggleUserStatus(Long userId);

    List<ApiHealthDTO> getApiHealthDiagnostics();

    int broadcastNotification(BroadcastNotificationRequest request);
}
