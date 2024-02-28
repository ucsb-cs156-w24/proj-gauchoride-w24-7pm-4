import { render } from "@testing-library/react";
import driverAvailabilityFixtures from "fixtures/driverAvailabilityFixtures";
import DriverAvailabilityTable from "main/components/Driver/DriverAvailabilityTable";
import { QueryClient, QueryClientProvider } from "react-query";


describe("DriverAvailabilityTable tests", () => {
    const queryClient = new QueryClient();

    test("renders without crashing for empty table", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <DriverTable drivers={[]} />
            </QueryClientProvider>
        );
    });

    test("renders without crashing for three shifts", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <DriverTable drivers={driverAvailabilityFixtures.threeDrivers} />
            </QueryClientProvider>
        );
    });

    test("Has the expected column headers and content", () => {
        const { getByText, getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <DriverTable drivers={driverAvailabilityFixtures.threeDrivers}/>
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
        expect(getByTestId(`${testId}-cell-row-0-col-`)).toHaveTextContent("");
        expect(getByTestId(`${testId}-cell-row-0-col-`)).toHaveTextContent("");
        expect(getByTestId(`${testId}-cell-row-0-col-`)).toHaveTextContent("");
        expect(getByTestId(`${testId}-cell-row-0-col-`)).toHaveTextContent("");
        expect(getByTestId(`${testId}-cell-row-0-col-`)).toHaveTextContent("");
        expect(getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
        expect(getByTestId(`${testId}-cell-row-1-col-`)).toHaveTextContent("");
        expect(getByTestId(`${testId}-cell-row-1-col-`)).toHaveTextContent("");
        expect(getByTestId(`${testId}-cell-row-1-col-`)).toHaveTextContent("");
        expect(getByTestId(`${testId}-cell-row-0-col-`)).toHaveTextContent("");
        expect(getByTestId(`${testId}-cell-row-0-col-`)).toHaveTextContent("");
        });
});
