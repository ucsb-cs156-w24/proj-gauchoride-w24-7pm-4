import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import DriverAvailabilityForm from "main/components/DriverAvailability/DriverAvailabilityForm";
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";

import { toast } from "react-toastify";

export default function DriverAvailabilityEditPage() {
    let { id } = useParams();

    const { data: driverAvailabilities, _error, _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
        [`/api/driverAvailability?id=${id}`],
        {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
            method: "GET",
            url: `/api/driverAvailability`,
            params: {
            id
            }
        }
    );


    const objectToAxiosPutParams = (driverAvailabilities) => ({
        url: "/api/driverAvailability",
        method: "PUT",
        params: {
            id: driverAvailabilities.id,
        },
        data: {
            day: driverAvailabilities.day,
            startTime: driverAvailabilities.startTime,
            endTime: driverAvailabilities.endTime, 
            driverId: driverAvailabilities.driverId,
            notes: driverAvailabilities.notes
        }
    });

    const onSuccess = (driverAvailabilities) => {
        toast(`Driver Availability Updated - id: ${driverAvailabilities.id}`);
    }

    const mutation = useBackendMutation(
        objectToAxiosPutParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        [`/api/driverAvailability?id=${id}`]
    );

    const { isSuccess } = mutation

    const onSubmit = async (data) => {
        mutation.mutate(data);
    }

    if (isSuccess) {
        return <Navigate to="/driverAvailability/" />
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Edit Driver Availability </h1>
                {driverAvailabilities &&
                    <DriverAvailabilityForm initialContents={driverAvailabilities} submitAction={onSubmit} buttonLabel="Update" />
                }
            </div>
        </BasicLayout>
    )
}