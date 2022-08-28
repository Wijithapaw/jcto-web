import { Col, Row } from "reactstrap";
import EntryFilter from "./EntryFilter";
import EntryList from "./EntryList";

export default function EntryListPage() {
    return <>
        <Row>
            <Col className="mt-2 mb-2">
                <EntryFilter />
            </Col>
        </Row>
        <Row>
            <Col>
                <EntryList />
            </Col>
        </Row>
    </>
}