import { useEffect, useMemo, useState } from "react";
import { Button, Col, Form, FormGroup, Label, Row } from "reactstrap";
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import { Entry, EntryStatus } from "../types";
import { dateHelpers } from "../../../app/helpers";
import FormLabel from "../../../components/FormLabel";
import DateSelect2 from "../../../components/DateSelect2";
import ProductSelect from "./ProductSelect";
import CustomerSelect from "./CustomerSelect";

const digitsOnly = (value?: string) => /^\d+$/.test(value || '')

interface Props {
    id?: string;
    customerId?: string;
}

export default function EntryDetailsForm({ id, customerId }: Props) {
    const [entryId, setEntryId] = useState(id);
    const [entry, setEntry] = useState<Entry>();

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
            productCode: Yup.string().required(' is required'),
            customerId: Yup.string().required(' is required'),
        });
    }, [])

    useEffect(() => {
        if (entryId) {
            //todo
        } else {
            const newEntry: Entry = {
                customerId: customerId!,
                customerName: '',
                entryDate: dateHelpers.toIsoString(new Date()),
                entryNo: '',
                initialQuantity: 0,
                productCode: '',
                status: EntryStatus.Active
            };
            setEntry(newEntry);
        }
    }, [entryId]);

    return entry && <Formik initialValues={{ ...entry }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            const editingEntry = values as Entry;

            if (entryId) console.log('update', editingEntry);
            else console.log('new', editingEntry);
        }}
        validationSchema={validationSchema}>
        {
            ({ errors, touched, handleSubmit, dirty, values, setFieldValue, setFieldTouched }) => (
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
                                    onChange={(id) => {
                                        setFieldTouched('customerId', true);
                                        setFieldValue('customerId', id, true);
                                    }} />
                            </FormGroup>
                        </Col>
                        <Col md={4}>
                            <FormGroup>
                                <FormLabel label="Entry ID" touched={touched.entryNo} error={errors.entryNo} />
                                <Field name="entryNo" type="text" className="form-control" />
                            </FormGroup>
                        </Col>
                        <Col md={5}>
                            <FormGroup>
                                <FormLabel label="Intial Quantity" touched={touched.initialQuantity} error={errors.initialQuantity} />
                                <Field name="initialQuantity" type="number" className="form-control" />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup>
                                <FormLabel label="Entry Date" touched={touched.entryDate} error={errors.entryDate} />
                                <DateSelect2 value={values.entryDate} onChange={(d) => {
                                    setFieldTouched('entryDate', true);
                                    setFieldValue('entryDate', d, true);
                                }} />
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <FormLabel label="Product" touched={touched.productCode} error={errors.productCode} />
                                <ProductSelect selectedValue={values.productCode} onChange={(p) => {
                                    setFieldTouched('productCode', true);
                                    setFieldValue('productCode', p, true);
                                }} />
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
                                <Button>Cancel</Button>
                                <Button className="ms-2" color="primary">Save</Button>
                            </FormGroup>
                        </Col>
                    </Row>
                </Form>
            )
        }
    </Formik> || null;
}