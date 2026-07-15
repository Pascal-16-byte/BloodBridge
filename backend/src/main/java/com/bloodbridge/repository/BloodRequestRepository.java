package com.bloodbridge.repository;

import com.bloodbridge.constants.RequestStatus;
import com.bloodbridge.entity.BloodRequest;
import com.bloodbridge.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Sort;

public interface BloodRequestRepository extends JpaRepository<BloodRequest, Long> {

    List<BloodRequest> findByCreatedByOrderByCreatedAtDesc(User createdBy);

    List<BloodRequest> findByStatus(RequestStatus status, Sort sort);

    List<BloodRequest> findByStatusAndCityIgnoreCase(RequestStatus status, String city, Sort sort);

    Optional<BloodRequest> findByIdAndCreatedBy(Long id, User createdBy);

    long countByCreatedByAndStatus(User createdBy, RequestStatus status);
}
