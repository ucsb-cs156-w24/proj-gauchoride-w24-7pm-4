package edu.ucsb.cs156.gauchoride.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import edu.ucsb.cs156.gauchoride.entities.DriverAvailability;
import edu.ucsb.cs156.gauchoride.entities.Ride;

import java.util.Optional;

@Repository
public interface DriverAvailabilityRepository extends CrudRepository<DriverAvailability, Long> {
  Optional<DriverAvailability> findByDay(String day);
  Iterable<DriverAvailability> findByDriverId(Long driverId);
  Optional<DriverAvailability> findByIdAndDriverId(Long Id, Long driverId);
  Iterable<DriverAvailability> findAllByDriverId(long riderId);
}
