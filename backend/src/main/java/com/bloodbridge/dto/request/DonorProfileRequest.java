package com.bloodbridge.dto.request;

import com.bloodbridge.constants.BloodGroup;
import com.bloodbridge.constants.Gender;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DonorProfileRequest {

    @NotNull(message = "Blood group is required")
    private BloodGroup bloodGroup;

    @NotNull(message = "Age is required")
    @Min(value = 18, message = "Age must be at least 18")
    @Max(value = 65, message = "Age must not exceed 65")
    private Integer age;

    @NotNull(message = "Gender is required")
    private Gender gender;

    @NotNull(message = "Weight is required")
    @DecimalMin(value = "45.0", message = "Weight must be at least 45 kg")
    private Double weight;

    @PastOrPresent(message = "Last donation date cannot be in the future")
    private LocalDate lastDonationDate;

    @Size(max = 500, message = "Medical conditions must not exceed 500 characters")
    private String medicalConditions;

    @NotNull(message = "Emergency availability is required")
    private Boolean emergencyAvailable;

    @NotNull(message = "Preferred donation distance is required")
    @Min(value = 1, message = "Preferred donation distance must be at least 1 km")
    @Max(value = 250, message = "Preferred donation distance must not exceed 250 km")
    private Integer preferredDonationDistance;

    @NotBlank(message = "City is required")
    @Size(max = 80, message = "City must not exceed 80 characters")
    private String city;

    @NotBlank(message = "District is required")
    @Size(max = 80, message = "District must not exceed 80 characters")
    private String district;

    @NotBlank(message = "State is required")
    @Size(max = 80, message = "State must not exceed 80 characters")
    private String state;

    @NotBlank(message = "Pincode is required")
    @Pattern(regexp = "^[0-9]{5,10}$", message = "Pincode must contain 5 to 10 digits")
    private String pincode;
}
