package com.bloodbridge.service.impl;

import com.bloodbridge.dto.request.DonorProfileRequest;
import com.bloodbridge.dto.response.DonorProfileResponse;
import com.bloodbridge.entity.DonorProfile;
import com.bloodbridge.entity.User;
import com.bloodbridge.exception.ConflictException;
import com.bloodbridge.exception.ResourceNotFoundException;
import com.bloodbridge.mapper.DonorProfileMapper;
import com.bloodbridge.repository.DonorProfileRepository;
import com.bloodbridge.repository.UserRepository;
import com.bloodbridge.service.DonorProfileService;
import com.bloodbridge.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DonorProfileServiceImpl implements DonorProfileService {

    private final DonorProfileRepository donorProfileRepository;
    private final UserRepository userRepository;
    private final DonorProfileMapper donorProfileMapper;

    @Override
    @Transactional(readOnly = true)
    public DonorProfileResponse getAuthenticatedProfile() {
        User user = getAuthenticatedUser();
        DonorProfile profile = donorProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Donor profile was not found"));
        return donorProfileMapper.toResponse(profile);
    }

    @Override
    @Transactional
    public DonorProfileResponse createAuthenticatedProfile(DonorProfileRequest request) {
        User user = getAuthenticatedUser();

        if (donorProfileRepository.existsByUser(user)) {
            throw new ConflictException("Donor profile already exists");
        }

        DonorProfile profile = donorProfileMapper.toEntity(request, user);
        return donorProfileMapper.toResponse(donorProfileRepository.save(profile));
    }

    @Override
    @Transactional
    public DonorProfileResponse updateAuthenticatedProfile(DonorProfileRequest request) {
        User user = getAuthenticatedUser();
        DonorProfile profile = donorProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Donor profile was not found"));
        donorProfileMapper.updateEntity(profile, request);
        return donorProfileMapper.toResponse(donorProfileRepository.save(profile));
    }

    private User getAuthenticatedUser() {
        String email = SecurityUtils.getCurrentUsername();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user was not found"));
    }
}
