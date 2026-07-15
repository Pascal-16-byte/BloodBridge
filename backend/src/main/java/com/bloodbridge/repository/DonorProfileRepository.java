package com.bloodbridge.repository;

import com.bloodbridge.entity.DonorProfile;
import com.bloodbridge.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DonorProfileRepository extends JpaRepository<DonorProfile, Long> {

    Optional<DonorProfile> findByUser(User user);

    boolean existsByUser(User user);
}
