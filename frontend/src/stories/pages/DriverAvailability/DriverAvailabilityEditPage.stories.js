
import React from 'react';
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import driverAvailabilityFixtures from "fixtures/driverAvailabilityFixtures";
import { rest } from "msw";

import DriverAvailabilityEditPage from "main/pages/DriverAvailability/DriverAvailabilityEditPage";

export default {
    title: 'pages/DriverAvailability/DriverAvailabilityEditPage',
    component: DriverAvailabilityEditPage
};

const Template = () => <DriverAvailabilityEditPage storybook={true}/>;

export const Default = Template.bind({});
Default.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res( ctx.json(apiCurrentUserFixtures.userOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/driverAvailability', (_req, res, ctx) => {
            return res(ctx.json(driverAvailabilityFixtures.threeDriverAvailabilities[0]));
        }),
        rest.put('/api/driverAvailability', async (req, res, ctx) => {
            var reqBody = await req.text();
            window.alert("PUT: " + req.url + " and body: " + reqBody);
            return res(ctx.status(200),ctx.json({}));
        }),
    ],
}

