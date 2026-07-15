package com.bloodbridge.service;

import com.bloodbridge.dto.request.BloodRequestRequest;
import com.bloodbridge.dto.response.BloodRequestResponse;
import java.util.List;

public interface BloodRequestService {

    BloodRequestResponse createRequest(BloodRequestRequest request);

    List<BloodRequestResponse> getMyRequests();

    List<BloodRequestResponse> getActiveFeed(String sort, String city);

    BloodRequestResponse getMyRequest(Long id);

    BloodRequestResponse updateRequest(Long id, BloodRequestRequest request);

    void deleteRequest(Long id);
}
