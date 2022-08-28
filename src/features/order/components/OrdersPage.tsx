import { Col, Row } from "reactstrap";
import OrderFilter from "./OrderFilter";
import OrdersList from "./OrdersList";

export default function OrdersPage() {
    return <>
        <Row>
            <Col className="mt-2 mb-2">
                <OrderFilter />
            </Col>
        </Row>
        <Row>
            <Col>
                <OrdersList/>
            </Col>
        </Row>
    </>
}