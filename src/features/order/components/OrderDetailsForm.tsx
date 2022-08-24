import { useMemo } from "react";
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
import { BuyerType, Order, OrderStatus, OrderStockReleaseEntry } from "../types";
import OrderStatusSplitButton from "./OrderStatusSplitButton";
import BuyerTypeSplitButton from "./BuyerTypeSplitButton";
import StockReleaseEntriesTable from "./StockReleaseEntriesTable";

interface Props {
    orderId?: string;
}

export default function OrderDetailsForm({ orderId }: Props) {
    const validationSchema = useMemo(() => {
        return Yup.object().shape({
            orderDate: Yup.string().required('is required'),
            productId: Yup.string().required('is required'),
            customerId: Yup.string().required('is required'),
            buyer: Yup.string().required('is required'),
            ObRefPrefix: Yup.string().required('is required'),
            tankNumber: Yup.string()
                .required('is required')
                .test('Digits only', 'must have only digits', validationHelpers.digitsOnly),
            orderNo: Yup.string()
                .required(' is required')
                .test('Digits only', 'must have only digits', validationHelpers.digitsOnly),
            quantity: Yup.number()
                .required(' is required')
                .test('dd', ' must be > 0', (value) => (value || 0) > 0),
            releaseEntries: Yup.array()
                .test('NotEmpty', 'must have entries', (items) => items && items.length > 0 || false)
                .test('FillAll', 'must fill all the fields',
                    (items) => items ? items.every((i: OrderStockReleaseEntry) => {
                        var valid = i.entryNo && i.ObRef && i.quantity > 0 && i.deliveredQuantity > 0
                        return valid;
                    }) : false)
                .test('Summation', 'Sum of delivered quantities does not tally with overall quantity',
                    (items, ctx) => {
                        const entrySum = +items?.map(i => i.deliveredQuantity).reduce((a, b) => a + b, 0) || 0;
                        return ctx.parent.quantity === entrySum;
                    })
        });
    }, [])

    const order = useMemo(() => {
        if (orderId) {
            //todo
        } else {
            const newOrder: Order = {
                orderDate: dateHelpers.toIsoString(new Date()),
                productId: '',
                customerId: '',
                orderNo: '',
                tankNumber: '',
                quantity: 0,
                buyer: '',
                ObRefPrefix: '',
                buyerType: BuyerType.Barge,
                releaseEntries: [],
                status: OrderStatus.Undelivered
            };
            return newOrder;
        }
    }, [orderId]);

    return order && <Formik initialValues={{ ...order }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
            setSubmitting(true);

            const editingOrder: Order = { ...values };

            console.log(editingOrder);
            setSubmitting(false);

            // entryApi.createEntry(editingEntry)
            //     .then(() => {
            //         showNotification(NotificationType.success, "Entry created successfully");
            //         resetForm();
            //     }).finally(() => setSubmitting(false));
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
                                    <Input disabled={disabled} value={values.orderNo} onChange={(e) => setFieldValue('orderNo', e.target.value)} />
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
                                    <Input type="number" disabled={disabled} value={values.quantity} onChange={(e) => setFieldValue('quantity', e.target.value)} />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <FormLabel label="OB Ref. Prefix" touched={touched.ObRefPrefix} error={errors.ObRefPrefix} />
                                    <Input disabled={disabled} value={values.ObRefPrefix} onChange={(e) => setFieldValue('ObRefPrefix', e.target.value)} />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <FormLabel label="Tank No." touched={touched.tankNumber} error={errors.tankNumber} />
                                    <Input disabled={disabled} value={values.tankNumber} onChange={(e) => setFieldValue('tankNumber', e.target.value)} />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <FormLabel label="Buyer" touched={touched.buyer} error={errors.buyer} />
                                    <Input disabled={disabled} value={values.buyer} onChange={(e) => setFieldValue('buyer', e.target.value)} />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <FormLabel label="Buyer Type" />
                                    <br />
                                    <BuyerTypeSplitButton
                                        disabled={disabled}
                                        value={values.buyerType}
                                        onChange={(s) => setFieldValue('buyerType', s)}
                                    />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <FormLabel label="Status" touched={touched.status} error={errors.status} />
                                    <br />
                                    <OrderStatusSplitButton
                                        value={values.status}
                                        onChange={(s) => setFieldValue('status', s)}
                                    />
                                </FormGroup>
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
                                            setFieldValue('releaseEntries', e, true);
                                        }} />
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