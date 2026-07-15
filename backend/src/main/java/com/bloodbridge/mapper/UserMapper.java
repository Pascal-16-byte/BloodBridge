package com.bloodbridge.mapper;

import com.bloodbridge.dto.request.RegisterRequest;
import com.bloodbridge.dto.response.UserResponse;
import com.bloodbridge.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public User toEntity(RegisterRequest request) {
        return User.builder()
                .fullName(request.getFullName().trim())
                .email(request.getEmail().trim().toLowerCase())
                .phoneNumber(request.getPhoneNumber().trim())
                .bloodGroup(request.getBloodGroup())
                .gender(request.getGender())
                .dateOfBirth(request.getDateOfBirth())
                .city(request.getCity().trim())
                .state(request.getState().trim())
                .address(request.getAddress().trim())
                .lastDonationDate(request.getLastDonationDate())
                .available(request.getAvailable())
                .build();
    }

    public UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .bloodGroup(user.getBloodGroup())
                .gender(user.getGender())
                .dateOfBirth(user.getDateOfBirth())
                .city(user.getCity())
                .state(user.getState())
                .address(user.getAddress())
                .lastDonationDate(user.getLastDonationDate())
                .available(user.isAvailable())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
