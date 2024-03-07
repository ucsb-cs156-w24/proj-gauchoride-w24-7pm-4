import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import driverAvailabilityFixtures from "fixtures/driverAvailabilityFixtures";
import DriverAvailabilityTable from "main/components/DriverAvailability/DriverAvailabilityTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));
const mockDeleteMutation = jest.fn();
jest.mock('react-query', () => ({
    ...jest.requireActual('react-query'),
    useMutation: () => ({
        mutate: mockDeleteMutation,
    }),
}));

describe("DriverAvailabilityTable tests", () => {
    const queryClient = new QueryClient();
    test("renders without crashing for empty table with user not logged in", () => {
        const currentUser = null;
    
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <DriverAvailabilityTable driverAvailabilities={[]} currentUser={currentUser} />
                </MemoryRouter>
            </QueryClientProvider>
    
        );
    });
    test("renders without crashing for empty table for admin", () => {
        const currentUser = currentUserFixtures.adminUser;
    
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <DriverAvailabilityTable driverAvailabilities={[]} currentUser={currentUser} />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });
    test("renders without crashing for empty table for admin", () => {
        const currentUser = currentUserFixtures.driverOnly;
    
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <DriverAvailabilityTable driverAvailabilities={[]} currentUser={currentUser} />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("renders without crashing for three availabilities", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <DriverAvailabilityTable driverAvailabilities={driverAvailabilityFixtures.threeDriverAvailabilities} />
            </QueryClientProvider>
        );
    });

    test("Has the expected column headers and content for adminUser", () => {
        const currentUser = currentUserFixtures.adminUser;

        const { getByText, getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <DriverAvailabilityTable driverAvailabilities={driverAvailabilityFixtures.threeDriverAvailabilities} currentUser={currentUser} />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const expectedHeaders = ["id", "Day", "Start Time", "End Time", "Driver ID", "Notes"];
        const expectedFields = ["id", "day", "startTime", "endTime", "driverId", "notes"];
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

        const editButton = getByTestId(`${testId}-cell-row-0-col-Edit-button`);
        expect(editButton).toBeInTheDocument();
        expect(editButton).toHaveClass("btn-primary");

        const deleteButton = getByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();
        expect(deleteButton).toHaveClass("btn-danger");
    });
    test("Has the expected column headers and content for ordinary driver", async () => {

        //const currentUser = currentUserFixtures.adminUser;
        const currentUser = currentUserFixtures.driverOnly;
        const testId = "DriverAvailabilityTable";

        render(
            <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <DriverAvailabilityTable driverAvailabilities={driverAvailabilityFixtures.threeDriverAvailabilities} currentUser={currentUser} />
            </MemoryRouter>
            </QueryClientProvider>
    
        );
    
        await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1"); });
    
        const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
        expect(screen.queryByText("Delete")).not.toBeInTheDocument();
        expect(editButton).toBeInTheDocument();
        
        
        fireEvent.click(editButton);
    
        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/driverAvailability/edit/1'));
    
    });
    test("Has the expected column headers and content for ordinary user", async () => {

        //const currentUser = currentUserFixtures.adminUser;
        const currentUser = currentUserFixtures.userOnly;
        const testId = "DriverAvailabilityTable";

        render(
            <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <DriverAvailabilityTable driverAvailabilities={driverAvailabilityFixtures.threeDriverAvailabilities} currentUser={currentUser} />
            </MemoryRouter>
            </QueryClientProvider>
    
        );
    
        await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1"); });
    
        
        expect(screen.queryByText("Delete")).not.toBeInTheDocument();
        expect(screen.queryByText("Edit")).not.toBeInTheDocument();
        
    });
    test("Delete button calls delete callback", async () => {
        // arrange
        const currentUser = currentUserFixtures.adminOnly;
        
        // act - render the component
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <DriverAvailabilityTable driverAvailabilities={driverAvailabilityFixtures.threeDriverAvailabilities} currentUser={currentUser} />
                </MemoryRouter>
            </QueryClientProvider>
        );
        const testId = "DriverAvailabilityTable"
        // assert - check that the expected content is rendered
        expect(await screen.findByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-notes`)).toHaveTextContent("just got my license");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-day`)).toHaveTextContent("Friday");
        
        const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();
        const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
        expect(editButton).toBeInTheDocument();
        
        // act - click the delete button
        fireEvent.click(deleteButton);
        expect(mockDeleteMutation).toHaveBeenCalled();
    });
});
