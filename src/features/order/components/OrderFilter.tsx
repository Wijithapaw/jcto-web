import { Button, Card, CardBody, Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { changeOrderFilter, orderFilterSelector, searchOrdersAsync } from "../order-slice";
import CustomerSelect from "../../customer/components/CustomerSelect";
import { FormEvent, useEffect, useState } from "react";
import DateSelect2 from "../../../components/DateSelect2";
import OrderStatusSelect from "./OrderStatusSelect";
import ProductSelect from "../../customer/components/ProductSelect";
import OrderDetailsForm from "./OrderDetailsForm";
import BuyerTypeSelect from "./BuyerTypeSelect";
import { useSearchParams } from "react-router-dom";
import AppIcon from "../../../components/AppIcon";
import { orderApi } from "../order-api";
import { NotificationType } from "../../../app/types";
import { showNotification } from "../../../app/notification-service";

export default function OrderFilter() {
    const dispatch = useAppDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const filter = useAppSelector(orderFilterSelector);
    const [showAddNew, setShowAddNew] = useState(false);
    const [approvalId, setApprovalId] = useState<string>();

    useEffect(() => {
        const apprId = searchParams.get("approvalId");
        if (apprId) {
            setApprovalId(apprId);
            setShowAddNew(true);

            searchParams.delete("approvalId");
            setSearchParams(searchParams);
        }
        dispatch(searchOrdersAsync(filter));
    }, [])

    const handleFilterChange = (field: string, value: any) => {
        dispatch(changeOrderFilter({ [field]: value }));
    }

    const handleCustomerChange = (customerId: string) => {
        handleFilterChange("customerId", customerId);
    }

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();

        handleFilterChange('page', 1);
        dispatch(searchOrdersAsync({ ...filter, page: 1 }));
    }

    const refreshList = () => {
        dispatch(searchOrdersAsync(filter));
    }

    const downloadReport = () => {
        orderApi.downloadOrdersReport(filter).then(() => {
            showNotification(NotificationType.success, `Orders report downloaded`);
        })
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
                            <Col>
                                <FormGroup row>
                                    <Label md="auto">Status</Label>
                                    <Col>
                                        <OrderStatusSelect
                                            showAllOption
                                            value={filter.status}
                                            onChange={(status) => handleFilterChange("status", status)} />
                                    </Col>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
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
                                <FormGroup row>
                                    <Label md="auto">Buyer Type</Label>
                                    <Col>
                                        <BuyerTypeSelect
                                            showAllOption
                                            value={filter.buyerType}
                                            onChange={(b) => handleFilterChange("buyerType", b)} />
                                    </Col>
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup row>
                                    <Label md="auto">Buyer</Label>
                                    <Col>
                                        <Input
                                            value={filter.buyer}
                                            onChange={(e) => handleFilterChange("buyer", e.target.value)} />
                                    </Col>
                                </FormGroup>
                            </Col>
                            <Col xs="auto" className="pt-2">
                                <AppIcon mode="button"
                                    icon="download"
                                    onClick={downloadReport}
                                    className="text-primary"
                                    title="Download Orders Report" />
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
            <Modal isOpen={showAddNew} size="xl"
                toggle={() => {
                    setShowAddNew(false);
                    setApprovalId(undefined)
                }}
                backdrop="static">
                <ModalHeader toggle={() => {
                    setShowAddNew(false);
                    setApprovalId(undefined);
                }}>
                    New Order
                </ModalHeader>
                <ModalBody>
                    <OrderDetailsForm onUpdate={refreshList}
                        approvalId={approvalId}
                        onDelete={() => {
                            refreshList();
                            setShowAddNew(false);
                        }} />
                </ModalBody>
            </Modal>
        </CardBody>
    </Card>
}