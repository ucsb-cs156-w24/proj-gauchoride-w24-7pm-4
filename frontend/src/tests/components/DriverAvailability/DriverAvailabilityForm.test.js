import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import DriverAvailabilityForm from "main/components/DriverAvailability/DriverAvailabilityForm";
import { BrowserRouter as Router } from "react-router-dom";

const mockSubmitAction = jest.fn();
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

describe("DriverAvailabilityForm tests", () => {

    beforeEach(() => {
        mockSubmitAction.mockClear();
        mockNavigate.mockClear();
    });

    test("renders correctly", async () => {
        render(
            <Router>
                <DriverAvailabilityForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("DriverAvailabilityForm-driverId");
        await screen.findByTestId("DriverAvailabilityForm-day");
        await screen.findByTestId("DriverAvailabilityForm-startTime");
        await screen.findByTestId("DriverAvailabilityForm-endTime");
        await screen.findByTestId("DriverAvailabilityForm-notes");
        await screen.findByTestId("DriverAvailabilityForm-submit");
        await screen.findByTestId("DriverAvailabilityForm-cancel");
    });

    test("Correct Error messages for both missing and incorrect inputs", async () => {
        render(
            <Router>
                <DriverAvailabilityForm submitAction={mockSubmitAction} />
            </Router>
        );

        fireEvent.click(screen.getByTestId("DriverAvailabilityForm-submit"));

        await waitFor(() => {
            expect(screen.getByText("Driver ID is required.")).toBeInTheDocument();
            expect(screen.getByText("Day is required.")).toBeInTheDocument();
            expect(screen.getByText("Start Time is required.")).toBeInTheDocument();
            expect(screen.getByText("End Time is required.")).toBeInTheDocument();
        });


        fireEvent.change(screen.getByTestId("DriverAvailabilityForm-day"), { target: { value: 'jesday' } });
        fireEvent.change(screen.getByTestId("DriverAvailabilityForm-startTime"), { target: { value: '25:00AM' } });
        fireEvent.change(screen.getByTestId("DriverAvailabilityForm-endTime"), { target: { value: '13:60PM' } });

        fireEvent.click(screen.getByTestId("DriverAvailabilityForm-submit"));

        await waitFor(() => {
            expect(screen.getByText("Invalid day format. Please enter a valid day of the week.")).toBeInTheDocument();
            expect(screen.getAllByText("Invalid time format. Please enter a valid time (HH:MM AM/PM).").length).toBe(2); 
        });
    });

    test("No Error messages on good input and submitAction is called", async () => {
        render(
            <Router>
                <DriverAvailabilityForm submitAction={mockSubmitAction} />
            </Router>
        );

        fireEvent.change(screen.getByTestId("DriverAvailabilityForm-driverId"), { target: { value: '1' } });
        fireEvent.change(screen.getByTestId("DriverAvailabilityForm-day"), { target: { value: 'Monday' } });
        fireEvent.change(screen.getByTestId("DriverAvailabilityForm-startTime"), { target: { value: '09:00AM' } });
        fireEvent.change(screen.getByTestId("DriverAvailabilityForm-endTime"), { target: { value: '05:00PM' } });
        fireEvent.change(screen.getByTestId("DriverAvailabilityForm-notes"), { target: { value: 'free' } });

        fireEvent.click(screen.getByTestId("DriverAvailabilityForm-submit"));

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());
        expect(screen.queryByText("Driver ID is required.")).not.toBeInTheDocument();
        expect(screen.queryByText("Day is required.")).not.toBeInTheDocument();
        expect(screen.queryByText("Start Time is required.")).not.toBeInTheDocument();
        expect(screen.queryByText("End Time is required.")).not.toBeInTheDocument();
    });

    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <Router>
                <DriverAvailabilityForm submitAction={mockSubmitAction} />
            </Router>
        );

        fireEvent.click(screen.getByTestId("DriverAvailabilityForm-cancel"));
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith(-1));
    });

    test("button label defaults to 'Create' when not specified", async () => {
        render(
            <Router>
                <DriverAvailabilityForm submitAction={mockSubmitAction} />
            </Router>
        );
        expect(screen.getByTestId("DriverAvailabilityForm-submit")).toHaveTextContent("Create");
    });

    test("initializes form with initialContents", async () => {
        const initialContents = {
            driverId: '1',
            day: 'Monday',
            startTime: '09:00AM',
            endTime: '05:00PM',
            notes: 'free',
        };
        render(
            <Router>
                <DriverAvailabilityForm initialContents={initialContents} submitAction={mockSubmitAction} />
            </Router>
        );
        expect(screen.getByTestId("DriverAvailabilityForm-driverId")).toHaveValue(Number(initialContents.driverId));
        expect(screen.getByTestId("DriverAvailabilityForm-day")).toHaveValue(initialContents.day);
        expect(screen.getByTestId("DriverAvailabilityForm-startTime")).toHaveValue(initialContents.startTime);
        expect(screen.getByTestId("DriverAvailabilityForm-endTime")).toHaveValue(initialContents.endTime);
        expect(screen.getByTestId("DriverAvailabilityForm-notes")).toHaveValue(initialContents.notes);
    });

    test("initializes form without initialContents correctly", async () => {
        render(
            <Router>
                <DriverAvailabilityForm submitAction={mockSubmitAction} />
            </Router>
        );
        expect(screen.getByTestId("DriverAvailabilityForm-driverId").value).toBe("");
    });
});