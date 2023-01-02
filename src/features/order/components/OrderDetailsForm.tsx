import { useEffect, useMemo, useState } from "react";
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { dateHelpers, numbersHelpers, validationHelpers } from "../../../app/helpers";
import FormLabel from "../../../components/FormLabel";
import DateSelect2 from "../../../components/DateSelect2";
import ProductSelect from "../../customer/components/ProductSelect";
import CustomerSelect from "../../customer/components/CustomerSelect";
import { showNotification } from "../../../app/notification-service";
import { NotificationType } from "../../../app/types";
import { BowserEntry, BuyerType, Order, OrderStatus, OrderStockReleaseEntry } from "../types";
import OrderStatusSelect from "./OrderStatusSelect";
import BuyerTypeSelect from "./BuyerTypeSelect";
import StockReleaseEntriesTable from "./StockReleaseEntriesTable";
import BowserDetailsTable from "./BowserDetailsTable";
import { orderApi } from "../order-api";
import AppIcon from "../../../components/AppIcon";
import { useAppSelector } from "../../../app/hooks";
import { customerListItemsSelector } from "../../customer/customer-slice";
import { entryApi } from "../../entry/entry-api";
import { EntryApprovalSummary } from "../../entry/types";
import { v4 as uuidv4 } from 'uuid';
import OrderStatusIcon from "./OrderStatusIcon";
import AuditInfo from "../../../components/AuditInfo";

interface Props {
    orderId?: string;
    onUpdate?: () => void;
    onDelete?: () => void;
    approvalId?: string;
}

