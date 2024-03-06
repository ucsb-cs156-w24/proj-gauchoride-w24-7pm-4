import { render } from "@testing-library/react";
import driverAvailabilityFixtures from "fixtures/driverAvailabilityFixtures";
import DriverAvailabilityTable from "main/components/Driver/DriverAvailabilityTable";
import { QueryClient, QueryClientProvider } from "react-query";


describe("DriverAvailabilityTable tests", () => {
    const queryClient = new QueryClient();

    test("renders without crashing for empty table", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <DriverAvailabilityTable driverAvailabilities={[]} />
            </QueryClientProvider>
        );
    });

    test("renders without crashing for three shifts", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <DriverAvailabilityTable driverAvailabilities={driverAvailabilityFixtures.threeDriverAvailabilities} />
            </QueryClientProvider>
        );
    });

    test("Has the expected column headers and content", () => {
        const { getByText, getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <DriverAvailabilityTable driverAvailabilities={driverAvailabilityFixtures.threeDriverAvailabilities}/>
            </QueryClientProvider>
        );
    
        const expectedHeaders = ["id", "Day", "Start Time", "End Time", "Driver", "Notes"];
        const expectedFields = ["id", "day", "startTime", "endTime", "driverID", "notes"];
        const testId = "DriverAvailabilityTable";

        expectedHeaders.forEach( (headerText)=> {
            const header = getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expectedFields.forEach( (field)=> {
            const header = getByTestId(`${testId}-cell-row-0-col-${field}`);
            expect(header).toBeInTheDocument();
        });

        expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
        expect(getByTestId(`${testId}-cell-row-0-col-driverId`)).toHaveTextContent("14");
        expect(getByTestId(`${testId}-cell-row-0-col-day`)).toHaveTextContent("Friday");
        expect(getByTestId(`${testId}-cell-row-0-col-startTime`)).toHaveTextContent("09:00AM");
        expect(getByTestId(`${testId}-cell-row-0-col-endTime`)).toHaveTextContent("10:00AM");
        expect(getByTestId(`${testId}-cell-row-0-col-notes`)).toHaveTextContent("just got my license");
        expect(getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
        expect(getByTestId(`${testId}-cell-row-1-col-driverId`)).toHaveTextContent("3");
        expect(getByTestId(`${testId}-cell-row-1-col-startTime`)).toHaveTextContent("1:00PM");
        expect(getByTestId(`${testId}-cell-row-1-col-endTime`)).toHaveTextContent("3:00PM");
        expect(getByTestId(`${testId}-cell-row-1-col-day`)).toHaveTextContent("Monday");
        expect(getByTestId(`${testId}-cell-row-1-col-notes`)).toHaveTextContent("tired in morning");
        });
});
