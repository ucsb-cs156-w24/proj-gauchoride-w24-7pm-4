
import React from 'react';
//import { rest } from "msw";
import DriverAvailabilityTable from 'main/components/Driver/DriverAvailabilityTable';
import driverAvailabilityFixtures from 'fixtures/driverAvailabilityFixtures';
//import { currentUserFixtures } from 'fixtures/currentUserFixtures';

export default {
    title: 'components/Driver/DriverAvailabilityTable',
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

export const ThreeDriverAvailabilitiesOrdinaryUser = Template.bind({});

ThreeDriverAvailabilitiesOrdinaryUser.args = {
    driverAvailabilities: driverAvailabilityFixtures.threeDriverAvailabilities,
    //currentUser: currentUserFixtures.userOnly,
};

// export const ThreeDriverAvailabilityAdminUser = Template.bind({});

// ThreeDriverAvailabilityAdminUser.args = {
//     driverAvailabilities: driverAvailabilityFixtures.threeDriverAvailabilities,
//     currentUser: currentUserFixtures.adminUser
// }

// ThreeDriverAvailabilityAdminUser.parameters = {
//     msw: [
//         rest.delete('/api/driverAvailability', (req, res, ctx) => {
//             window.alert("DELETE: " + JSON.stringify(req.url));
//             return res(ctx.status(200),ctx.json({}));
//         }),
//     ]
// };

