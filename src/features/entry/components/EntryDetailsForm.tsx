import { useMemo } from "react";
import { Button, Col, Form, FormGroup, Label, Row } from "reactstrap";
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import { Entry, EntryStatus } from "../types";
import { dateHelpers } from "../../../app/helpers";
import FormLabel from "../../../components/FormLabel";
import DateSelect2 from "../../../components/DateSelect2";
import { entryApi } from "../entry-api";
import { showNotification } from "../../../app/notification-service";
import { NotificationType } from "../../../app/types";

interface Props {
    entryId?: string;
}

export default function EntryDetailsForm({ entryId }: Props) {
    const validationSchema = useMemo(() => {
        return Yup.object().shape({
            entryNo: Yup.string()
                .max(20, ' is too Long!')
                .required(' is required'),
            toBondNo: Yup.string()
                .max(20, ' is too Long!')
                .required(' is required'),
            initialQuantity: Yup.number()
                .required(' is required')
                .test('dd', ' must be greater than 0', (value) => (value || 0) > 0),
            entryDate: Yup.string().required(' is required'),
        });
    }, [])

    const entry = useMemo(() => {
        if (entryId) {
            //todo
        } else {
            const newEntry: Entry = {
                toBondNo: '',
                entryDate: dateHelpers.toIsoString(new Date()),
                entryNo: '',
                initialQuantity: 0,
                status: EntryStatus.Active
            };
            return newEntry;
        }
    }, [entryId]);

    return entry && <Formik initialValues={{ ...entry }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
            setSubmitting(true);

            const editingEntry = { ...values };

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
                        <Col>
                            <FormGroup>
                                <FormLabel label="To Bond No" touched={touched.toBondNo} error={errors.toBondNo} />
                                <Field name="toBondNo" type="text" className="form-control" />
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <FormLabel label="Entry No" touched={touched.entryNo} error={errors.entryNo} />
                                <Field name="entryNo" type="text" className="form-control" />
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
                                <FormLabel label="Initial Quantity" touched={touched.initialQuantity} error={errors.initialQuantity} />
                                <Field name="initialQuantity" type="number" className="form-control" />
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
                        {
                            entryId &&
                            <Col xs="auto">
                                Status:
                                <b className={`${entry.status === EntryStatus.Active ? 'text-success' : 'text-secondary'} ms-2`}>
                                    {`${entry.status === EntryStatus.Active ? 'Active' : 'Completed'}`}
                                </b>
                            </Col>
                        }
                    </Row>
                </Form>
            )
        }
    </Formik > || null;
}