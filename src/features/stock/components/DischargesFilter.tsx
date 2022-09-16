import { Button, Card, CardBody, Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import { useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { changeDischargesFilter, dischargesFilterSelector, searchDischargesAsync } from "../stock-slice";
import CustomerSelect from "../../customer/components/CustomerSelect";
import { FormEvent, useEffect, useState } from "react";
import DateSelect2 from "../../../components/DateSelect2";
import ProductSelect from "../../customer/components/ProductSelect";
import DischargeDetailsForm from "./DischargeDetailsForm";

export default function DischargesFilter() {
    const dispatch = useAppDispatch();
    const filter = useAppSelector(dischargesFilterSelector);
    const [showAddNew, setShowAddNew] = useState(false);

    useEffect(() => {
        dispatch(searchDischargesAsync(filter));
    }, [])

    const handleFilterChange = (field: string, value: any) => {
        dispatch(changeDischargesFilter({ [field]: value }));
    }

    const handleCustomerChange = (customerId: string) => {
        handleFilterChange("customerId", customerId);
    }

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        dispatch(searchDischargesAsync(filter));
    }

    return <Card>
        <CardBody className="pb-0">
            <Form onSubmit={handleSearch}>
                <Row>
                    <Col>
                        <Row>
                            <Col>
                                <FormGroup row>
                                    <Label md="auto">Customer</Label>
                                    <Col>
                                        <CustomerSelect
                                            selectedValue={filter.customerId}
                                            onChange={handleCustomerChange} />
                                    </Col>
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup row>
                                    <Label md="auto">Product</Label>
                                    <Col>
                                        <ProductSelect
                                            selectedValue={filter.productId}
                                            onChange={(p) => handleFilterChange("productId", p)} />
                                    </Col>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <FormGroup row>
                                    <Label md="auto">Date Range</Label>
                                    <Col>
                                        <DateSelect2
                                            value={filter.from}
                                            isClearable
                                            onChange={(d) => handleFilterChange("from", d)}
                                            placeHolder="From" />
                                    </Col>
                                    <Col>
                                        <DateSelect2
                                            value={filter.to}
                                            isClearable
                                            onChange={(d) => handleFilterChange("to", d)}
                                            placeHolder="To" />
                                    </Col>
                                </FormGroup>
                            </Col>
                        </Row>
                    </Col>
                    <Col md="auto">
                        <Row>
                            <FormGroup>
                                <Col><Button color="secondary" className="w-100" onClick={() => setShowAddNew(true)} >New</Button></Col>
                            </FormGroup>
                        </Row>
                        <Row>
                            <FormGroup>
                                <Col><Button type="submit" color="primary" className="w-100">Search</Button></Col>
                            </FormGroup>
                        </Row>
                    </Col>
                </Row>
            </Form>
            <Modal isOpen={showAddNew} size="lg" toggle={() => setShowAddNew(false)} backdrop="static">
                <ModalHeader toggle={() => setShowAddNew(false)}>
                    New Discharge
                </ModalHeader>
                <ModalBody>
                    <DischargeDetailsForm customerId={filter.customerId} onUpdate={() => dispatch(searchDischargesAsync(filter))} />
                </ModalBody>
            </Modal>
        </CardBody>
    </Card>
}