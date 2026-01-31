package com.elevateconnect.repository;

import com.elevateconnect.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByUserId(Long userId);

    List<Application> findByDriveId(Long driveId);

    Optional<Application> findByUserIdAndDriveId(Long userId, Long driveId);

    long countByStatus(com.elevateconnect.model.ApplicationStatus status);
}
