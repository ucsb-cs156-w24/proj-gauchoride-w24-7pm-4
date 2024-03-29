package edu.ucsb.cs156.gauchoride.entities;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import io.swagger.v3.oas.annotations.media.Schema;

@Data
@AllArgsConstructor
@NoArgsConstructor()
@Builder
@Entity(name = "driveravailability")
public class DriverAvailability {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  private Long driverId;
  
  @Schema(allowableValues = "Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday")
  private String day;
  
  private String startTime; // format: HH:MM(A/P)M e.g. "11:00AM" or "01:37PM"
  private String endTime; // format: HH:MM(A/P)M e.g. "11:00AM" or "01:37PM"
  private String notes;
}
