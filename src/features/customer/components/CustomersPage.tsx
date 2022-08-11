import { useState } from "react";
import { Col, Row } from "reactstrap";
import { dateHelpers } from "../../../app/helpers";
import CustomerStocks from "./CustomerStocks";

export default function CustomersPage() {
    const [date, setDate] = useState(new Date());
    return <>
        <Row>
            <Col className="mt-3 mb-3">
                <h2>Customer stocks as at: {dateHelpers.toDatetimeStr(date)}</h2>
            </Col>
        </Row>
        <Row>
            <Col>
                <CustomerStocks />
            </Col>
        </Row>
    </>
}