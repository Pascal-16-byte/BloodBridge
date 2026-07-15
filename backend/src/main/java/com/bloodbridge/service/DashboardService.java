package com.bloodbridge.service;

import com.bloodbridge.dto.response.DashboardResponse;

public interface DashboardService {

    DashboardResponse getAuthenticatedDashboard();
}
