import React from 'react';
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
                <Col xs={12}>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="driverId">Driver ID</Form.Label>
                        <Form.Control
                            data-testid="DriverAvailabilityForm-driverId"
                            id="driverId"
                            type="number"
                            {...register("driverId", { required: true })}
                            isInvalid={Boolean(errors.driverId)}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.driverId && 'Driver ID is required.'}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>

                <Col xs={12}>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="day">Day</Form.Label>
                        <Form.Control
                            data-testid="DriverAvailabilityForm-day"
                            id="day"
                            type="text"
                            {...register("day", { required: true })}
                            isInvalid={Boolean(errors.day)}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.day && 'Day is required.'}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>

                <Col xs={6}>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="startTime">Start Time</Form.Label>
                        <Form.Control
                            data-testid="DriverAvailabilityForm-startTime"
                            id="startTime"
                            type="text"
                            {...register("startTime", { required: true })}
                            isInvalid={Boolean(errors.startTime)}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.startTime && 'Start Time is required.'}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>

                <Col xs={6}>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="endTime">End Time</Form.Label>
                        <Form.Control
                            data-testid="DriverAvailabilityForm-endTime"
                            id="endTime"
                            type="text"
                            {...register("endTime", { required: true })}
                            isInvalid={Boolean(errors.endTime)}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.endTime && 'End Time is required.'}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>

                <Col xs={12}>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="notes">Notes</Form.Label>
                        <Form.Control
                            data-testid="DriverAvailabilityForm-notes"
                            id="notes"
                            as="textarea"
                            rows={3}
                            {...register("notes")}
                        />
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Button type="submit" data-testid="DriverAvailabilityForm-submit">
                        {buttonLabel}
                    </Button>
                    <Button variant="Secondary" onClick={() => navigate(-1)} data-testid="DriverAvailabilityForm-cancel">
                        Cancel
                    </Button>
                </Col>
            </Row>
        </Form>
    );
}

export default DriverAvailabilityForm;
