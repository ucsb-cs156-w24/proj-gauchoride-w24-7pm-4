import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import DriverAvailabilityForm from "main/components/DriverAvailability/DriverAvailabilityForm";
import { Navigate } from 'react-router-dom';
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function DriverAvailabilityCreatePage({ storybook = false }) {
  const objectToAxiosParams = (driverAvailability) => ({
    url: "/api/driverAvailability/new",
    method: "POST",
    params: {
      driverId: driverAvailability.driverId,
      day: driverAvailability.day,
      startTime: driverAvailability.startTime,
      endTime: driverAvailability.endTime,
      notes: driverAvailability.notes
    }
  });

  const onSuccess = (driverAvailability) => {
    toast(`New Driver Availability Created - id: ${driverAvailability.id} for driverId: ${driverAvailability.driverId}`);
  }
  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/DriverAvailability/all"]
     );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess && !storybook) {
    return <Navigate to="/driveravailability" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New Driver Availability</h1>

        <DriverAvailabilityForm submitAction={onSubmit} />

      </div>
    </BasicLayout>
  );
}
