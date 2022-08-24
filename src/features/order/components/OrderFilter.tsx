import { Button, Card, CardBody, Col, Form, FormGroup, FormText, Input, Label, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import { useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { changeOrderFilter, orderFilterSelector } from "../order-slice";
import CustomerSelect from "../../customer/components/CustomerSelect";
import { FormEvent, useEffect, useState } from "react";
import DateSelect2 from "../../../components/DateSelect2";
import OrderStatusSplitButton from "./OrderStatusSplitButton";
import ProductSelect from "../../customer/components/ProductSelect";
import OrderDetailsForm from "./OrderDetailsForm";

export default function OrderFilter() {
    const dispatch = useAppDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const filter = useAppSelector(orderFilterSelector);
    const [showAddNew, setShowAddNew] = useState(false);

    useEffect(() => {
        const customerId = searchParams.get("customerId");
        customerId && handleCustomerChange(customerId);
    }, [])

    const handleFilterChange = (field: string, value: any) => {
        dispatch(changeOrderFilter({ [field]: value }));
    }

    const handleCustomerChange = (customerId: string) => {
        handleFilterChange("customerId", customerId);
        setSearchParams({ customerId });
    }

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        console.log(filter);
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
                                            onChange={(e) => handleFilterChange("productId", e)} />
                                    </Col>
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup row>
                                    <Label md="auto">Order No.</Label>
                                    <Col>
                                        <Input
                                            value={filter.orderNo}
                                            onChange={(e) => handleFilterChange("orderNo", e.target.value)} />
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
                            <Col>
                                <FormGroup>
                                    <Label className="me-4">Status</Label>
                                    <OrderStatusSplitButton
                                        showAllOption
                                        value={filter.status}
                                        onChange={(status) => handleFilterChange("status", status)} />
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
            <Modal isOpen={showAddNew} size="xl" toggle={() => setShowAddNew(false)} backdrop="static">
                <ModalHeader toggle={() => setShowAddNew(false)}>
                    New Order
                </ModalHeader>
                <ModalBody>
                    <OrderDetailsForm />
                </ModalBody>
            </Modal>
        </CardBody>
    </Card>
}