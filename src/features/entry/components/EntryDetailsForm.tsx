import { useEffect, useMemo, useState } from "react";
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
import CustomerSelect from "../../customer/components/CustomerSelect";
import ProductSelect from "../../customer/components/ProductSelect";

interface Props {
    entryId?: string;
    onUpdate?: () => void;
    onDelete?: () => void;
}

export default function EntryDetailsForm({ entryId, onUpdate, onDelete }: Props) {
    const [editingEntryId, setEditingEntryId] = useState(entryId);
    const [editingEntry, setEditingEntry] = useState<Entry>();

    useEffect(() => {
        setEditingEntryId(entryId);
    }, [entryId]);

    useEffect(() => {
        editingEntryId && entryApi.getEntry(editingEntryId)
            .then((entry) => {
                setEditingEntry(entry);
            })
    }, [editingEntryId])

    const handleDelete = () => {
        if (editingEntry && window.confirm("Are you sure you want to delete the entry?")) {
            entryApi.deleteEntry(editingEntryId!)
                .then(() => {
                    showNotification(NotificationType.success, "Entry deleted");
                    onDelete && onDelete();
                })
        }
    }

    const validationSchema = useMemo(() => {
        return Yup.object().shape({
            entryNo: Yup.string()
                .max(20, ' is too Long!')
                .required(' is required'),
            initialQuantity: Yup.number()
                .required(' is required')
                .test('dd', ' must be greater than 0', (value) => (value || 0) > 0),
            entryDate: Yup.string().required(' is required'),
            productId: Yup.string().required(' is required'),
            customerId: Yup.string().required(' is required'),
        });
    }, [])

    const entry = useMemo(() => {
        if (editingEntry) {
            return { ...editingEntry };
        } else {
            const newEntry: Entry = {
                customerId: '',
                productId: '',
                entryDate: dateHelpers.toIsoString(new Date()),
                entryNo: '',
                initialQuantity: 0,
                status: EntryStatus.Active,
            };
            return newEntry;
        }
    }, [editingEntry]);

    return <Formik initialValues={{ ...entry }}
        enableReinitialize
        onSubmit={(values, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            const editingEntry = { ...values };
            const promise = !editingEntryId ? entryApi.createEntry(editingEntry) : entryApi.updateEntry(editingEntryId!, editingEntry);
            promise.then((res) => {
                showNotification(NotificationType.success, `Entry ${!editingEntryId ? 'created' : 'updated'}`);
                !editingEntryId ? setEditingEntryId(res.id)
                    : setEditingEntry({ ...editingEntry, concurrencyKey: res.concurrencyKey });
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
                                <FormLabel label="Product" touched={touched.productId} error={errors.productId} />
                                <ProductSelect selectedValue={values.productId} onChange={(p) => setFieldValue('productId', p, true)} />
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <FormLabel label="ToBond No" touched={touched.entryNo} error={errors.entryNo} />
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
                                <FormLabel label="Quantity" touched={touched.initialQuantity} error={errors.initialQuantity} />
                                <Field name="initialQuantity" type="number" className="form-control" />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {
                                entry.status === EntryStatus.Active &&
                                <FormGroup>
                                    {editingEntry && <Button type="button" className="me-2" color="danger" onClick={handleDelete}>Delete</Button>}
                                    <Button type="reset" onClick={() => resetForm()}>Reset</Button>
                                    <Button type="submit" disabled={isSubmitting} className="ms-2" color="primary">Save</Button>
                                </FormGroup>}
                        </Col>
                        {
                            editingEntryId &&
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