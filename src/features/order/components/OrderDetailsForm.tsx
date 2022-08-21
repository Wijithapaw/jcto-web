import { useMemo } from "react";
import { Button, Col, Form, FormGroup, Label, Row } from "reactstrap";
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import { dateHelpers } from "../../../app/helpers";
import FormLabel from "../../../components/FormLabel";
import DateSelect2 from "../../../components/DateSelect2";
import ProductSelect from "../../customer/components/ProductSelect";
import CustomerSelect from "../../customer/components/CustomerSelect";
import { showNotification } from "../../../app/notification-service";
import { NotificationType } from "../../../app/types";
import { Order, OrderStatus } from "../types";
import OrderStatusSplitButton from "./OrderStatusSplitButton";

interface Props {
    orderId?: string;
}

export default function OrderDetailsForm({ orderId }: Props) {
    const validationSchema = useMemo(() => {
        return Yup.object().shape({
            orderDate: Yup.string().required(' is required'),
            productId: Yup.string().required(' is required'),
        });
    }, [])

    const order = useMemo(() => {
        if (orderId) {
            //todo
        } else {
            const newOrder: Order = {
                orderDate: dateHelpers.toIsoString(new Date()),
                productId: '',
                status: OrderStatus.Undelivered
            };
            return newOrder;
        }
    }, [orderId]);

    return order && <Formik initialValues={{ ...order }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
            setSubmitting(true);

            const editingOrder: Order = {
                productId: values.productId,
                orderDate: values.orderDate,
                status: values.status
            };

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
            ({ errors, touched, handleSubmit, values, setFieldValue, resetForm }) => {
                var disabled = values.status === OrderStatus.Delivered;
                return (
                    <Form onSubmit={e => {
                        e.preventDefault();
                        handleSubmit();
                    }}>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <FormLabel label="Order Date" touched={touched.orderDate} error={errors.orderDate} />
                                    <DateSelect2 disabled={disabled} value={values.orderDate} onChange={(d) => setFieldValue('orderDate', d, true)} />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <FormLabel label="Product" touched={touched.productId} error={errors.productId} />
                                    <ProductSelect disabled={disabled} selectedValue={values.productId} onChange={(p) => setFieldValue('productId', p, true)} />
                                </FormGroup>
                            </Col>
                            <Col md={4}>
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