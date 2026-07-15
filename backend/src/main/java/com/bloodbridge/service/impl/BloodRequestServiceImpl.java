package com.bloodbridge.service.impl;

import com.bloodbridge.constants.RequestStatus;
import com.bloodbridge.constants.Urgency;
import com.bloodbridge.dto.request.BloodRequestRequest;
import com.bloodbridge.dto.response.BloodRequestResponse;
import com.bloodbridge.entity.BloodRequest;
import com.bloodbridge.entity.User;
import com.bloodbridge.exception.ResourceNotFoundException;
import com.bloodbridge.mapper.BloodRequestMapper;
import com.bloodbridge.repository.BloodRequestRepository;
import com.bloodbridge.repository.UserRepository;
import com.bloodbridge.service.BloodRequestService;
import com.bloodbridge.util.SecurityUtils;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BloodRequestServiceImpl implements BloodRequestService {

    private final BloodRequestRepository bloodRequestRepository;
    private final UserRepository userRepository;
    private final BloodRequestMapper bloodRequestMapper;

    @Override
    @Transactional
    public BloodRequestResponse createRequest(BloodRequestRequest request) {
        BloodRequest bloodRequest = bloodRequestMapper.toEntity(request, getAuthenticatedUser());
        return bloodRequestMapper.toResponse(bloodRequestRepository.save(bloodRequest));
    }

    @Override
    @Transactional(readOnly = true)
    public List<BloodRequestResponse> getMyRequests() {
        return bloodRequestRepository.findByCreatedByOrderByCreatedAtDesc(getAuthenticatedUser())
                .stream()
                .map(bloodRequestMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BloodRequestResponse> getActiveFeed(String sort, String city) {
        Sort latestSort = Sort.by(Sort.Direction.DESC, "createdAt");
        List<BloodRequest> requests = hasText(city)
                ? bloodRequestRepository.findByStatusAndCityIgnoreCase(RequestStatus.ACTIVE, city.trim(), latestSort)
                : bloodRequestRepository.findByStatus(RequestStatus.ACTIVE, latestSort);

        if ("urgency".equalsIgnoreCase(sort)) {
            requests = requests.stream()
                    .sorted((first, second) -> {
                        int urgencyCompare = Integer.compare(urgencyRank(second.getUrgency()), urgencyRank(first.getUrgency()));
                        if (urgencyCompare != 0) {
                            return urgencyCompare;
                        }
                        return second.getCreatedAt().compareTo(first.getCreatedAt());
                    })
                    .toList();
        }

        return requests.stream()
                .map(bloodRequestMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public BloodRequestResponse getMyRequest(Long id) {
        return bloodRequestMapper.toResponse(findOwnedRequest(id));
    }

    @Override
    @Transactional
    public BloodRequestResponse updateRequest(Long id, BloodRequestRequest request) {
        BloodRequest bloodRequest = findOwnedRequest(id);
        bloodRequestMapper.updateEntity(bloodRequest, request);
        return bloodRequestMapper.toResponse(bloodRequestRepository.save(bloodRequest));
    }

    @Override
    @Transactional
    public void deleteRequest(Long id) {
        bloodRequestRepository.delete(findOwnedRequest(id));
    }

    private BloodRequest findOwnedRequest(Long id) {
        return bloodRequestRepository.findByIdAndCreatedBy(id, getAuthenticatedUser())
                .orElseThrow(() -> new ResourceNotFoundException("Blood request was not found"));
    }

    private User getAuthenticatedUser() {
        String email = SecurityUtils.getCurrentUsername();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user was not found"));
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }

    private int urgencyRank(Urgency urgency) {
        if (urgency == null) {
            return 0;
        }

        return switch (urgency) {
            case CRITICAL -> 4;
            case HIGH -> 3;
            case MEDIUM -> 2;
            case LOW -> 1;
        };
    }
}
