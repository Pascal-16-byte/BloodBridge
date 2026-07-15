package com.bloodbridge.dto.response;

import com.bloodbridge.constants.BloodGroup;
import com.bloodbridge.constants.RequestStatus;
import com.bloodbridge.constants.Urgency;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BloodRequestResponse {

    private Long id;
    private Long createdById;
    private String createdByName;
    private String patientName;
    private BloodGroup bloodGroup;
    private Integer unitsRequired;
    private String hospitalName;
    private String hospitalAddress;
    private String city;
    private String district;
    private String state;
    private String contactPerson;
    private String contactNumber;
    private Urgency urgency;
    private LocalDateTime requiredBefore;
    private String notes;
    private RequestStatus status;
    private LocalDateTime createdAt;
}
