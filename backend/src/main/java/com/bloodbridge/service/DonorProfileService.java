package com.bloodbridge.service;

import com.bloodbridge.dto.request.DonorProfileRequest;
import com.bloodbridge.dto.response.DonorProfileResponse;

public interface DonorProfileService {

    DonorProfileResponse getAuthenticatedProfile();

    DonorProfileResponse createAuthenticatedProfile(DonorProfileRequest request);

    DonorProfileResponse updateAuthenticatedProfile(DonorProfileRequest request);
}
