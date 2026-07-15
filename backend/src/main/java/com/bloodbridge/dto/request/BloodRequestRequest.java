package com.bloodbridge.dto.request;

import com.bloodbridge.constants.BloodGroup;
import com.bloodbridge.constants.RequestStatus;
import com.bloodbridge.constants.Urgency;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BloodRequestRequest {

    @NotBlank(message = "Patient name is required")
    @Size(max = 120, message = "Patient name must not exceed 120 characters")
    private String patientName;

    @NotNull(message = "Blood group is required")
    private BloodGroup bloodGroup;

    @NotNull(message = "Units required is required")
    @Min(value = 1, message = "At least 1 unit is required")
    @Max(value = 20, message = "Units required must not exceed 20")
    private Integer unitsRequired;

    @NotBlank(message = "Hospital name is required")
    @Size(max = 160, message = "Hospital name must not exceed 160 characters")
    private String hospitalName;

    @NotBlank(message = "Hospital address is required")
    @Size(max = 255, message = "Hospital address must not exceed 255 characters")
    private String hospitalAddress;

    @NotBlank(message = "City is required")
    @Size(max = 80, message = "City must not exceed 80 characters")
    private String city;

    @NotBlank(message = "District is required")
    @Size(max = 80, message = "District must not exceed 80 characters")
    private String district;

    @NotBlank(message = "State is required")
    @Size(max = 80, message = "State must not exceed 80 characters")
    private String state;

    @NotBlank(message = "Contact person is required")
    @Size(max = 120, message = "Contact person must not exceed 120 characters")
    private String contactPerson;

    @NotBlank(message = "Contact number is required")
    @Pattern(regexp = "^[0-9+\\-\\s]{8,20}$", message = "Contact number must be 8 to 20 digits or symbols")
    private String contactNumber;

    @NotNull(message = "Urgency is required")
    private Urgency urgency;

    @NotNull(message = "Required before is required")
    @Future(message = "Required before must be in the future")
    private LocalDateTime requiredBefore;

    @Size(max = 500, message = "Notes must not exceed 500 characters")
    private String notes;

    private RequestStatus status;
}
