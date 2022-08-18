import { Col, Row } from "reactstrap";
import EntryFilter from "./EntryFilter";

export default function EntryListPage() {
    return <>
        <Row>
            <Col className="mt-2 mb-2">
                <EntryFilter />
            </Col>
        </Row>
        <Row>
            <Col>
                Data here
            </Col>
        </Row>
    </>
}