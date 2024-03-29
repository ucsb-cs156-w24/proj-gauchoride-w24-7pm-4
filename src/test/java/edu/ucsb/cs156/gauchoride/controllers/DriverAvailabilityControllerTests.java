package edu.ucsb.cs156.gauchoride.controllers;

import edu.ucsb.cs156.gauchoride.repositories.UserRepository;
import edu.ucsb.cs156.gauchoride.testconfig.TestConfig;
import edu.ucsb.cs156.gauchoride.ControllerTestCase;
import edu.ucsb.cs156.gauchoride.entities.DriverAvailability;
import edu.ucsb.cs156.gauchoride.entities.Ride;
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
import static org.mockito.ArgumentMatchers.argThat;

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
        public void driver_can_delete_their_own_availability() throws Exception {
                // arrange

                long driverId = currentUserService.getCurrentUser().getUser().getId();

                DriverAvailability availability1 = DriverAvailability.builder()
                                .driverId(driverId)
                                .day("Friday")
                                .startTime("10:00AM")
                                .endTime("11:00AM")
                                .notes("old car")
                                .build();
    
                        when(driverAvailabilityRepository.findByIdAndDriverId(eq(15L), eq(driverId))).thenReturn(Optional.of(availability1));
                // act
                MvcResult response = mockMvc.perform(
                    delete("/api/driverAvailability?id=15")
                            .with(csrf()))
                    .andExpect(status().isOk()).andReturn();

                // assertuserId
                verify(driverAvailabilityRepository, times(1)).findByIdAndDriverId(eq(15L), eq(driverId));
                verify(driverAvailabilityRepository, times(1)).delete(availability1);

                Map<String, Object> json = responseToJson(response);
                assertEquals("Driver Availability with id 15 deleted", json.get("message"));
        }

        @WithMockUser(roles = { "DRIVER" })
        @Test
        public void driver_tries_to_delete_non_existant_availability_and_gets_right_error_message()
                        throws Exception {
                // arrange

                long driverId = currentUserService.getCurrentUser().getUser().getId();

                when(driverAvailabilityRepository.findByIdAndDriverId(eq(15L), eq(driverId))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/driverAvailability?id=15")
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(driverAvailabilityRepository, times(1)).findByIdAndDriverId(eq(15L), eq(driverId));
                Map<String, Object> json = responseToJson(response);
                assertEquals("DriverAvailability with id 15 not found", json.get("message"));
        }
        @WithMockUser(roles = { "ADMIN" })
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

    @WithMockUser(roles = { "ADMIN" })
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
    
    @WithMockUser(roles = { "ADMIN"})
    @Test
public void admin_can_edit_an_existing_driveravailibility() throws Exception {
    // Arrange
    DriverAvailability availOrig = DriverAvailability.builder()
        .driverId(67L) // Original driver ID
        .day("Friday")
        .startTime("10:00AM")
        .endTime("11:00AM")
        .notes("old car")
        .build();

    Long newDriverId = 68L; // New driver ID for testing update
    DriverAvailability availedited = DriverAvailability.builder()
        .driverId(newDriverId) // Update to a different driver ID
        .day("Saturday")
        .startTime("09:00AM")
        .endTime("12:00PM")
        .notes("new car")
        .build();

    String requestBody = mapper.writeValueAsString(availedited);

    when(driverAvailabilityRepository.findById(eq(67L))).thenReturn(Optional.of(availOrig));
    when(driverAvailabilityRepository.save(any(DriverAvailability.class))).thenReturn(availedited);

    // act
    MvcResult response = mockMvc.perform(
            put("/api/driverAvailability?id=67")
                    .contentType(MediaType.APPLICATION_JSON)
                    .characterEncoding("utf-8")
                    .content(requestBody)
                    .with(csrf()))
            .andExpect(status().isOk()).andReturn();

    // assert
    verify(driverAvailabilityRepository, times(1)).findById(67L);
    verify(driverAvailabilityRepository, times(1)).save(argThat(availability ->
        availability.getDriverId().equals(newDriverId) &&
        availability.getDay().equals("Saturday") &&
        availability.getStartTime().equals("09:00AM") &&
        availability.getEndTime().equals("12:00PM") &&
        availability.getNotes().equals("new car")
    ));

    // Deserialize response to DriverAvailability and assert on updated driverId
    DriverAvailability responseAvail = mapper.readValue(response.getResponse().getContentAsString(), DriverAvailability.class);
    assertEquals(newDriverId, responseAvail.getDriverId());
}



    @WithMockUser(roles = { "ADMIN" })
    @Test
    public void admin_cannot_edit_ucsbdiningcommonsmenuitem_that_does_not_exist() throws Exception {
        // arrange

        DriverAvailability availedited = DriverAvailability.builder()
             .driverId(67L)
            .day("Friday")
            .startTime("10:00AM")
            .endTime("11:00AM")
            .notes("old car")
            .build();
        String requestBody = mapper.writeValueAsString(availedited);

        when(driverAvailabilityRepository.findById(eq(67L))).thenReturn(Optional.empty());

        // act
        MvcResult response = mockMvc.perform(
                put("/api/driverAvailability?id=67")
                        .contentType(MediaType.APPLICATION_JSON)
                        .characterEncoding("utf-8")
                        .content(requestBody)
                        .with(csrf()))
                .andExpect(status().isNotFound()).andReturn();

        // assert
        verify(driverAvailabilityRepository, times(1)).findById(67L);
        Map<String, Object> json = responseToJson(response);
        assertEquals("DriverAvailability with id 67 not found", json.get("message"));

    }

    @WithMockUser(roles = { "DRIVER" })
        @Test
        public void driver_cannot_edit_own_availability_that_does_not_exist() throws Exception {
                // arrange

                long driverId = currentUserService.getCurrentUser().getUser().getId();

                DriverAvailability availedited = DriverAvailability.builder()
                        .driverId(67L)
                        .day("Friday")
                        .startTime("10:00AM")
                        .endTime("11:00AM")
                        .notes("old car")
                        .build();


                String requestBody = mapper.writeValueAsString(availedited);

                when(driverAvailabilityRepository.findByIdAndDriverId(eq(67L), eq(driverId))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/driverAvailability?id=67")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(driverAvailabilityRepository, times(1)).findByIdAndDriverId(67L, driverId);
                Map<String, Object> json = responseToJson(response);
                assertEquals("DriverAvailability with id 67 not found", json.get("message"));

        }

    @Test
    public void logged_out_users_cannot_get_all() throws Exception {
        mockMvc.perform(get("/api/driverAvailability/all"))
                .andExpect(status().is(403)); // logged out users can't get all
    }

        @WithMockUser(roles = { "DRIVER" })
        @Test
        public void logged_in_driver_can_get_all() throws Exception {
                mockMvc.perform(get("/api/driverAvailability/all"))
                                .andExpect(status().is(200)); // logged
        }

        @WithMockUser(roles = { "ADMIN"})
        @Test
        public void logged_in_admin_can_get_all_driveravailibilty() throws Exception {
            DriverAvailability item1 = DriverAvailability.builder()
                .driverId(1L) // Original driver ID
                .day("Friday")
                .startTime("10:00AM")
                .endTime("11:00AM")
                .notes("old car")
                .build();
            DriverAvailability item2 = DriverAvailability.builder()
                .driverId(2L) 
                .startTime("11:00AM")
                .endTime("12:00AM")
                .notes("new car")
                .build();
    
            ArrayList<DriverAvailability> expectedItems = new ArrayList<>();
            expectedItems.addAll(Arrays.asList(item1, item2));
    
            when(driverAvailabilityRepository.findAll()).thenReturn(expectedItems);
    
            // act
            MvcResult response = mockMvc.perform(get("/api/driverAvailability/all"))
                    .andExpect(status().isOk()).andReturn();
    
            // assert
    
            verify(driverAvailabilityRepository, times(1)).findAll();
            String expectedJson = mapper.writeValueAsString(expectedItems);
            String responseString = response.getResponse().getContentAsString();
            assertEquals(expectedJson, responseString);
        }
    
    @Test
    public void logged_out_users_cannot_get_by_id() throws Exception {
        mockMvc.perform(get("/api/driverAvailability?id=7"))
                .andExpect(status().is(403)); // logged out users can't get by id
    }

    @WithMockUser(roles = { "DRIVER" })
    @Test
    public void test_that_logged_in_driver_can_get_by_id_when_the_id_exists() throws Exception {

        // arrange

        DriverAvailability item1 = DriverAvailability.builder()
            .driverId(7L) 
            .startTime("11:00AM")
            .endTime("12:00AM")
            .notes("new car")
            .build();

        when(driverAvailabilityRepository.findById(eq(7L))).thenReturn(Optional.of(item1));

        // act
        MvcResult response = mockMvc.perform(get("/api/driverAvailability?id=7"))
                .andExpect(status().isOk()).andReturn();

        // assert

        verify(driverAvailabilityRepository, times(1)).findById(eq(7L));
        String expectedJson = mapper.writeValueAsString(item1);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "DRIVER" })
    @Test
    public void test_that_logged_in_driver_can_get_by_id_when_the_id_does_not_exist() throws Exception {

        // arrange

        when(driverAvailabilityRepository.findById(eq(7L))).thenReturn(Optional.empty());

        // act
        MvcResult response = mockMvc.perform(get("/api/driverAvailability?id=7"))
                .andExpect(status().isNotFound()).andReturn();

        // assert

        verify(driverAvailabilityRepository, times(1)).findById(eq(7L));
        Map<String, Object> json = responseToJson(response);
        assertEquals("EntityNotFoundException", json.get("type"));
        assertEquals("DriverAvailability with id 7 not found", json.get("message"));
    }


        // Authorization tests for /api/driverAvailability/admin/all

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_users_cannot_get_all_of_theirs() throws Exception {
                mockMvc.perform(get("/api/driverAvailability/admin/all"))
                                .andExpect(status().is(403)); // logged
        }

        @WithMockUser(roles = { "DRIVER" })
        @Test
        public void logged_in_driver_cannot_get_all() throws Exception {
                mockMvc.perform(get("/api/driverAvailability/admin/all"))
                                .andExpect(status().is(403)); // logged
        }

        @WithMockUser(roles = { "ADMIN" })
        @Test
        public void logged_in_admin_can_get_all() throws Exception {
                mockMvc.perform(get("/api/driverAvailability/admin/all"))
                                .andExpect(status().is(200)); // logged
        }



        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_users_cannot_get_by_id() throws Exception {
                mockMvc.perform(get("/api/driverAvailability/admin?id=7"))
                                .andExpect(status().is(403));
        }

        @WithMockUser(roles = { "DRIVER" })
        @Test
        public void logged_in_driver_cannot_get_by_id() throws Exception {
                mockMvc.perform(get("/api/driverAvailability/admin?id=7"))
                                .andExpect(status().is(403));
        }

        @WithMockUser(roles = { "ADMIN" })
        @Test
        public void logged_in_admin_can_get_by_id() throws Exception {
                mockMvc.perform(get("/api/driverAvailability/admin?id=7"))
                                .andExpect(status().is(404)); // logged, but no id exists
        }
        
        // ADMIN GET BY ID

        @WithMockUser(roles = { "ADMIN" , "USER" })
        @Test
        public void test_that_logged_in_admin_can_get_by_id_when_the_id_exists() throws Exception {

                // arrange

                long userId = currentUserService.getCurrentUser().getUser().getId();

                DriverAvailability driverAvailability = DriverAvailability.builder()
                                .driverId(userId)
                                .day("Monday")
                                .startTime("10:00AM")
                                .endTime("12:30PM")
                                .notes("")
                                .build();

                when(driverAvailabilityRepository.findById(eq(7L))).thenReturn(Optional.of(driverAvailability));

                // act
                MvcResult response = mockMvc.perform(get("/api/driverAvailability/admin?id=7"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(driverAvailabilityRepository, times(1)).findById(eq(7L));
                String expectedJson = mapper.writeValueAsString(driverAvailability);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "ADMIN" , "USER" })
        @Test
        public void test_that_logged_in_admin_can_get_by_id_when_the_id_does_not_exist() throws Exception {

                // arrange

                when(driverAvailabilityRepository.findById(eq(7L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(get("/api/driverAvailability/admin?id=7"))
                                .andExpect(status().isNotFound()).andReturn();

                // assert

                verify(driverAvailabilityRepository, times(1)).findById(eq(7L));
                Map<String, Object> json = responseToJson(response);
                assertEquals("EntityNotFoundException", json.get("type"));
                assertEquals("DriverAvailability with id 7 not found", json.get("message"));
        }     


        // GET ALL

        @WithMockUser(roles = { "ADMIN" , "USER" })
        @Test
        public void logged_in_admin_can_get_all_driver_availabilities() throws Exception {

                long userId = currentUserService.getCurrentUser().getUser().getId();

                DriverAvailability availability1 = DriverAvailability.builder()
                                .driverId(userId)
                                .day("Monday")
                                .startTime("10:30AM")
                                .endTime("12:30PM")
                                .notes("")
                                .build();

                DriverAvailability availability2 = DriverAvailability.builder()
                                .driverId(userId)
                                .day("Tuesday")
                                .startTime("10:30AM")
                                .endTime("12:30PM")
                                .notes("")
                                .build();


                ArrayList<DriverAvailability> expectedDriverAvailabilities = new ArrayList<>();
                expectedDriverAvailabilities.addAll(Arrays.asList(availability1, availability2));

                when(driverAvailabilityRepository.findAll()).thenReturn(expectedDriverAvailabilities);

                // act
                MvcResult response = mockMvc.perform(get("/api/driverAvailability/admin/all"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(driverAvailabilityRepository, times(1)).findAll();
                String expectedJson = mapper.writeValueAsString(expectedDriverAvailabilities);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

}