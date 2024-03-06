package edu.ucsb.cs156.gauchoride.controllers;

import edu.ucsb.cs156.gauchoride.repositories.UserRepository;
import edu.ucsb.cs156.gauchoride.testconfig.TestConfig;
import edu.ucsb.cs156.gauchoride.ControllerTestCase;
import edu.ucsb.cs156.gauchoride.entities.DriverAvailability;
import edu.ucsb.cs156.gauchoride.repositories.DriverAvailabilityRepository;

import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.any;
import org.springframework.http.MediaType;

@WebMvcTest(controllers = DriverAvailabilityController.class)
@Import(TestConfig.class)
public class DriverAvailabilityControllerTests extends ControllerTestCase {

        @MockBean
        DriverAvailabilityRepository driverAvailabilityRepository;

        @MockBean
        UserRepository userRepository;
        
        // Authorization tests for /api/driverAvailability/post

        @Test
        public void logged_out_users_cannot_post() throws Exception {
                mockMvc.perform(post("/api/driverAvailability/new"))
                                .andExpect(status().is(403));
        }

        @WithMockUser(roles = { "ADMIN" })
        @Test
        public void logged_in_admin_cannot_post() throws Exception {
                mockMvc.perform(post("/api/driverAvailability/new"))
                                .andExpect(status().is(403));
        }

        // // Tests with mocks for database actions for MEMBER

        // POST
        @WithMockUser(roles = { "DRIVER" })
        @Test
        public void a_driver_can_post_a_new_driverAvailability() throws Exception {
        //     Long UserId = currentUserService.getCurrentUser().getUser().getId();
        //     // Get the current date
        //     LocalDate localDate = LocalDate.now();
        //     Date currentDate = Date.valueOf(localDate);

            DriverAvailability availability1 = DriverAvailability.builder()
                                .driverId(1L)
                                .day("Friday")
                                .startTime("10:00AM")
                                .endTime("11:00AM")
                                .notes("old car")
                                .build();

            when(driverAvailabilityRepository.save(eq(availability1))).thenReturn(availability1);

        //     String postRequesString = "perm_number=7654321&description=My leg is broken";

            // act
            MvcResult response = mockMvc.perform(
                            post("/api/driverAvailability/new")
                                .param("day", "Friday")
                                .param("startTime", "10:00AM")
                                .param("endTime", "11:00AM")
                                .param("notes","old car")
                                .with(csrf()))
                            .andExpect(status().isOk()).andReturn();

            // assert
            verify(driverAvailabilityRepository, times(1)).save(availability1);
            String expectedJson = mapper.writeValueAsString(availability1);
            String responseString = response.getResponse().getContentAsString();
            assertEquals(expectedJson, responseString);
        }
        @WithMockUser(roles = { "DRIVER" })
        @Test
        public void admin_can_delete_a_driveravailibilty() throws Exception {
            // arrange
    
            DriverAvailability availability1 = DriverAvailability.builder()
                                .driverId(1L)
                                .day("Friday")
                                .startTime("10:00AM")
                                .endTime("11:00AM")
                                .notes("old car")
                                .build();
    
            when(driverAvailabilityRepository.findById(eq(1L))).thenReturn(Optional.of(availability1));
    
            // act
            MvcResult response = mockMvc.perform(
                    delete("/api/driverAvailability?id=1")
                            .with(csrf()))
                    .andExpect(status().isOk()).andReturn();
    
            // assert
            verify(driverAvailabilityRepository, times(1)).findById(1L);
            verify(driverAvailabilityRepository, times(1)).delete(any());
    
            Map<String, Object> json = responseToJson(response);
            assertEquals("Driver Availability with id 1 deleted", json.get("message"));
        }

    @WithMockUser(roles = { "DRIVER" })
    @Test
    public void admin_tries_to_delete_non_existant_driveravailibilty_and_gets_right_error_message()
            throws Exception {
        // arrange

        when(driverAvailabilityRepository.findById(eq(1L))).thenReturn(Optional.empty());

        // act
        MvcResult response = mockMvc.perform(
                delete("/api/driverAvailability?id=1")
                        .with(csrf()))
                .andExpect(status().isNotFound()).andReturn();

        // assert
        verify(driverAvailabilityRepository, times(1)).findById(1L);
        Map<String, Object> json = responseToJson(response);
        assertEquals("DriverAvailability with id 1 not found", json.get("message"));
    }

        
}