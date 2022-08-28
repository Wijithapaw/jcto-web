import { Card, CardBody, CardHeader, Col, Label, Row } from "reactstrap";
import { dateHelpers } from "../../../app/helpers";
import { EntryListItem, EntryStatus } from "../types";
import EntryTransactionsList from "./EntryTransactionsList";

interface Props {
    entry: EntryListItem;
}

interface CardLabelProps {
    label: string;
    value: any;
}
function CardLabel({ label, value }: CardLabelProps) {
    return <><Label><b className="me-1">{`${label}:`}</b></Label>{value} </>
}

export default function EntryCard({ entry }: Props) {
    return <Card className="mb-2 mt-2">
        <CardHeader>
            <Row>
                <Col xs="auto"><CardLabel label="Customer" value={entry.customer} /></Col>
                <Col xs="auto"><CardLabel label="Product" value={entry.product} /></Col>
                <Col xs="auto"><CardLabel label="Entry Date" value={dateHelpers.toShortDateStr(entry.entryDate)} /></Col>
                <Col xs="auto"><CardLabel label="Entry No" value={entry.entryNo} /></Col>
                <Col>
                    <Label>
                        <b className="me-1">Status</b>
                    </Label>
                    <span className={`${entry.status === EntryStatus.Active ? 'text-success' : 'text-secondary'}`}>
                        {entry.status === EntryStatus.Active ? 'Active' : 'Completed'}
                    </span>
                </Col>
                <Col className="text-end"><CardLabel label="Initial Qty" value={entry.initialQuantity.toFixed(4)} /></Col>
                <Col className="text-end"><CardLabel label="Balance Qty" value={entry.remainingQuantity.toFixed(4)} /></Col>
            </Row>
        </CardHeader>
        <CardBody>
            <EntryTransactionsList items={entry.transactions} />
        </CardBody>
    </Card>
}
