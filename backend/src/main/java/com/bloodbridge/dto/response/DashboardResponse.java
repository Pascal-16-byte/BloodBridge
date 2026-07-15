package com.bloodbridge.dto.response;

import com.bloodbridge.constants.BloodGroup;
import java.time.LocalDate;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DashboardResponse {

    private String userName;
    private BloodGroup bloodGroup;
    private Integer profileCompletion;
    private Boolean donationEligibility;
    private LocalDate lastDonationDate;
    private Boolean emergencyAvailability;
    private Integer totalDonations;
    private Integer activeRequestsCount;
    private Integer pendingRequestsCount;
}
