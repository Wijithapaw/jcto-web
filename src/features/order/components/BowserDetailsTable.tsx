import { ChangeEvent } from "react";
import { Card, CardBody, CardHeader, Col, Input, Label, Row, Table } from "reactstrap";
import { v4 as uuidv4 } from 'uuid';
import AppIcon from "../../../components/AppIcon";
import { BowserEntry } from "../types"

interface Props {
    items?: BowserEntry[];
    onChange: (e: BowserEntry[]) => void;
    error?: string;
    touched?: boolean;
    disabled?: boolean;
}

export default function BowserDetailsTable({ items = [], onChange, error, touched, disabled }: Props) {
    const addNewItem = () => {
        var newEntry: BowserEntry = {
            id: uuidv4(),
            capacity: 0,
            count: 0,            
        };
        const newEntries = [...items, newEntry];
        onChange(newEntries);
    };

    const deleteItem = (id: string) => {
        const remItems = items.filter(i => i.id !== id);
        onChange(remItems);
    };

    const updateItem = (id: string, e: ChangeEvent<HTMLInputElement>) => {
        const updatedItems = [...items];
        const item: any = updatedItems.find(i => i.id === id);
        item[e.target.name] = e.target.value;

        onChange(updatedItems);
    };

    return <Card>
        <CardHeader>
            <Row>
                <Col xs="auto" className="pe-0">
                    <Label><b>Bowser Details</b></Label>
                </Col>
                <Col className="text-danger">
                    <i><small>{`${error && touched ? error : ''}`}</small></i>
                </Col>
                {
                    !disabled && <Col className="text-end" xs="auto">
                        <AppIcon icon="plus"
                            onClick={() => addNewItem()}
                            className="text-primary ms-2"
                            title="Add new"
                            mode="button" />
                    </Col>
                }
            </Row>
        </CardHeader>
        <CardBody>
            <Table responsive>
                <thead>
                    <tr>
                        <td>Capacity</td>
                        <td>Count</td>
                        {!disabled && <td></td>}
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => <tr key={item.id}>
                        <td><Input disabled={disabled} name="capacity" type="number" onChange={(e) => updateItem(item.id, e)} /></td>
                        <td><Input disabled={disabled} name="count" type="number" onChange={(e) => updateItem(item.id, e)} /></td>
                        {!disabled && <td className="align-middle"> <AppIcon icon="x"
                            onClick={() => deleteItem(item.id)}
                            className="text-danger"
                            title="Delete" mode="button" />  </td>}

                    </tr>)}
                </tbody>
            </Table>
        </CardBody>
    </Card>
}