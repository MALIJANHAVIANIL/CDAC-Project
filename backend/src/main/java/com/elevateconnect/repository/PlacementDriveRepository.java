package com.elevateconnect.repository;

import com.elevateconnect.model.PlacementDrive;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PlacementDriveRepository extends JpaRepository<PlacementDrive, Long> {
    List<PlacementDrive> findByDeadlineAfter(LocalDate date);

    List<PlacementDrive> findByCreatedBy(com.elevateconnect.model.User user);
}
