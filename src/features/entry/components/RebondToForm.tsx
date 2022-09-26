import { useMemo } from "react";
import { Button, Col, Form, FormGroup, Row } from "reactstrap";
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import { EntryRebondToDto } from "../types";
import { dateHelpers } from "../../../app/helpers";
import FormLabel from "../../../components/FormLabel";
import DateSelect2 from "../../../components/DateSelect2";
import { entryApi } from "../entry-api";
import { showNotification } from "../../../app/notification-service";
import { NotificationType } from "../../../app/types";
import CustomerSelect from "../../customer/components/CustomerSelect";

interface Props {
    entryId: string;
    onUpdate?: () => void;
}

export default function RebondToForm({ entryId, onUpdate }: Props) {
    const validationSchema = useMemo(() => {
        return Yup.object().shape({
            quantity: Yup.number()
                .required(' is required')
                .test('dd', ' must be greater than 0', (value) => (value || 0) > 0),
            date: Yup.string().required(' is required'),
            customerId: Yup.string().required(' is required'),
            rebondNo: Yup.string()
                .max(20, ' is too Long!')
                .required(' is required'),
        });
    }, [])

    const entry = useMemo(() => {
        const newEntry: EntryRebondToDto = {
            customerId: '',
            date: dateHelpers.toIsoString(new Date()),
            entryId,
            quantity: 0,
            rebondNo: ''
        };
        return newEntry;
    }, []);

    return <Formik initialValues={{ ...entry }}
        enableReinitialize
        onSubmit={(values, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            const data = { ...values };
            entryApi.rebondTo(entryId, data).then((res) => {
                showNotification(NotificationType.success, `Entry Rebond To successfully`);
                onUpdate && onUpdate();
            }).finally(() => setSubmitting(false));
        }}
        onReset={(values, { resetForm, setValues }) => {
            setValues({ ...entry })
        }}
        validationSchema={validationSchema}>
        {
            ({ errors, touched, handleSubmit, values, setFieldValue, resetForm, isSubmitting }) => (
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
                                <FormLabel label="Rebond No" touched={touched.rebondNo} error={errors.rebondNo} />
                                <Field name="rebondNo" type="text" className="form-control" />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup>
                                <FormLabel label="Date" touched={touched.date} error={errors.date} />
                                <DateSelect2 value={values.date} onChange={(d) => setFieldValue('date', d, true)} />
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
                                <Button type="submit" disabled={isSubmitting} className="ms-2" color="primary">Save</Button>
                            </FormGroup>
                        </Col>

                    </Row>
                </Form>
            )}
    </Formik>
}