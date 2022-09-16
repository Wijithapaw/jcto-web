import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Col, Label, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import { dateHelpers } from "../../../app/helpers";
import AppIcon from "../../../components/AppIcon";
import { OrderStatus } from "../../order/types";
import { EntryListItem, EntryStatus, EntryTransactionType } from "../types";
import EntryApprovalForm from "./EntryApprovalForm";
import EntryTransactionsList from "./EntryTransactionsList";

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
    const [approvedQty, setApprovedQty] = useState(0);
    const [approvedBalQty, setApprovedBalQty] = useState(0);

    useEffect(() => {
        const apprQty = entry.transactions
            .filter(t => t.type == EntryTransactionType.Approval)
            .map(t => t.quantity)
            .reduce((a, b) => a + b, 0);
        setApprovedQty(apprQty);

        const delQuy = entry.transactions
            .filter(t => t.type == EntryTransactionType.Out)
            .map(t => t.orderStatus === OrderStatus.Delivered ? t.deliveredQuantity : t.quantity)
            .reduce((a, b) => a + b, 0);
        setApprovedQty(apprQty);

        setApprovedBalQty(apprQty + delQuy);
    }, [entry])

    return <Card className="mb-2 mt-2">
        <CardHeader>
            <Row>
                <Col xs="auto"><CardLabel label="Entry No" value={entry.entryNo} /></Col>
                <Col><CardLabel label="Entry Date" value={dateHelpers.toShortDateStr(entry.entryDate)} /></Col>
                <Col className="text-end" xs="auto">
                    <Label>
                        <b className="me-1">Approved Qty
                            <AppIcon icon="plus-circle"
                                title="Add Approal"
                                className="text-warning ms-1 me-1"
                                mode="button"
                                onClick={() => setShowApproval(true)} />:
                        </b>
                        {approvedQty.toFixed(4)}
                    </Label>
                </Col>
                <Col className="text-end" xs="auto">
                    <CardLabel label="Initial Qty" value={entry.initialQuantity.toFixed(4)} />
                </Col>
                <Col className="text-end" xs="auto">
                    <CardLabel label="Balance Qty" value={entry.remainingQuantity.toFixed(4)} />
                </Col>
                <Col className="text-end" xs="auto">
                    <CardLabel label="Appr. Balance Qty" value={approvedBalQty.toFixed(4)} />
                </Col>
            </Row>
            <Row>
                <Col xs="auto"><CardLabel label="To Bond No" value={entry.toBondNo} /></Col>
                <Col xs="auto"><CardLabel label="Customer" value={entry.customer} /></Col>
                <Col><CardLabel label="Product" value={entry.product} /></Col>
                <Col xs="auto">
                    <Label>
                        <b className="me-1">Status</b>
                    </Label>
                    <span className={`${entry.status === EntryStatus.Active ? 'text-success' : 'text-secondary'}`}>
                        {entry.status === EntryStatus.Active ? 'Active' : 'Completed'}
                    </span>
                </Col>
            </Row>
        </CardHeader>
        <CardBody>
            <EntryTransactionsList items={entry.transactions} />
        </CardBody>
        <Modal isOpen={showApproval} size="md" toggle={() => setShowApproval(false)} backdrop="static">
            <ModalHeader toggle={() => setShowApproval(false)}>
                {`Add Approval [${entry.customer} | ${entry.product} | ${entry.entryNo}]`}
            </ModalHeader>
            <ModalBody>
                <EntryApprovalForm entryId={entry.id} onUpdate={onUpdate} />
            </ModalBody>
        </Modal>
    </Card>
}
