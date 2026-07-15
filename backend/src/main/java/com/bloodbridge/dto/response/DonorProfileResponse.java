package com.bloodbridge.dto.response;

import com.bloodbridge.constants.BloodGroup;
import com.bloodbridge.constants.Gender;
import java.time.LocalDate;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DonorProfileResponse {

    private Long id;
    private Long userId;
    private String fullName;
    private String email;
    private String phoneNumber;
    private BloodGroup bloodGroup;
    private Integer age;
    private Gender gender;
    private Double weight;
    private LocalDate lastDonationDate;
    private String medicalConditions;
    private Boolean emergencyAvailable;
    private Integer preferredDonationDistance;
    private String city;
    private String district;
    private String state;
    private String pincode;
    private Boolean profileCompleted;
    private Integer completionPercentage;
}
