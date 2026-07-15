package com.bloodbridge.mapper;

import com.bloodbridge.dto.request.DonorProfileRequest;
import com.bloodbridge.dto.response.DonorProfileResponse;
import com.bloodbridge.entity.DonorProfile;
import com.bloodbridge.entity.User;
import org.springframework.stereotype.Component;

@Component
public class DonorProfileMapper {

    public DonorProfile toEntity(DonorProfileRequest request, User user) {
        DonorProfile profile = new DonorProfile();
        profile.setUser(user);
        applyRequest(profile, request);
        return profile;
    }

    public void updateEntity(DonorProfile profile, DonorProfileRequest request) {
        applyRequest(profile, request);
    }

    public DonorProfileResponse toResponse(DonorProfile profile) {
        User user = profile.getUser();
        int completionPercentage = calculateCompletionPercentage(profile);

        return DonorProfileResponse.builder()
                .id(profile.getId())
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .bloodGroup(profile.getBloodGroup())
                .age(profile.getAge())
                .gender(profile.getGender())
                .weight(profile.getWeight())
                .lastDonationDate(profile.getLastDonationDate())
                .medicalConditions(profile.getMedicalConditions())
                .emergencyAvailable(profile.getEmergencyAvailable())
                .preferredDonationDistance(profile.getPreferredDonationDistance())
                .city(profile.getCity())
                .district(profile.getDistrict())
                .state(profile.getState())
                .pincode(profile.getPincode())
                .profileCompleted(profile.getProfileCompleted())
                .completionPercentage(completionPercentage)
                .build();
    }

    public int calculateCompletionPercentage(DonorProfile profile) {
        int totalFields = 12;
        int completedFields = 0;

        completedFields += profile.getBloodGroup() != null ? 1 : 0;
        completedFields += profile.getAge() != null ? 1 : 0;
        completedFields += profile.getGender() != null ? 1 : 0;
        completedFields += profile.getWeight() != null ? 1 : 0;
        completedFields += profile.getLastDonationDate() != null ? 1 : 0;
        completedFields += hasText(profile.getMedicalConditions()) ? 1 : 0;
        completedFields += profile.getEmergencyAvailable() != null ? 1 : 0;
        completedFields += profile.getPreferredDonationDistance() != null ? 1 : 0;
        completedFields += hasText(profile.getCity()) ? 1 : 0;
        completedFields += hasText(profile.getDistrict()) ? 1 : 0;
        completedFields += hasText(profile.getState()) ? 1 : 0;
        completedFields += hasText(profile.getPincode()) ? 1 : 0;

        return Math.round((completedFields * 100f) / totalFields);
    }

    private void applyRequest(DonorProfile profile, DonorProfileRequest request) {
        profile.setBloodGroup(request.getBloodGroup());
        profile.setAge(request.getAge());
        profile.setGender(request.getGender());
        profile.setWeight(request.getWeight());
        profile.setLastDonationDate(request.getLastDonationDate());
        profile.setMedicalConditions(trimToNull(request.getMedicalConditions()));
        profile.setEmergencyAvailable(request.getEmergencyAvailable());
        profile.setPreferredDonationDistance(request.getPreferredDonationDistance());
        profile.setCity(request.getCity().trim());
        profile.setDistrict(request.getDistrict().trim());
        profile.setState(request.getState().trim());
        profile.setPincode(request.getPincode().trim());
        profile.setProfileCompleted(calculateCompletionPercentage(profile) == 100);
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }

    private String trimToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}
