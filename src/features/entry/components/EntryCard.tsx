import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Col, Label, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import { dateHelpers } from "../../../app/helpers";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import AppIcon from "../../../components/AppIcon";
import { entryFilterSelector, searchEntriesAsync } from "../entry-slice";
import { EntryListItem, EntryStatus, EntryTransactionType } from "../types";
import EntryApprovalForm from "./EntryApprovalForm";
import EntryDetailsForm from "./EntryDetailsForm";
import EntryTransactionsList from "./EntryTransactionsList";
import RebondToForm from "./RebondToForm";

interface Props {
    entry: EntryListItem;
    onUpdate?: () => void;
}

interface CardLabelProps {
    label: string;
    value: any;
}
function CardLabel({ label, value }: CardLabelProps) {
    return <><Label><b className="me-1">{`${label}:`}</b></Label>{value} </>
}

export default function EntryCard({ entry, onUpdate }: Props) {
    const [showApproval, setShowApproval] = useState(false);
    const [showRebondTo, setShowRebondTo] = useState(false);
    const [approvedQty, setApprovedQty] = useState(0);
    const [editingEntryId, setEditingEntryId] = useState<string>();
    const dispatch = useAppDispatch();
    const filter = useAppSelector(entryFilterSelector);

    useEffect(() => {
        const apprQty = entry.transactions
            .filter(t => t.type == EntryTransactionType.Approval)
            .map(t => t.quantity)
            .reduce((a, b) => a + b, 0);
        setApprovedQty(apprQty);
    }, [entry])

    return <Card className="mb-2 mt-2">
        <CardHeader>
            <Row>
                <Col xs="auto">
                    <CardLabel label="Tobond No" value={entry.entryNo} />
                    <AppIcon icon="pencil"
                        title="Add Approal"
                        className="ms-1 me-1"
                        mode="button"
                        onClick={() => setEditingEntryId(entry.id)} />
                </Col>
                <Col>
                    <CardLabel label="Entry Date" value={dateHelpers.toShortDateStr(entry.entryDate)} />
                </Col>
                <Col className="text-end" xs="auto">
                    <Label>
                        <b className="me-1">Approved Qty
                            <AppIcon icon="plus-circle"
                                title="Add Approal"
                                className="text-warning ms-1 me-1"
                                mode="button"
                                onClick={() => setShowApproval(true)} />:
                        </b>
                        {approvedQty.toFixed(3)}
                    </Label>
                </Col>
                <Col className="text-end" xs="auto">
                    <CardLabel label="Initial Qty" value={entry.initialQuantity.toFixed(3)} />
                </Col>
                <Col className="text-end" xs="auto">
                    <CardLabel label="Balance Qty" value={entry.remainingQuantity.toFixed(3)} />
                </Col>
            </Row>
            <Row>
                <Col xs="auto"><CardLabel label="Internal Ref. No" value={entry.index} /></Col>
                <Col xs="auto"><CardLabel label="Customer" value={entry.customer} /></Col>
                <Col><CardLabel label="Product" value={entry.product} /></Col>
                {
                    entry.rebondedFromCustomer && <Col xs="auto" className="text-success">
                        <CardLabel label="Rebond From" value={entry.rebondedFromCustomer} />
                    </Col>
                }
                <Col xs="auto">
                    <AppIcon icon="shuffle"
                        title="Rebond to another customer"
                        className="ms-1 me-1"
                        onClick={() => setShowRebondTo(true)}
                        mode="button" />
                </Col>
                <Col xs="auto">
                    <Label>
                        <b className="me-1">Status</b>
                    </Label>
                    <span className={`${entry.status === EntryStatus.Active ? 'text-success' : 'text-danger'}`}>
                        {entry.status === EntryStatus.Active ? 'Active' : 'Completed'}
                    </span>
                </Col>
            </Row>
        </CardHeader>
        <CardBody>
            <EntryTransactionsList items={entry.transactions} onUpdate={onUpdate} />
        </CardBody>
        <Modal isOpen={showApproval} size="md" toggle={() => setShowApproval(false)} backdrop="static">
            <ModalHeader toggle={() => setShowApproval(false)}>
                {`Add Approval [${entry.customer} | ${entry.product} | ${entry.entryNo}]`}
            </ModalHeader>
            <ModalBody>
                <EntryApprovalForm entryId={entry.id} onUpdate={onUpdate} />
            </ModalBody>
        </Modal>
        <Modal isOpen={!!editingEntryId} size="lg" toggle={() => setEditingEntryId(undefined)} backdrop="static">
            <ModalHeader toggle={() => setEditingEntryId(undefined)}>
                New Entry
            </ModalHeader>
            <ModalBody>
                <EntryDetailsForm entryId={editingEntryId}
                    onUpdate={() => dispatch(searchEntriesAsync(filter))}
                    onDelete={() => {
                        dispatch(searchEntriesAsync(filter));
                        setEditingEntryId(undefined);
                    }} />
            </ModalBody>
        </Modal>
        <Modal isOpen={showRebondTo} size="md" toggle={() => setShowRebondTo(false)} backdrop="static">
            <ModalHeader toggle={() => setShowRebondTo(false)}>
                Rebond To
            </ModalHeader>
            <ModalBody>
                <RebondToForm entryId={entry.id} onUpdate={() => {
                    onUpdate && onUpdate();
                    setShowRebondTo(false);
                }} />
            </ModalBody>
        </Modal>
    </Card>
}
