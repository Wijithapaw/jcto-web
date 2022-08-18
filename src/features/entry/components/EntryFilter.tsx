import { Card, CardBody, Col, Form, FormGroup, Row } from "reactstrap";
import { useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { changeEntryFilter, entryFilterSelector } from "../entry-slice";
import CustomerSelect from "./CustomerSelect";
import { useEffect } from "react";

export default function EntryFilter() {
    const dispatch = useAppDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const filter = useAppSelector(entryFilterSelector);

    useEffect(() => {
        const customerId = searchParams.get("customerId");
        customerId && handleCustomerChange(customerId);
    }, [])

    const handleFilterChange = (field: string, value: any) => {
        dispatch(changeEntryFilter({ [field]: value }));
    }

    const handleCustomerChange = (customerId: string) => {
        handleFilterChange("customerId", customerId);
        setSearchParams({ customerId });
    }

    return <Card>
        <CardBody>
            <Form>
                <Row>
                    <Col>
                        <FormGroup>
                            <CustomerSelect
                                selectedValue={filter.customerId}
                                onChange={handleCustomerChange} />
                        </FormGroup>
                    </Col>
                </Row>
            </Form>
        </CardBody>
    </Card>
}