import { useState } from "react";
import { Col, Row } from "reactstrap";
import { dateHelpers } from "../../../app/helpers";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import AppIcon from "../../../components/AppIcon";
import { customerStocksRefreshedTimeSelector, getCustomerStocksAsync } from "../customer-slice";
import CustomerStocks from "./CustomerStocks";

export default function CustomersPage() {
    const [date, setDate] = useState(new Date());
    const customerStocksRefreshedTime = useAppSelector(customerStocksRefreshedTimeSelector);
    const dispatch = useAppDispatch();

    return <>
        <Row className="mt-3 mb-3">
            <Col>
                <h2>Customer stocks as at: {customerStocksRefreshedTime && dateHelpers.toDatetimeStr(customerStocksRefreshedTime)}</h2>
            </Col>
            <Col xs="auto">
                <AppIcon icon="arrows-rotate"
                    size="2x"
                    mode="button"
                    onClick={() => dispatch(getCustomerStocksAsync())} />
            </Col>
        </Row>
        <Row>
            <Col>
                <CustomerStocks />
            </Col>
        </Row>
    </>
}