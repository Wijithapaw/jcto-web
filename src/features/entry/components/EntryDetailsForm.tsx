import { useMemo } from "react";
import { Button, Col, Form, FormGroup, Label, Row } from "reactstrap";
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import { Entry, EntryStatus } from "../types";
import { dateHelpers } from "../../../app/helpers";
import FormLabel from "../../../components/FormLabel";
import DateSelect2 from "../../../components/DateSelect2";
import ProductSelect from "./ProductSelect";
import CustomerSelect from "./CustomerSelect";
import { entryApi } from "../entry-api";
import { showNotification } from "../../../app/notification-service";
import { NotificationType } from "../../../app/types";

const digitsOnly = (value?: string) => /^\d+$/.test(value || '')

interface Props {
    entryId?: string;
    customerId?: string;
}

export default function EntryDetailsForm({ entryId, customerId }: Props) {
    const validationSchema = useMemo(() => {
        return Yup.object().shape({
            entryNo: Yup.string()
                .max(20, ' is too Long!')
                .required(' is required')
                .test('Digits only', ' must have only digits', digitsOnly),
            initialQuantity: Yup.number()
                .required(' is required')
                .test('dd', ' must be greater than 0', (value) => (value || 0) > 0),
            entryDate: Yup.string().required(' is required'),
            productId: Yup.string().required(' is required'),
            customerId: Yup.string().required(' is required'),
        });
    }, [])

    const entry = useMemo(() => {
        if (entryId) {
            //todo
        } else {
            const newEntry: Entry = {
                customerId: customerId!,
                customerName: '',
                entryDate: dateHelpers.toIsoString(new Date()),
                entryNo: '',
                initialQuantity: 0,
                productId: '',
                status: EntryStatus.Active
            };
            return newEntry;
        }
    }, [entryId]);

    return entry && <Formik initialValues={{...entry}}
        onSubmit={(values, { setSubmitting, resetForm }) => {
            setSubmitting(true);

            const editingEntry: Entry = {
                customerId : values.customerId,
                customerName: '',
                productId: values.productId,
                entryDate: values.entryDate,
                entryNo: values.entryNo,
                initialQuantity: values.initialQuantity,
                status: values.status
            };

            entryApi.createEntry(editingEntry)
                .then(() => {
                    showNotification(NotificationType.success, "Entry created successfully");
                    resetForm();
                }).finally(() => setSubmitting(false));
        }}
        onReset={(values, { resetForm, setValues }) => {
            setValues({ ...entry })
        }}
        validationSchema={validationSchema}>
        {
            ({ errors, touched, handleSubmit, values, setFieldValue, resetForm }) => (
                <Form onSubmit={e => {
                    e.preventDefault();
                    handleSubmit();
                }}>
                    <Row>
                        <Col md={3}>
                            <FormGroup>
                                <FormLabel label="Customer" touched={touched.customerId} error={errors.customerId} />
                                <CustomerSelect
                                    selectedValue={values.customerId}
                                    onChange={(id) => setFieldValue('customerId', id, true)} />
                            </FormGroup>
                        </Col>
                        <Col md={4}>
                            <FormGroup>
                                <FormLabel label="Entry No" touched={touched.entryNo} error={errors.entryNo} />
                                <Field name="entryNo" type="text" className="form-control" />
                            </FormGroup>
                        </Col>
                        <Col md={5}>
                            <FormGroup>
                                <FormLabel label="Initial Quantity" touched={touched.initialQuantity} error={errors.initialQuantity} />
                                <Field name="initialQuantity" type="number" className="form-control" />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup>
                                <FormLabel label="Entry Date" touched={touched.entryDate} error={errors.entryDate} />
                                <DateSelect2 value={values.entryDate} onChange={(d) => setFieldValue('entryDate', d, true)} />
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <FormLabel label="Product" touched={touched.productId} error={errors.productId} />
                                <ProductSelect selectedValue={values.productId} onChange={(p) => setFieldValue('productId', p, true)} />
                            </FormGroup>
                        </Col>
                        <Col md={2}>
                            <FormGroup>
                                <Label>Status</Label>
                                <br />
                                <b className={`${entry.status === EntryStatus.Active ? 'text-success' : 'text-secondary'}`}>
                                    {`${entry.status === EntryStatus.Active ? 'Active' : 'Completed'}`}
                                </b>
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