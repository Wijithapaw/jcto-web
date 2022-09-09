import { Col, Row } from "reactstrap";
import DischargesFilter from "./DischargesFilter";
import DischargesList from "./DischargesList";

export default function DischargesListPage() {
    return <>
        <Row>
            <Col className="mt-2 mb-2">
                <DischargesFilter />
            </Col>
        </Row>
        <Row>
            <Col>
                <DischargesList />
            </Col>
        </Row>
    </>
}