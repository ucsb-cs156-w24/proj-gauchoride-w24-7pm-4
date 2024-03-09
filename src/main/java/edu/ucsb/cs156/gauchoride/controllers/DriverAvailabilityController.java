package edu.ucsb.cs156.gauchoride.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import edu.ucsb.cs156.gauchoride.entities.DriverAvailability;
import edu.ucsb.cs156.gauchoride.repositories.DriverAvailabilityRepository;
import edu.ucsb.cs156.gauchoride.repositories.UserRepository;
import edu.ucsb.cs156.gauchoride.errors.EntityNotFoundException;
import edu.ucsb.cs156.gauchoride.models.CurrentUser;

import java.sql.Driver;
import java.time.LocalTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import javax.validation.Valid;

import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;


@Tag(name = "DriverAvailability Information")
@RequestMapping("/api/driverAvailability")
@RestController
public class DriverAvailabilityController extends ApiController {
    @Autowired
    DriverAvailabilityRepository driverAvailabilityRepository;

    @Autowired
    ObjectMapper mapper;

    @Operation(summary = "Create a new driver availability for the table")
    @PreAuthorize("hasAnyRole('ADMIN', 'DRIVER')")
    @PostMapping("/new")
    public DriverAvailability postDriverAvailability(
        @Parameter(name="day") @RequestParam String day,
        @Parameter(name="startTime") @RequestParam String startTime,
        @Parameter(name="endTime") @RequestParam String endTime,
        @Parameter(name="notes") @RequestParam String notes
        )
        {

        DriverAvailability driverAvailability = new DriverAvailability();

        driverAvailability.setDriverId(getCurrentUser().getUser().getId());
        driverAvailability.setDay(day);
        driverAvailability.setStartTime(startTime);
        driverAvailability.setEndTime(endTime);
        driverAvailability.setNotes(notes);

        DriverAvailability savedDriverAvailability = driverAvailabilityRepository.save(driverAvailability);

        return savedDriverAvailability;
        }

    @Operation(summary= "Delete Driver Availability")
    @PreAuthorize("hasAnyRole('ADMIN', 'DRIVER')")
    @DeleteMapping("")
    public Object deletemenuitem(
        @Parameter(name="id") @RequestParam Long id) 
        {
        DriverAvailability drivav = driverAvailabilityRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException(DriverAvailability.class, id));
        
         driverAvailabilityRepository.delete(drivav);
        return genericMessage("Driver Availability with id %s deleted".formatted(id));
        }    

    @Operation(summary= "Update Driver Availability")
    @PreAuthorize("hasAnyRole('ADMIN', 'DRIVER')")
    @PutMapping("")
    public DriverAvailability updatemenuitem(
            @Parameter(name="id") @RequestParam Long id,
            @RequestBody @Valid DriverAvailability incoming) {

        DriverAvailability drivav = driverAvailabilityRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException(DriverAvailability.class, id));

        drivav.setDriverId(incoming.getDriverId());
        drivav.setDay(incoming.getDay());
        drivav.setStartTime(incoming.getStartTime());
        drivav.setEndTime(incoming.getEndTime());
        drivav.setNotes(incoming.getNotes());

        driverAvailabilityRepository.save(drivav);

        return drivav;
    }


    @Operation(summary= "List all Driver Availability")
    @PreAuthorize("hasAnyRole('ADMIN', 'DRIVER','USER')")
    @GetMapping("/all")
    public Iterable<DriverAvailability> allmenuitems() {
        Iterable<DriverAvailability> drivall = driverAvailabilityRepository.findAll();
        return drivall;
    }


    @Operation(summary= "Get Driver Availability")
    @PreAuthorize("hasAnyRole('ADMIN', 'DRIVER','USER')")
    @GetMapping("")
    public DriverAvailability getById(
            @Parameter(name="id") @RequestParam Long id) {
        DriverAvailability drivav = driverAvailabilityRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException( DriverAvailability.class, id));

        return drivav;
    }

    @Operation(summary = "Get a list of all driver availabilities")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/admin/all")
    public ResponseEntity<String> allDriverAvailabilities()
            throws JsonProcessingException {
        Iterable<DriverAvailability> driverAvailabilities = driverAvailabilityRepository.findAll();
        String body = mapper.writeValueAsString(driverAvailabilities);
        return ResponseEntity.ok().body(body);
    }

    @Operation(summary = "Get driver availability by id")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/admin")
    public DriverAvailability driverAvailabilityByID(
            @Parameter(name = "id", description = "Long, id number of driver availability to get", example = "1", required = true) @RequestParam Long id)
            throws JsonProcessingException {
        DriverAvailability driverAvailability = driverAvailabilityRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(DriverAvailability.class, id));
        return driverAvailability;
    }
}