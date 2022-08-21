import { Col, Row } from "reactstrap";
import OrderFilter from "./OrderFilter";

export default function OrdersPage() {
    return <>
        <Row>
            <Col className="mt-2 mb-2">
                <OrderFilter />
            </Col>
        </Row>
        <Row>
            <Col>
                Data here
            </Col>
        </Row>
    </>
}