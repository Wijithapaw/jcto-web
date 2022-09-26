import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Col, Input, Label, Row, Table } from "reactstrap";
import { v4 as uuidv4 } from 'uuid';
import { IDictionary } from "../../../app/types";
import AppIcon from "../../../components/AppIcon";
import { entryApi } from "../../entry/entry-api";
import { EntryRemaningApproval } from "../../entry/types";
import { OrderStockReleaseEntry } from "../types"
import RemainingApprovalsSelect from "./RemainingApprovalsSelect";

interface Props {
    items?: OrderStockReleaseEntry[];
    orderId?: string;
    onChange: (e: OrderStockReleaseEntry[]) => void;
    error?: string;
    touched?: boolean;
    disabled?: boolean;
    showDeliveredQty: boolean;
}

export default function StockReleaseEntriesTable({ items = [], orderId, onChange, error, touched, disabled, showDeliveredQty }: Props) {
    const [remApprovals, setRemApprovals] = useState<IDictionary<EntryRemaningApproval[]>>({});
    const [approvalsLoaded, setApprovalsLoaded] = useState(false);

    useEffect(() => {
        if (!approvalsLoaded && items.length > 0) {
            items.forEach(i => getRemainingApprovals(i.entryNo));
            setApprovalsLoaded(true);
        }
    }, [items])

    useEffect(() => {
        orderId && items.forEach(i => getRemainingApprovals(i.entryNo));
    }, [orderId])

    const refreshBalances = (entryNo: string) => {
        getRemainingApprovals(entryNo);
    }

    const addNewItem = () => {
        var newEntry: OrderStockReleaseEntry = {
            id: uuidv4(),
            entryNo: '',
            obRef: '',
            quantity: 0,
            approvalId: '',
            deliveredQuantity: showDeliveredQty ? 0 : undefined
        };
        const newEntries = [...items, newEntry];
        onChange(newEntries);
    };

    const deleteItem = (id: string) => {
        const remItems = items.filter(i => i.id !== id);
        onChange(remItems);
    };

    const updateItem = (id: string, e: any) => {
        const updatedItems = [...items];
        const item: any = updatedItems.find(i => i.id === id);
        item[e.target.name] = e.target.type === 'number' ? +e.target.value : e.target.value;

        onChange(updatedItems);
    };

    const getRemainingApprovals = (entryNo: string) => {
        entryNo && entryApi.getRemainingApprovals(entryNo, orderId)
            .then((aprvs) => {
                if (aprvs.length > 0) {
                    setRemApprovals({ ...remApprovals, [aprvs[0].entryNo]: aprvs });
                }
            })
    }

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
                        <AppIcon icon="plus"
                            onClick={addNewItem}
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
                        <td></td>
                        <td width="30%">Approval</td>
                        <td>OB Ref <small className="text-muted ms-1"><small><i>[leave empty to auto gen]</i></small></small></td>
                        <td>Quantity</td>
                        {showDeliveredQty && <td>Delivered Quantity</td>}
                        {!disabled && <td></td>}
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => <tr key={item.id}>
                        <td>
                            <Input
                                maxLength={20}
                                value={item.entryNo}
                                disabled={disabled}
                                name="entryNo"
                                onBlur={(e) => getRemainingApprovals(e.target.value)}
                                onChange={(e) => updateItem(item.id, e)} />

                        </td>
                        <td>
                            <Label className="text-nowrap">
                                <AppIcon icon="sync"
                                    onClick={() => refreshBalances(item.entryNo)}
                                    className="text-success mt-2"
                                    title="Auto fill"
                                    size="sm"
                                    mode="button" />
                            </Label>
                        </td>
                        <td>
                            <RemainingApprovalsSelect
                                name="approvalId"
                                disabled={disabled}
                                selectedValue={item.approvalId}
                                options={remApprovals[item.entryNo] || []}
                                onChange={(val) => {
                                    updateItem(item.id, { target: { name: 'approvalId', value: val } })
                                }} />
                        </td>
                        <td><Input maxLength={20} value={item.obRef} disabled={disabled} name="obRef" onChange={(e) => updateItem(item.id, e)} /></td>
                        <td><Input disabled={disabled} value={item.quantity} name="quantity" type="number" step="0.001" onChange={(e) => updateItem(item.id, e)} /></td>
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