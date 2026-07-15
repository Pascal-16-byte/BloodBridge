package com.bloodbridge.controller;

import com.bloodbridge.dto.request.DonorProfileRequest;
import com.bloodbridge.dto.response.ApiResponse;
import com.bloodbridge.dto.response.DonorProfileResponse;
import com.bloodbridge.service.DonorProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class DonorProfileController {

    private final DonorProfileService donorProfileService;

    @GetMapping
    public ResponseEntity<ApiResponse<DonorProfileResponse>> getProfile() {
        return ResponseEntity.ok(ApiResponse.success("Donor profile fetched successfully", donorProfileService.getAuthenticatedProfile()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<DonorProfileResponse>> createProfile(@Valid @RequestBody DonorProfileRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Donor profile created successfully", donorProfileService.createAuthenticatedProfile(request)));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<DonorProfileResponse>> updateProfile(@Valid @RequestBody DonorProfileRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Donor profile updated successfully", donorProfileService.updateAuthenticatedProfile(request)));
    }
}
