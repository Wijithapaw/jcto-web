import { useEffect, useMemo, useState } from "react";
import { Button, Col, Form, FormGroup, Input, Row } from "reactstrap";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { dateHelpers, validationHelpers } from "../../../app/helpers";
import FormLabel from "../../../components/FormLabel";
import DateSelect2 from "../../../components/DateSelect2";
import ProductSelect from "../../customer/components/ProductSelect";
import CustomerSelect from "../../customer/components/CustomerSelect";
import { showNotification } from "../../../app/notification-service";
import { NotificationType } from "../../../app/types";
import { BowserEntry, BuyerType, Order, OrderStatus, OrderStockReleaseEntry } from "../types";
import OrderStatusSplitButton from "./OrderStatusSplitButton";
import BuyerTypeSplitButton from "./BuyerTypeSplitButton";
import StockReleaseEntriesTable from "./StockReleaseEntriesTable";
import BowserDetailsTable from "./BowserDetailsTable";
import { orderApi } from "../order-api";

interface Props {
    orderId?: string;
}

export default function OrderDetailsForm({ orderId }: Props) {
    const [editingOrderId, setEditingOrderId] = useState(orderId);
    const [editingOrder, setEditingOrder] = useState<Order>();

    useEffect(() => {
        setEditingOrderId(orderId);
    }, [orderId]);

    useEffect(() => {
        editingOrderId && orderApi.getOrder(editingOrderId)
            .then(order => setEditingOrder(order));
    }, [editingOrderId])

    const isNewOrder = () => !editingOrderId;

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
            orderNo: Yup.string()
                .required(' is required')
                .max(20, "length must be < 20")
                .test('Digits only', 'must have only digits', validationHelpers.digitsOnly),
            quantity: Yup.number()
                .required(' is required')
                .test('dd', ' must be > 0', (value) => (value || 0) > 0),
            releaseEntries: Yup.array()
                .test('NotEmpty', 'must have entries', (items) => items && items.length > 0 || false)
                .test('FillAll', 'must fill all the fields',
                    (items) => items ? items.every((i: OrderStockReleaseEntry) => {
                        var valid = i.entryNo && i.obRef && i.quantity > 0 && i.deliveredQuantity > 0
                        return valid;
                    }) : false)
                .test('DeliveredQuantityLessThanQuantity', 'Delivered Quantities must be <= Quantity',
                    (items) => items ? items.every((i: OrderStockReleaseEntry) => (i.quantity >= i.deliveredQuantity)) : false)
                .test('Summation', 'Sum of delivered quantities does not tally with overall quantity',
                    (items, ctx) => {
                        const entrySum = +items?.map(i => i.deliveredQuantity).reduce((a, b) => a + b, 0) || 0;
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
                orderNo: '',
                tankNo: '',
                quantity: 0,
                buyer: '',
                obRefPrefix: '',
                buyerType: BuyerType.Barge,
                releaseEntries: [],
                status: OrderStatus.Undelivered,
                bowserEntries: [],
            };
            return newOrder;
        }
    }, [editingOrder]);

    return order && <Formik
        initialValues={{ ...order }}
        enableReinitialize
        onSubmit={(values, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            const editingOrder: Order = { ...values };
            const promise = isNewOrder() ? orderApi.createOrder(editingOrder) : orderApi.updateOrder(editingOrderId!, editingOrder);
            promise.then((res) => {
                showNotification(NotificationType.success, `Order ${isNewOrder() ? 'Created' : 'Updated'} successfully`);
                isNewOrder() ? setEditingOrderId(res.id)
                    : setEditingOrder({ ...editingOrder, concurrencyKey: res.concurrencyKey });
            }).finally(() => setSubmitting(false));
        }}
        onReset={(values, { resetForm, setValues }) => {
            setValues({ ...order })
        }}
        validationSchema={validationSchema}>
        {
            ({ errors, touched, handleSubmit, values, setFieldValue, resetForm, setFieldTouched }) => {
                var disabled = values.status === OrderStatus.Delivered;
                return (
                    <Form onSubmit={e => {
                        e.preventDefault();
                        handleSubmit();
                    }}>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <FormLabel label="Date" touched={touched.orderDate} error={errors.orderDate} />
                                    <DateSelect2 disabled={disabled} value={values.orderDate} onChange={(d) => setFieldValue('orderDate', d)} />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <FormLabel label="Order No." touched={touched.orderNo} error={errors.orderNo} />
                                    <Input disabled={disabled} maxLength={20} value={values.orderNo} onChange={(e) => setFieldValue('orderNo', e.target.value)} />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <FormLabel label="Customer" touched={touched.customerId} error={errors.customerId} />
                                    <CustomerSelect disabled={disabled} selectedValue={values.customerId} onChange={(c) => setFieldValue('customerId', c)} />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <FormLabel label="Product" touched={touched.productId} error={errors.productId} />
                                    <ProductSelect disabled={disabled} selectedValue={values.productId} onChange={(p) => setFieldValue('productId', p)} />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <FormLabel label="Quantity" touched={touched.quantity} error={errors.quantity} />
                                    <Input type="number" step="0.0001" disabled={disabled} value={values.quantity} onChange={(e) => setFieldValue('quantity', e.target.value)} />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <FormLabel label="OB Prefix" touched={touched.obRefPrefix} error={errors.obRefPrefix} />
                                    <Input disabled={disabled} maxLength={20} value={values.obRefPrefix} onChange={(e) => setFieldValue('obRefPrefix', e.target.value)} />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <FormLabel label="Tank No." touched={touched.tankNo} error={errors.tankNo} />
                                    <Input disabled={disabled} maxLength={20} value={values.tankNo} onChange={(e) => setFieldValue('tankNo', e.target.value)} />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <FormLabel label="Buyer" touched={touched.buyer} error={errors.buyer} />
                                    <Input disabled={disabled} maxLength={100} value={values.buyer} onChange={(e) => { setFieldValue('buyer', e.target.value); }} />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <FormLabel label="Buyer Type" />
                                    <br />
                                    <BuyerTypeSplitButton
                                        disabled={disabled}
                                        value={values.buyerType}
                                        onChange={(s) => {
                                            setFieldValue('bowserEntries', []);
                                            setFieldValue('buyerType', s);
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                            <Col>
                                {!isNewOrder() &&
                                    <FormGroup>
                                        <FormLabel label="Status" touched={touched.status} error={errors.status} />
                                        <br />
                                        <OrderStatusSplitButton
                                            value={values.status}
                                            onChange={(s) => setFieldValue('status', s)}
                                        />
                                    </FormGroup>
                                }
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <StockReleaseEntriesTable
                                        disabled={disabled}
                                        touched={touched.releaseEntries}
                                        error={errors.releaseEntries}
                                        items={values.releaseEntries}
                                        onChange={(e) => {
                                            setFieldTouched('releaseEntries')
                                            setFieldValue('releaseEntries', e);
                                        }} />
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
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Button type="reset" onClick={() => resetForm()}>Reset</Button>
                                    <Button type="submit" className="ms-2" color="primary">Save</Button>
                                </FormGroup>
                            </Col>
                        </Row>
                    </Form>
                )
            }
        }
    </Formik> || null;
}