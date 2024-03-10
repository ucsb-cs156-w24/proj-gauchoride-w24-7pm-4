
import React from 'react';
import { rest } from "msw";
import DriverAvailabilityTable from 'main/components/DriverAvailability/DriverAvailabilityTable';
import driverAvailabilityFixtures from 'fixtures/driverAvailabilityFixtures';
import { currentUserFixtures } from 'fixtures/currentUserFixtures';

export default {
    title: 'components/DriverAvailability/DriverAvailabilityTable',
    component: DriverAvailabilityTable
};

const Template = (args) => {
    return (
        <DriverAvailabilityTable {...args} />
    )
};
export const Empty = Template.bind({});

Empty.args = {
    driverAvailabilities: []
};

export const ThreeDriverAvailabilitiesDriver = Template.bind({});

ThreeDriverAvailabilitiesDriver.args = {
    driverAvailabilities: driverAvailabilityFixtures.threeDriverAvailabilities,
    currentUser: currentUserFixtures.driverOnly,
}
ThreeDriverAvailabilitiesDriver.parameters = {
    msw: [
        rest.delete('/api/driverAvailability', (req, res, ctx) => {
            window.alert("DELETE: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
    ]
};
export const ThreeDriverAvailabilityAdminUser = Template.bind({});

ThreeDriverAvailabilityAdminUser.args = {
    driverAvailabilities: driverAvailabilityFixtures.threeDriverAvailabilities,
    currentUser: currentUserFixtures.adminUser
}

ThreeDriverAvailabilityAdminUser.parameters = {
    msw: [
        rest.delete('/api/driverAvailability', (req, res, ctx) => {
            window.alert("DELETE: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
    ]
};

