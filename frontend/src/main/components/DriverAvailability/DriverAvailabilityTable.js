import OurTable, {ButtonColumn} from "main/components/OurTable"  // if admin, needs {ButtonColumn}
import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/driverAvailabilityUtils"
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function DriverAvailabilityTable ({ driverAvailabilities, currentUser }) { // if admin, needs currentUser
    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/driverAvailability/edit/${cell.row.values.id}`)
    }
    

    // Stryker disable all : hard to test for query caching

    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/driverAvailability/all"]
    );
    // Stryker restore all 

    // Stryker disable next-line all : TODO try to make a good test for this
    const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }
    const columns = [
        {
            Header: 'id',
            accessor: 'id', // accessor is the "key" in the data
        },
        {
            Header: 'Day',
            accessor: 'day',
        },
        {
            Header: 'Start Time',
            accessor: 'startTime',
        },
        {
            Header: 'End Time',
            accessor: 'endTime',
        },
        {
            Header: 'Driver ID',
            accessor: 'driverId',
        },
        {
            Header: 'Notes',
            accessor: 'notes',
        }
    ];
    if (hasRole(currentUser, "ROLE_ADMIN") || hasRole(currentUser, "ROLE_DRIVER") ){
        columns.push(ButtonColumn("Delete", "danger", deleteCallback, "DriverAvailabilityTable"));
        columns.push(ButtonColumn("Edit", "primary", editCallback, "DriverAvailabilityTable"));
    } 
    return <OurTable
        data={driverAvailabilities}
        columns={columns}
        testid={"DriverAvailabilityTable"}
    />;
};