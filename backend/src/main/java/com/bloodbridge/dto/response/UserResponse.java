package com.bloodbridge.dto.response;

import com.bloodbridge.constants.BloodGroup;
import com.bloodbridge.constants.Gender;
import com.bloodbridge.constants.Role;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserResponse {

    private Long id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private BloodGroup bloodGroup;
    private Gender gender;
    private LocalDate dateOfBirth;
    private String city;
    private String state;
    private String address;
    private LocalDate lastDonationDate;
    private boolean available;
    private Role role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