export default function OrderDetailsForm({ orderId, onUpdate, onDelete, approvalId }: Props) {
    const [editingOrderId, setEditingOrderId] = useState(orderId);
    const [editingOrder, setEditingOrder] = useState<Order>();
    const [nextOrderNo, setNextOrderNo] = useState<number>();
    const [approval, setApproval] = useState<EntryApprovalSummary>();

    const customers = useAppSelector(customerListItemsSelector);

    const isNewOrder = () => !editingOrderId;

    useEffect(() => {
        if (isNewOrder()) {
            orderApi.getNextOrderNo(dateHelpers.toIsoString(new Date())).then((val) => setNextOrderNo(val));
        }
    }, [])

    useEffect(() => {
        if (isNewOrder() && approvalId) {
            entryApi.getApprovalSummary(approvalId)
                .then((approval) => {
                    setApproval(approval);
                });
        }
    }, [approvalId])

    useEffect(() => {
        setEditingOrderId(orderId);
    }, [orderId]);

    useEffect(() => {
        loadEditingOrder();
    }, [editingOrderId])

    const loadEditingOrder = () => {
        editingOrderId && orderApi.getOrder(editingOrderId)
            .then(order => setEditingOrder(order));
    }

    const creatObPrefix = (customerId: string) => {
        const customer = customers.find(c => c.id == customerId);
        if (customer) {
            const year = new Date().getFullYear();
            var obPrefix = `${customer.label}/${year}`;
            return obPrefix;
        }
        return '';
    }

    const refreshCustomerObPrefix = (customerId: string, setValues: any) => {
        if (isNewOrder()) {
            setValues('obRefPrefix', creatObPrefix(customerId))
        }
    }

    const refreshNextOrderNo = (date: string, setValues: any) => {
        if (isNewOrder()) {
            orderApi.getNextOrderNo(date).then((val) => setValues('orderNo', val));
        }
    }

    const downloadStockRelease = () => {
        const fileName = `StockRelease_${dateHelpers.dateFormat(order.orderDate, 'YYYY_MM_DD')}_${order.orderNo}`;
        orderApi.downloadStockRelease(editingOrderId!, fileName).then(() => {
            showNotification(NotificationType.success, `Stock release downloaded`);
        })
    }

    const downloadPDDocument = () => {
        const fileName = `PDDocument_${dateHelpers.dateFormat(order.orderDate, 'YYYY_MM_DD')}_${order.orderNo}`;
        orderApi.downloadPDDocument(editingOrderId!, fileName).then(() => {
            showNotification(NotificationType.success, `PD document downloaded`);
        })
    }

    const handleDelete = () => {
        if (editingOrder && window.confirm("Are you sure you want to delete the order? This action is not reversible.")) {
            orderApi.deleteOrder(editingOrderId!)
                .then(() => {
                    showNotification(NotificationType.success, "Order deleted");
                    onDelete && onDelete();
                })
        }
    }

    const handleCancel = () => {
        if (editingOrder && window.confirm("Are you sure you want to cancel the order? This action is not reversible.")) {
            orderApi.cancelOrder(editingOrderId!)
                .then(() => {
                    showNotification(NotificationType.success, "Order canceled");
                    setEditingOrder({ ...editingOrder, status: OrderStatus.Cancelled });
                    onUpdate && onUpdate();
                })
        }
    }

    const validationSchema = useMemo(() => {
        return Yup.object().shape({
            orderDate: Yup.string().required('is required'),
            productId: Yup.string().required('is required'),
            customerId: Yup.string().required('is required'),
            buyer: Yup.string().required('is required').max(100, "length must be < 100"),
            obRefPrefix: Yup.string().required('is required').max(20, "length must be < 20"),
            tankNo: Yup.string()
                .required('is required')
                .max(20, "length must be < 20")
                .test('Digits only', 'must have only digits', validationHelpers.digitsOnly),
            orderNo: Yup.number()
                .required('is required').min(1, 'must be > 0'),
            quantity: Yup.number()
                .required('is required')
                .test('dd', 'must be > 0', (value) => (value || 0) > 0),
            releaseEntries: Yup.array()
                .test('NotEmpty', 'must have entries', (items) => items && items.length > 0 || false)
                .test('FillAll', 'must fill all required fields',
                    (items, ctx) => items ? items.every((i: OrderStockReleaseEntry) => {
                        const valid = i.entryNo && i.quantity > 0 && i.approvalId
                            && (ctx.parent.status === OrderStatus.Undelivered || i.deliveredQuantity != undefined)
                        return valid;
                    }) : false)
                .test('DeliveredQuantityLessThanQuantity', 'Delivered Quantities must be <= Quantity',
                    (items) => items ? items.every((i: OrderStockReleaseEntry) => (i.quantity >= (i.deliveredQuantity || 0))) : false)
                .test('Summation', 'Sum of release quantities does not tally with overall quantity',
                    (items, ctx) => {
                        const entrySum = numbersHelpers.sanitize(items && items.map(i => i.quantity).reduce((a, b) => a + b, 0) || 0);
                        return ctx.parent.quantity === entrySum;
                    }),
            bowserEntries: Yup.array()
                .test('RequiredWhenLocal', 'must have entries',
                    (items, ctx) => {
                        if (ctx.parent.buyerType === BuyerType.Bowser) {
                            return items && items.length > 0 || false
                        }
                        return true;
                    })
                .test('FillAll', 'must fill all the fields',
                    (items, ctx) => {
                        if (ctx.parent.buyerType === BuyerType.Bowser) {
                            const isValid = items ? (items.every((i: BowserEntry) => (i.capacity > 0 && i.count > 0))) : false;
                            return isValid;
                        }
                        return true;
                    }),
            issueStartTime: Yup.string().nullable()
                .when("status", {
                    is: OrderStatus.Delivered,
                    then: Yup.string().required('is required').nullable()
                }),
            issueEndTime: Yup.string().nullable()
                .when("status", {
                    is: OrderStatus.Delivered,
                    then: Yup.string().required('is required').nullable()
                })
        });
    }, [])

    const order = useMemo(() => {
        if (editingOrder) {
            return editingOrder;
        } else {
            const newOrder: Order = {
                orderDate: dateHelpers.toIsoString(new Date()),
                productId: '',
                customerId: '',
                orderNo: nextOrderNo,
                tankNo: '',
                quantity: 0,
                buyer: '',
                obRefPrefix: '',
                deliveredQuantity: undefined,
                buyerType: BuyerType.Barge,
                releaseEntries: [],
                status: OrderStatus.Undelivered,
                bowserEntries: [],
                taxPaid: false,
                remarks: '',
            };

            if (approval) {
                newOrder.customerId = approval.customerId;
                newOrder.productId = approval.productId;
                newOrder.obRefPrefix = creatObPrefix(approval.customerId);
                newOrder.releaseEntries = [{
                    approvalId: approval.approvalId,
                    entryNo: approval.tobondNo,
                    id: uuidv4(),
                    obRef: '',
                    quantity: 0
                }]
            }

            return newOrder;
        }
    }, [editingOrder, nextOrderNo, approval]);

    return <Formik
        initialValues={{ ...order }}
        enableReinitialize
        onSubmit={(values, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            const editingOrder: Order = { ...values };
            const promise = isNewOrder() ? orderApi.createOrder(editingOrder) : orderApi.updateOrder(editingOrderId!, editingOrder);
            promise.then((res) => {
                showNotification(NotificationType.success, `Order ${isNewOrder() ? 'Created' : 'Updated'} successfully`);
                isNewOrder() ? setEditingOrderId(res.id) : loadEditingOrder();
                onUpdate && onUpdate();
            }).finally(() => setSubmitting(false));
        }}
        validationSchema={validationSchema}>
        {
            ({ errors, dirty, touched, handleSubmit, values, setFieldValue, resetForm, setFieldTouched, validateForm, isSubmitting }) => {
                var disabled = editingOrder && (editingOrder.status !== OrderStatus.Undelivered);
                return (
                    <Form onSubmit={e => {
                        e.preventDefault();
                        handleSubmit();
                    }}>
                        <Row>
                            <Col md={3}>
                                <FormGroup>
                                    <FormLabel label="Date" touched={touched.orderDate} error={errors.orderDate} />
                                    <DateSelect2 disabled={disabled} value={values.orderDate}
                                        onChange={(d) => {
                                            setFieldValue('orderDate', d);
                                            refreshNextOrderNo(d, setFieldValue);
                                        }} />
                                </FormGroup>
                            </Col>
                            <Col md={2}>
                                <FormGroup>
                                    <FormLabel label="Order No." touched={touched.orderNo} error={errors.orderNo} />
                                    <Input type="number" disabled={disabled} value={values.orderNo} onChange={(e) => setFieldValue('orderNo', e.target.value)} />
                                </FormGroup>
                            </Col>
                            <Col md={3}>
                                <FormGroup>
                                    <FormLabel label="Customer" touched={touched.customerId} error={errors.customerId} />
                                    <CustomerSelect disabled={disabled} selectedValue={values.customerId}
                                        onChange={(c) => {
                                            refreshCustomerObPrefix(c, setFieldValue);
                                            setFieldValue('customerId', c);
                                        }} />
                                </FormGroup>
                            </Col>
                            <Col md={2}>
                                <FormGroup>
                                    <FormLabel label="Product" touched={touched.productId} error={errors.productId} />
                                    <ProductSelect disabled={disabled} selectedValue={values.productId} onChange={(p) => setFieldValue('productId', p)} />
                                </FormGroup>
                            </Col>
                            <Col md={2}>
                                <FormGroup>
                                    <FormLabel label="Quantity" touched={touched.quantity} error={errors.quantity} />
                                    <Input type="number" step="0.001" disabled={disabled} value={values.quantity} onChange={(e) => setFieldValue('quantity', e.target.value)} />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={2}>
                                <FormGroup>
                                    <FormLabel label="OB Prefix" touched={touched.obRefPrefix} error={errors.obRefPrefix} />
                                    <Input disabled={disabled} maxLength={20} value={values.obRefPrefix} onChange={(e) => setFieldValue('obRefPrefix', e.target.value)} />
                                </FormGroup>
                            </Col>
                            <Col md={2}>
                                <FormGroup>
                                    <FormLabel label="Tank No." touched={touched.tankNo} error={errors.tankNo} />
                                    <Input disabled={disabled} maxLength={20} value={values.tankNo} onChange={(e) => setFieldValue('tankNo', e.target.value)} />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <FormLabel label="Buyer Type" />
                                    <br />
                                    <BuyerTypeSelect
                                        disabled={disabled}
                                        value={values.buyerType}
                                        onChange={(s) => {
                                            setFieldValue('bowserEntries', []);
                                            setFieldValue('buyerType', s);
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={2}>
                                <FormGroup>
                                    <FormLabel label="Buyer" touched={touched.buyer} error={errors.buyer} />
                                    <Input disabled={disabled} maxLength={100} value={values.buyer} onChange={(e) => { setFieldValue('buyer', e.target.value); }} />
                                </FormGroup>
                            </Col>
                            <Col>
                                {!isNewOrder() &&
                                    <FormGroup>
                                        <FormLabel label="Status" touched={touched.status} error={errors.status} />
                                        <OrderStatusIcon status={values.status} />
                                        <br />
                                        <OrderStatusSelect
                                            hideCancelled={values.status != OrderStatus.Cancelled}
                                            disabled={editingOrder?.status === OrderStatus.Cancelled}
                                            value={values.status}
                                            onChange={(s) => {
                                                if (s === OrderStatus.Undelivered && values.releaseEntries) {
                                                    var entries = [...values.releaseEntries]
                                                    entries.forEach(e => e.deliveredQuantity = 0);
                                                    setFieldTouched('releaseEntries')
                                                    setFieldValue('releaseEntries', entries);
                                                    setFieldValue('deliveredQuantity', undefined);
                                                    setFieldValue('issueStartTime', undefined);
                                                    setFieldValue('issueEndTime', undefined);
                                                }
                                                setFieldValue('status', s);
                                            }}
                                        />
                                    </FormGroup>
                                }
                            </Col>
                            <Col md={2}>
                                {values.status === OrderStatus.Delivered &&
                                    <FormGroup>
                                        <FormLabel label="Delivered Quantity" />
                                        <Input type="number"
                                            step="0.0001"
                                            disabled
                                            value={values.deliveredQuantity || 0} />
                                    </FormGroup>}
                            </Col>
                        </Row>
                        {values.status === OrderStatus.Delivered &&
                            <Row>
                                <Col>
                                    <FormGroup>
                                        <FormLabel label="Issuing Commenced Time" touched={touched.issueStartTime} error={errors.issueStartTime} />
                                        <DateSelect2 disabled={disabled} value={values.issueStartTime} timeSelect
                                            onChange={(d) => {
                                                setFieldValue('issueStartTime', d);
                                            }} />
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup>
                                        <FormLabel label="Issuing Completed Time" touched={touched.issueEndTime} error={errors.issueEndTime} />
                                        <DateSelect2 disabled={disabled} value={values.issueEndTime} timeSelect
                                            onChange={(d) => {
                                                setFieldValue('issueEndTime', d);
                                            }} />
                                    </FormGroup>
                                </Col>
                            </Row>
                        }
                        <Row>
                            <Col>
                                <FormGroup>
                                    <StockReleaseEntriesTable
                                        orderId={editingOrderId}
                                        showDeliveredQty={values.status === OrderStatus.Delivered}
                                        disabled={disabled}
                                        touched={touched.releaseEntries}
                                        error={errors.releaseEntries}
                                        items={values.releaseEntries}
                                        onChange={(e) => {
                                            setFieldTouched('releaseEntries')
                                            setFieldValue('releaseEntries', e);

                                            var delQty = numbersHelpers.sanitize(e.map(i => i.deliveredQuantity || 0).reduce((a, b) => a + b, 0));
                                            setFieldValue('deliveredQuantity', delQty);
                                        }} 
                                        orderVersion={editingOrder?.concurrencyKey || ''} />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            {values.buyerType == BuyerType.Bowser &&
                                <Col>
                                    <FormGroup>
                                        <BowserDetailsTable
                                            disabled={disabled}
                                            touched={touched.bowserEntries}
                                            error={errors.bowserEntries}
                                            items={values.bowserEntries}
                                            onChange={(e) => {
                                                setFieldTouched('bowserEntries')
                                                setFieldValue('bowserEntries', e);
                                            }} />
                                    </FormGroup>
                                </Col>}
                            <Col>
                                <FormGroup>
                                    <FormLabel label="Remarks" />
                                    <Input disabled={disabled} type="textarea" value={values.remarks} onChange={(e) => setFieldValue('remarks', e.target.value)} />
                                </FormGroup>
                                <FormGroup check>
                                    <Label for="cbxTaxPaid">Tax Paid</Label>
                                    <Input id="cbxTaxPaid"
                                        type="checkbox"
                                        checked={values.taxPaid}
                                        disabled={disabled}
                                        onChange={(e) => setFieldValue("taxPaid", e.target.checked)} />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <FormGroup>
                                    {editingOrder && !disabled && <Button type="button" className="me-2" color="danger" onClick={handleDelete}>Delete</Button>}
                                    {editingOrder && !disabled && <Button type="button" className="me-2" color="warning" onClick={handleCancel}>Cancel</Button>}
                                    <Button type="button" disabled={!dirty} onClick={() => resetForm()}>Reset</Button>
                                    <Button type="submit"
                                        disabled={isSubmitting
                                            || (editingOrder?.status == OrderStatus.Cancelled)
                                            || (values.status == OrderStatus.Delivered && editingOrder?.status == OrderStatus.Delivered)}
                                        className="ms-2" color="primary">Save</Button>
                                    {editingOrder && <AuditInfo id="order-audit-info" value={editingOrder} />}
                                </FormGroup>
                            </Col>
                            <Col className="text-end">
                                <FormGroup>
                                    <Button type="button" className="ms-2" color="link" onClick={downloadStockRelease}>
                                        <AppIcon mode="button" icon="download" className="me-2" />
                                        Stock Release
                                    </Button>
                                    <Button type="button" className="ms-2" color="link" onClick={downloadPDDocument}>
                                        <AppIcon mode="button" icon="download" className="me-2" />
                                        PD Document
                                    </Button>
                                </FormGroup>
                            </Col>
                        </Row>
                    </Form>
                )
            }
        }
    </Formik> || null;
}