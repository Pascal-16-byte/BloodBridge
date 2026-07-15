package com.bloodbridge.service.impl;

import com.bloodbridge.constants.RequestStatus;
import com.bloodbridge.dto.response.DashboardResponse;
import com.bloodbridge.entity.DonorProfile;
import com.bloodbridge.entity.User;
import com.bloodbridge.exception.ResourceNotFoundException;
import com.bloodbridge.mapper.DonorProfileMapper;
import com.bloodbridge.repository.BloodRequestRepository;
import com.bloodbridge.repository.DonorProfileRepository;
import com.bloodbridge.repository.UserRepository;
import com.bloodbridge.service.DashboardService;
import com.bloodbridge.util.SecurityUtils;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private static final int DONATION_WAIT_DAYS = 90;

    private final UserRepository userRepository;
    private final DonorProfileRepository donorProfileRepository;
    private final BloodRequestRepository bloodRequestRepository;
    private final DonorProfileMapper donorProfileMapper;

    @Override
    @Transactional(readOnly = true)
    public DashboardResponse getAuthenticatedDashboard() {
        User user = getAuthenticatedUser();
        DonorProfile profile = donorProfileRepository.findByUser(user).orElse(null);
        LocalDate lastDonationDate = profile != null ? profile.getLastDonationDate() : user.getLastDonationDate();
        int activeRequestsCount = Math.toIntExact(bloodRequestRepository.countByCreatedByAndStatus(user, RequestStatus.ACTIVE));
        int pendingRequestsCount = Math.toIntExact(bloodRequestRepository.countByCreatedByAndStatus(user, RequestStatus.PENDING));

        return DashboardResponse.builder()
                .userName(user.getFullName())
                .bloodGroup(profile != null ? profile.getBloodGroup() : user.getBloodGroup())
                .profileCompletion(profile != null ? donorProfileMapper.calculateCompletionPercentage(profile) : 0)
                .donationEligibility(isDonationEligible(lastDonationDate))
                .lastDonationDate(lastDonationDate)
                .emergencyAvailability(profile != null ? profile.getEmergencyAvailable() : user.isAvailable())
                .totalDonations(0)
                .activeRequestsCount(activeRequestsCount)
                .pendingRequestsCount(pendingRequestsCount)
                .build();
    }

    private User getAuthenticatedUser() {
        String email = SecurityUtils.getCurrentUsername();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user was not found"));
    }

    private boolean isDonationEligible(LocalDate lastDonationDate) {
        return lastDonationDate == null || !lastDonationDate.plusDays(DONATION_WAIT_DAYS).isAfter(LocalDate.now());
    }
}
