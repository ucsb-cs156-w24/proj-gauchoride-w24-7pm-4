import React from 'react';
import { useBackend } from 'main/utils/useBackend';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import DriverAvailabilityTable from 'main/components/Driver/DriverAvailabilityTable';
import { useCurrentUser } from 'main/utils/currentUser';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

export default function DriverAvailabilityIndexPage() {

  const currentUser = useCurrentUser();

  const { data: driverAvailabilities, error: _error, status: _status } =
    useBackend(
      // Adjusted to match the DriverAvailability API endpoint
      ["/api/driverAvailability/admin/all"],
      { method: "GET", url: "/api/driverAvailability/admin/all" },
      []
    );

  return (
    <BasicLayout>
      <div className="pt-2">
          <Button style={{ float: "right" }} as={Link} to="/driveravailability/create">
            Create Driver Availability
          </Button>
          <h1>Driver Availabilities</h1>
        <DriverAvailabilityTable driverAvailabilities={driverAvailabilities} currentUser={currentUser} />
      </div>
    </BasicLayout>
  )
}
