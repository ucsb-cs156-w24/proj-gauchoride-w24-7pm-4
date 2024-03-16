import React from 'react';
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { rest } from "msw";

import DriverAvailabilityIndexPage from "main/pages/DriverAvailability/DriverAvailabilityIndexPage";

export default {
    title: 'pages/DriverAvailability/DriverAvailabilityIndexPage',
    component: DriverAvailabilityIndexPage
};

const Template = () => <DriverAvailabilityIndexPage storybook={true} />;

export const Default = Template.bind({});
Default.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res(ctx.json(apiCurrentUserFixtures.userOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/driverAvailability/admin/all', (_req, res, ctx) => {
            return res(ctx.json([]));
        }),
    ]
}
