import { useMemo } from "react";
import { Button, Col, Form, FormGroup, Label, Row } from "reactstrap";
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import { Discharge } from "../types";
import { dateHelpers, validationHelpers } from "../../../app/helpers";
import FormLabel from "../../../components/FormLabel";
import DateSelect2 from "../../../components/DateSelect2";
import ProductSelect from "../../customer/components/ProductSelect";
import CustomerSelect from "../../customer/components/CustomerSelect";
import { stockApi } from "../stock-api";
import { showNotification } from "../../../app/notification-service";
import { NotificationType } from "../../../app/types";

interface Props {
    dischargeId?: string;
    customerId?: string;
}

export default function DischargeDetailsForm({  dischargeId, customerId }: Props) {
    const validationSchema = useMemo(() => {
        return Yup.object().shape({
            toBondNo: Yup.string()
                .max(20, ' is too Long!')
                .required(' is required')
                .test('Digits only', ' must have only digits', validationHelpers.digitsOnly),
            quantity: Yup.number()
                .required(' is required')
                .test('dd', ' must be greater than 0', (value) => (value || 0) > 0),
            transactionDate: Yup.string().required(' is required'),
            productId: Yup.string().required(' is required'),
            customerId: Yup.string().required(' is required'),
        });
    }, [])

    const discharge = useMemo(() => {
        if (dischargeId) {
            //todo
        } else {
            const newDischarge: Discharge = {
                customerId: customerId || '',
                productId: '',
                transactionDate: dateHelpers.toIsoString(new Date()),
                toBondNo: '',
                quantity: 0,
            };
            return newDischarge;
        }
    }, [dischargeId]);

    return discharge && <Formik initialValues={{ ...discharge }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
            setSubmitting(true);

            const editingDischarge = { ...values }

            stockApi.topup(editingDischarge)
                .then(() => {
                    showNotification(NotificationType.success, "Discharge created successfully");
                    resetForm();
                }).finally(() => setSubmitting(false));
        }}
        onReset={(values, { resetForm, setValues }) => {
            setValues({ ...discharge })
        }}
        validationSchema={validationSchema}>
        {
            ({ errors, touched, handleSubmit, values, setFieldValue, resetForm }) => (
                <Form onSubmit={e => {
                    e.preventDefault();
                    handleSubmit();
                }}>
                    <Row>
                        <Col>
                            <FormGroup>
                                <FormLabel label="Customer" touched={touched.customerId} error={errors.customerId} />
                                <CustomerSelect
                                    selectedValue={values.customerId}
                                    onChange={(id) => setFieldValue('customerId', id, true)} />
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <FormLabel label="Product" touched={touched.productId} error={errors.productId} />
                                <ProductSelect selectedValue={values.productId} onChange={(p) => setFieldValue('productId', p, true)} />
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <FormLabel label="To Bond No" touched={touched.toBondNo} error={errors.toBondNo} />
                                <Field name="toBondNo" type="text" className="form-control" />
                            </FormGroup>
                        </Col>

                    </Row>
                    <Row>
                        <Col>
                            <FormGroup>
                                <FormLabel label="Discharge Date" touched={touched.transactionDate} error={errors.transactionDate} />
                                <DateSelect2 value={values.transactionDate} onChange={(d) => setFieldValue('transactionDate', d, true)} />
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <FormLabel label="Quantity" touched={touched.quantity} error={errors.quantity} />
                                <Field name="quantity" type="number" className="form-control" />
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
    </Formik> || null;
}