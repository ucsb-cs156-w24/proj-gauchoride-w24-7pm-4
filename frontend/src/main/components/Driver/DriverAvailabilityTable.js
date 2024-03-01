import OurTable from "main/components/OurTable"

export default function DriverAvailabilityTable ({ drivershifts }) {

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
            Header: 'Driver',
            accessor: 'driverId',
        },
        {
            Header: 'Notes',
            accessor: 'notes',
        }
    ];

    return <OurTable
        data={drivershifts}
        columns={columns}
        testid={"DriverAvailabilityTable"}
    />;
};