import { Button, Card, CardBody, Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import { useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { changeEntryFilter, entryFilterSelector, searchEntriesAsync } from "../entry-slice";
import CustomerSelect from "../../customer/components/CustomerSelect";
import { FormEvent, useEffect, useState } from "react";
import DateSelect2 from "../../../components/DateSelect2";
import EntryDetailsForm from "./EntryDetailsForm";
import ProductSelect from "../../customer/components/ProductSelect";
import { ThreewaySplitButton } from "../../../components/ThreewaySplitButton";

export default function EntryFilter() {
    const dispatch = useAppDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const filter = useAppSelector(entryFilterSelector);
    const [showAddNew, setShowAddNew] = useState(false);

    useEffect(() => {
        const customerId = searchParams.get("customerId");
        customerId && handleCustomerChange(customerId);
        dispatch(searchEntriesAsync(customerId ? { ...filter, customerId } : filter));
    }, [])

    const handleFilterChange = (field: string, value: any) => {
        dispatch(changeEntryFilter({ [field]: value }));
    }

    const handleCustomerChange = (customerId: string) => {
        handleFilterChange("customerId", customerId);
        setSearchParams({ customerId });
    }

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        dispatch(searchEntriesAsync(filter));
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
                            <Col>
                                <FormGroup row>
                                    <Label md="auto">Entry No</Label>
                                    <Col>
                                        <Input type="text"
                                            value={filter.entryNo}
                                            onChange={(e) => handleFilterChange("entryNo", e.target.value)} />
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
                            <Col md={4}>
                                <FormGroup row>
                                    <Label md="auto">To Bond No</Label>
                                    <Col>
                                        <Input type="text"
                                            value={filter.toBondNo}
                                            onChange={(e) => handleFilterChange("toBondNo", e.target.value)} />
                                    </Col>
                                </FormGroup>
                            </Col>
                            <Col md="auto">
                                <FormGroup>
                                    <ThreewaySplitButton
                                        allLabel="All"
                                        trueLabel="Active"
                                        falseLabel="Completed"
                                        selectedValue={filter.active}
                                        onChange={(val) => handleFilterChange("active", val)}
                                    />
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
                    New Entry
                </ModalHeader>
                <ModalBody>
                    <EntryDetailsForm
                        onUpdate={() => dispatch(searchEntriesAsync(filter))}
                        onDelete={() => {
                            dispatch(searchEntriesAsync(filter));
                            setShowAddNew(false);
                        }}
                    />
                </ModalBody>
            </Modal>
        </CardBody>
    </Card>
}