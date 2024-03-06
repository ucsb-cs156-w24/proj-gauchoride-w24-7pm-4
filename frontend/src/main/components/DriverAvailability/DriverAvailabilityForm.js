import { Button, Form, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

function DriverAvailabilityForm({ initialContents, submitAction, buttonLabel = "Create" }) {
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm({ defaultValues: initialContents || {} });

    const navigate = useNavigate();

    return (
        <Form onSubmit={handleSubmit(submitAction)}>
            <Row>
                {initialContents && (
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="driverId">Driver ID</Form.Label>
                            <Form.Control
                                data-testid="DriverAvailabilityForm-driverId"
                                id="driverId"
                                type="text"
                                {...register("driverId")}
                                value={initialContents.driverId}
                                disabled
                            />
                        </Form.Group>
                    </Col>
                )}

                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="driverEmail">Driver Email</Form.Label>
                        <Form.Control
                            data-testid="DriverAvailabilityForm-driverEmail"
                            id="driverEmail"
                            type="email"
                            isInvalid={Boolean(errors.driverEmail)}
                            {...register("driverEmail", { required: true })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.driverEmail && 'Driver Email is required.'}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>

                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="dateAvailable">Start Date</Form.Label>
                        <Form.Control
                            data-testid="DriverAvailabilityForm-startDate"
                            id="startDate"
                            type="date"
                            isInvalid={Boolean(errors.startDate)}
                            {...register("startDate", { required: true })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.startDate && 'Start Date is required.'}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>

                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="endDate">End Date</Form.Label>
                        <Form.Control
                            data-testid="DriverAvailabilityForm-endDate"
                            id="endDate"
                            type="date"
                            isInvalid={Boolean(errors.endDate)}
                            {...register("endDate", { required: true })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.endDate && 'End Date is required.'}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Button
                        type="submit"
                        data-testid="DriverAvailabilityForm-submit"
                    >
                        {buttonLabel}
                    </Button>
                    <Button
                        variant="Secondary"
                        onClick={() => navigate(-1)}
                        data-testid="DriverAvailabilityForm-cancel"
                    >
                        Cancel
                    </Button>
                </Col>
            </Row>
        </Form>
    );
}

export default DriverAvailabilityForm;
