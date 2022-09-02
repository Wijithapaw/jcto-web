import { ChangeEvent, useEffect } from "react";
import { Card, CardBody, CardHeader, Col, Input, Label, Row, Table } from "reactstrap";
import { v4 as uuidv4 } from 'uuid';
import AppIcon from "../../../components/AppIcon";
import { OrderStockReleaseEntry } from "../types"

interface Props {
    items?: OrderStockReleaseEntry[];
    onChange: (e: OrderStockReleaseEntry[]) => void;
    error?: string;
    touched?: boolean;
    disabled?: boolean;
    showDeliveredQty: boolean;
}

export default function StockReleaseEntriesTable({ items = [], onChange, error, touched, disabled, showDeliveredQty }: Props) {
    const addNewItem = () => {
        var newEntry: OrderStockReleaseEntry = {
            id: uuidv4(),
            entryNo: '',
            obRef: '',
            quantity: 0,
            deliveredQuantity: 0
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
                    <Label><b>Stock Release Entries</b></Label>
                </Col>
                <Col className="text-danger">
                    <i><small>{`${error && touched ? error : ''}`}</small></i>
                </Col>
                {
                    !disabled && <Col className="text-end" xs="auto">
                        <AppIcon icon="sync"
                            onClick={() => console.log('auto fill')}
                            className="text-success"
                            title="Auto fill"
                            mode="button" />
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
                        <td>Entry No</td>
                        <td>OB Ref.</td>
                        <td>Quantity</td>
                        {showDeliveredQty && <td>Delivered Quantity</td>}
                        {!disabled && <td></td>}
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => <tr key={item.id}>
                        <td><Input maxLength={20} value={item.entryNo} disabled={disabled} name="entryNo" onChange={(e) => updateItem(item.id, e)} /></td>
                        <td><Input maxLength={20} value={item.obRef} disabled={disabled} name="obRef" onChange={(e) => updateItem(item.id, e)} /></td>
                        <td><Input disabled={disabled} value={item.quantity} name="quantity" type="number" step="0.0001" onChange={(e) => updateItem(item.id, e)} /></td>
                        {showDeliveredQty && <td><Input disabled={disabled} value={item.deliveredQuantity} name="deliveredQuantity" type="number" step="0.0001" onChange={(e) => updateItem(item.id, e)} /></td>}
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