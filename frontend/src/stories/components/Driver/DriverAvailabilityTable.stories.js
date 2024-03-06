
import React from 'react';

import DriverAvailabilityTable from 'main/components/Driver/DriverAvailabilityTable';
import driverAvailabilityFixtures from 'fixtures/driverAvailabilityFixtures';

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

export const DriverAvailabilityThreeSubjects = Template.bind({});

DriverAvailabilityThreeSubjects.args = {
    driverAvailabilities: driverAvailabilityFixtures.threeDriverAvailabilities,
};

