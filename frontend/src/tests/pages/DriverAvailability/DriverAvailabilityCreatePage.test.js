import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import DriverAvailabilityCreatePage from "main/pages/DriverAvailability/DriverAvailabilityCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("DriverAvailabilityCreatePage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
    });

    test("renders without crashing", () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <DriverAvailabilityCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();
        const driverAvailability = {
            id: 1,
            driverId: '1',
            day: 'Friday',
            startTime: '09:00',
            endTime: '17:00',
            notes: 'free all day'
        };

        axiosMock.onPost("/api/DriverAvailability/new").reply(202, driverAvailability);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <DriverAvailabilityCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId("DriverAvailabilityForm-driverId")).toBeInTheDocument();
        });

        const driverIdField = screen.getByTestId("DriverAvailabilityForm-driverId");
        const dayField = screen.getByTestId("DriverAvailabilityForm-day");
        const startTimeField = screen.getByTestId("DriverAvailabilityForm-startTime");
        const endTimeField = screen.getByTestId("DriverAvailabilityForm-endTime");
        const notesField = screen.getByTestId("DriverAvailabilityForm-notes");
        const submitButton = screen.getByTestId("DriverAvailabilityForm-submit");

        fireEvent.change(driverIdField, { target: { value: '1' } });
        fireEvent.change(dayField, { target: { value: 'Friday' } });
        fireEvent.change(startTimeField, { target: { value: '09:00' } });
        fireEvent.change(endTimeField, { target: { value: '17:00' } });
        fireEvent.change(notesField, { target: { value: 'free all day' } });

        expect(submitButton).toBeInTheDocument();
        fireEvent.click(submitButton);
        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));
        expect(axiosMock.history.post[0].params).toEqual({
            driverId: '1',
            day: 'Friday',
            startTime: '09:00',
            endTime: '17:00',
            notes: 'free all day'
        });

        expect(mockToast).toBeCalledWith("New Driver Availability Created - id: 1 for driverId: 1");
        expect(mockNavigate).toBeCalledWith({ "to": "/DriverAvailability" });
    });
});
