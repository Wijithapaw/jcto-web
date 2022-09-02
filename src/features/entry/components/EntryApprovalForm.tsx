import { useMemo } from "react";
import { Button, Col, Form, FormGroup, Label, Row } from "reactstrap";
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import { EntryApproval, EntryApprovalType } from "../types";
import { dateHelpers, validationHelpers } from "../../../app/helpers";
import FormLabel from "../../../components/FormLabel";
import DateSelect2 from "../../../components/DateSelect2";
import ApprovalTypeSelect from "./EntryApprovalTypeSelect";
import { entryApi } from "../entry-api";
import { NotificationType, showNotification } from "../../../app/notification-service";

interface Props {
    entryId: string;
    id?: string;
}

export default function EntryApprovalForm({ entryId, id }: Props) {
    const validationSchema = useMemo(() => {
        return Yup.object().shape({
            quantity: Yup.number()
                .required('is required')
                .test('dd', 'must be greater than 0', (value) => (value || 0) > 0),
            approvalDate: Yup.string().required('is required'),
            type: Yup.number().required('is required'),
            approvalRef: Yup.string().when("type", {
                is: (type: EntryApprovalType) => (type == EntryApprovalType.Rebond || type === EntryApprovalType.Xbond),
                then: Yup.string().required('is required')
            })
        });
    }, [])

    const approval = useMemo(() => {
        if (id) {
            //todo
        } else {
            const newApproval: EntryApproval = {
                approvalDate: dateHelpers.toIsoString(new Date()),
                entryId: entryId,
                quantity: 0,
                approvalRef: '',
                type: undefined,
            };
            return newApproval;
        }
    }, [id]);

    return approval && <Formik
        initialValues={{ ...approval }}
        enableReinitialize
        onSubmit={(values, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            const approval = { ...values }

            entryApi.approveEntry(approval)
                .then(() => {
                    showNotification(NotificationType.success, "Added entry approval successfully");
                    resetForm();
                }).finally(() => setSubmitting(false));
        }}
        onReset={(values, { resetForm, setValues }) => {
            setValues({ ...approval })
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
                                <FormLabel label="Entry Date" touched={touched.approvalDate} error={errors.approvalDate} />
                                <DateSelect2 value={values.approvalDate} onChange={(d) => setFieldValue('approvalDate', d)} />
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
                                <FormLabel label="Approval Type" touched={touched.type} error={errors.type} />
                                <ApprovalTypeSelect selectedValue={values.type} onChange={(t) => setFieldValue('type', t)} />
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <FormLabel label="Approval Ref" touched={touched.approvalRef} error={errors.approvalRef} />
                                <Field name="approvalRef" className="form-control" />
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