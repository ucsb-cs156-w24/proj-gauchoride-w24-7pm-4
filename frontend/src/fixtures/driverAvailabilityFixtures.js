const driverAvailabilityFixtures = {
    oneDriverAvailability:
    [
        {
            "id": 1,
            "driverId": 14,
            "day": "Friday",
            "startTime": "09:00AM",
            "endTimeString": "10:00AM",
            "notes": "energized in morning"
        }
    ],

    threeDriverAvailabilities: [
        {
            "id": 1,
            "driverId": 14,
            "day": "Friday",
            "startTime": "09:00AM",
            "endTimeString": "10:00AM",
            "notes": "just got my license"
        },
        {
            "id": 2,
            "driverId": 3,
            "day": "Monday",
            "startTime": "1:PM",
            "endTimeString": "3PM",
            "notes": "tired in morning"
        },
        {
            "id": 3,
            "driverId": 7,
            "day": "Wednesday",
            "startTime": "09:00AM",
            "endTimeString": "5:00PM",
            "notes": "not sober"
        },
    ]
}

export default driverAvailabilityFixtures;
export { driverAvailabilityFixtures };