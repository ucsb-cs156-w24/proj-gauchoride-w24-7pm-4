import { fireEvent, screen, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import DriverAvailabilityIndexPage from "main/pages/DriverAvailability/DriverAvailabilityIndexPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { driverAvailabilityFixtures } from "fixtures/driverAvailabilityFixtures";
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
    };

    const setupAdminUser = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
    };

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

        const createDriverAvailabilityButton = screen.getByText("Create Driver Availability");
        expect(createDriverAvailabilityButton).toBeInTheDocument();
        expect(createDriverAvailabilityButton).toHaveAttribute("style", "float: right;");
    });

    test("renders driver availabilities without crashing for admin user", async () => {
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

    test("renders empty table when backend unavailable, admin user", async () => {
        setupAdminUser();

        const queryClient = new QueryClient();
        axiosMock.onGet("/api/driverAvailability/admin/all").timeout();

        const restoreConsole = mockConsole();

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <DriverAvailabilityIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });
        restoreConsole();

        expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    });
});
