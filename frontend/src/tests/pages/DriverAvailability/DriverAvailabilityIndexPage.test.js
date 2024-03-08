import { screen, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import DriverAvailabilityIndexPage from "main/pages/DriverAvailability/DriverAvailabilityIndexPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { driverAvailabilityFixtures } from "fixtures/driverAvailabilityFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

describe("DriverAvailabilityIndexPage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);
    const testId = "DriverAvailabilityTable";
    const setupUserOnly = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };
    const setupAdminUser = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };
    const setupDriverOnly = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.driverOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    test("renders without crashing for regular user", () => {
        setupUserOnly();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/driverAvailability/all").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <DriverAvailabilityIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const createDriverAvailabilityButton = screen.getByText("Create Driver Availability");
        expect(createDriverAvailabilityButton).toBeInTheDocument();
        expect(createDriverAvailabilityButton).toHaveAttribute("style", "float: right;");

    });

    test("renders without crashing for driver", () => {
        setupDriverOnly();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/driverAvailability/all").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <DriverAvailabilityIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const createDriverAvailabilityButton = screen.getByText("Create Driver Availability");
        expect(createDriverAvailabilityButton).toBeInTheDocument();
        expect(createDriverAvailabilityButton).toHaveAttribute("style", "float: right;");
    });

    test("renders without crashing for admin user", () => {
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/driverAvailability/admin/all").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <DriverAvailabilityIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        const createRideButton = screen.getByText("Create Driver Availability");
        expect(createRideButton).toBeInTheDocument();
        expect(createRideButton).toHaveAttribute("style", "float: right;");
    });

    
    test("renders driver availabilities without crashing for user", async () => {
        setupUserOnly();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/driverAvailability/all").reply(200, driverAvailabilityFixtures.threeDriverAvailabilities);

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <DriverAvailabilityIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByText("Driver Availabilities")).toBeInTheDocument();
            expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
            expect(getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
        });
    });
    test("renders driver availabilities without crashing for driver", async () => {
        setupDriverOnly();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/driverAvailability/all").reply(200, driverAvailabilityFixtures.threeDriverAvailabilities);

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <DriverAvailabilityIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByText("Driver Availabilities")).toBeInTheDocument();
            expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
            expect(getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
        });
    });

    test("renders three rides without crashing for admin user", async () => {
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/driverAvailability/admin/all").reply(200, driverAvailabilityFixtures.threeDriverAvailabilities);

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <DriverAvailabilityIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByText("Driver Availabilities")).toBeInTheDocument();
            expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
            expect(getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
        });

    });

    test("renders empty table when backend unavailable, user only", async () => {
        setupUserOnly();

        const queryClient = new QueryClient();
        axiosMock.onGet("/api/ride_request/all").timeout();

        const restoreConsole = mockConsole();

        const { queryByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <DriverAvailabilityIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });
        //console.debug(axiosMock.history);
        ///console.debug(console.error.mock);
        //const errorMessage = console.error.mock.calls[0][0];
        
        //expect(errorMessage).toMatch("Error communicating with backend via GET on /api/ride_request/all");
        restoreConsole();

        expect(queryByTestId(`${testId}-cell-row-0-col-id`)).not.toBeInTheDocument();
    });

});

