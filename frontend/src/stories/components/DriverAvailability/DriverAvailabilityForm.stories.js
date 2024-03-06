import React from 'react';
import DriverAvailabilityForm from "main/components/DriverAvailability/DriverAvailabilityForm";
import { driverAvailabilityFixtures } from 'fixtures/driverAvailabilityFixtures';

export default {
    title: 'components/DriverAvailability/DriverAvailabilityForm',
    component: DriverAvailabilityForm
};

const Template = (args) => <DriverAvailabilityForm {...args} />;

export const Create = Template.bind({});
Create.args = {
    buttonLabel: "Create",
    submitAction: (data) => {
        console.log("Submit was clicked with data: ", data);
        window.alert("Submit was clicked with data: " + JSON.stringify(data));
    }
};

export const Update = Template.bind({});
Update.args = {
    initialContents: 
            // driverId: "123", 
            // driverEmail: "driver@example.com",
            // startDate: "2024-01-01",
            // endDate: "2024-01-15",
        driverAvailabilityFixtures.oneDriverAvailability
    ,
    buttonLabel: "Update",
    submitAction: (data) => {
        console.log("Update was clicked with data: ", data);
        window.alert("Update was clicked with data: " + JSON.stringify(data));
    }
};

